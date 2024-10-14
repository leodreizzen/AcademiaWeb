import {PrismaClient} from "@prisma/client";
import {enhance, PrismaClient as zPrismaClient} from "@zenstackhq/runtime";
import fs from "fs";
import {PersonListSchema, PersonList} from "@/lib/models/seeder/person";
import path from "node:path";

const prisma: zPrismaClient = enhance(new PrismaClient({transactionOptions: {timeout: 15000, maxWait: 15000}}), {user: {role: "Superuser", id: 1}} );


const grades = ["1º año", "2º año", "3º año", "4º año", "5º año", "6° año"]

function getJsonFromFile(path: string){
    const rawdata = fs.readFileSync(path).toString();
    return JSON.parse(rawdata);
}


const dataRaw = getJsonFromFile(path.join("prisma","data.json"))

const data: PersonList = PersonListSchema.parse(dataRaw)

async function createGrades(prisma: zPrismaClient) {
    console.log("Creating grades")
    for (const grade of grades) {
        await prisma.grade.create({
            data: {
                name: grade
            }
        })
    }
}

async function createSubjects(prisma: zPrismaClient) {
    console.log("Creating subjects")
    console.log("Progress 0%")
    const subjects = ["Matemáticas", "Lengua", "Historia", "Geografía", "Biología", "Física", "Química", "Educación Física", "Arte", "Música", "Inglés", "Computación"]
    for (let i = 0; i < grades.length; i++) {
        const grade = grades[i]
        for (let j = 0; j < subjects.length; j++) {
            const subject = subjects[j]
            await prisma.subject.create({
                data: {
                    name: subject,
                    grade: {
                        connect: {
                            name: grade
                        }
                    }
                }
            })
            console.log(`Progress: ${((i*subjects.length + j + 1)/(grades.length*subjects.length)*100).toFixed(2)}%`)
        }
    }
}


async function createUsers(prisma: zPrismaClient) {
    console.log("Creating users")
    console.log(`Progress: 0%`)

    for (let i = 0; i < data.length; i++) {
        const person = data[i];
        await prisma.user.create({
            data: {
                dni: person.dni,
                firstName: person.firstName,
                lastName: person.lastName,
                password: person.password,
            }
        })

        if(person.roles.includes("student")){
            if(!person.parentDnis)
                throw new Error("Parent dnis not found")
            /* Its assumed parents are created before students */
            const parents = await prisma.parent.findMany({
                where: {
                    dni: {
                        in: person.parentDnis
                    }
                }
            })
            await prisma.student.create({
                data: {
                    parents: {
                        connect: parents.map(parent => ({id: parent.id}))
                    },
                    user: {
                        connect: {
                            dni: person.dni
                        }
                    },
                    grade: {
                        connect: {
                            name: person.grade
                        }
                    },
                    address: person.address,
                    phoneNumber: person.phoneNumber,
                    email: person.email
                }
            })
        }

        if (person.roles.includes("teacher")) {
            if(!person.subjects)
                throw new Error("Subjects not found")
            await prisma.teacher.create({
                data: {
                    user: {
                        connect: {
                            dni: person.dni
                        }
                    },
                    address: person.address,
                    phoneNumber: person.phoneNumber,
                    email: person.email,
                    subjects: {
                        connect: person.subjects.map(([grade, subject]) => ({
                            gradeName_name: {
                                gradeName: grade,
                                name: subject
                            }
                        }))
                    }
                }
            })
        }

        if (person.roles.includes("parent")) {
            await prisma.parent.create({
                data: {
                    user: {
                        connect: {
                            dni: person.dni
                        }
                    },
                    address: person.address,
                    phoneNumber: person.phoneNumber,
                    email: person.email
                }
            })
        }

        if (person.roles.includes("administrator")) {
            await prisma.administrator.create({
                data: {
                    user: {
                        connect: {
                            dni: person.dni
                        }
                    },
                    address: person.address,
                    phoneNumber: person.phoneNumber,
                    email: person.email
                }
            })
        }
        console.log(`Progress: ${((i+1)/data.length*100).toFixed(2)}%`)
    }
}

async function seed(){
    await createGrades(prisma)
    await createSubjects(prisma)
    await createUsers(prisma)
}
seed().catch(console.error)