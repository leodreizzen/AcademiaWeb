import {PrismaClient} from "@prisma/client";
import {enhance, PrismaClient as zPrismaClient} from "@zenstackhq/runtime";
import fs from "fs";
import {PersonListSchema, PersonList, StudentType} from "@/lib/models/seeder/person";

const prisma: zPrismaClient = enhance(new PrismaClient(), {user: {role: "Superuser", id: 1}} );


const grades = ["1º año", "2º año", "3º año", "4º año", "5º año", "6° año"]

function getJsonFromFile(path: string){
    const rawdata = fs.readFileSync(path).toString();
    return JSON.parse(rawdata);
}


const dataRaw = getJsonFromFile("data.json")

const data: PersonList = PersonListSchema.parse(dataRaw)

async function createGrades(prisma: zPrismaClient) {
    for (const grade of grades) {
        await prisma.grade.create({
            data: {
                name: grade
            }
        })
    }
}

async function createSubjects(prisma: zPrismaClient) {
    const subjects = ["Matemáticas", "Lengua", "Historia", "Geografía", "Biología", "Física", "Química", "Educación Física", "Arte", "Música", "Inglés", "Computación"]
    for (const grade of grades) {
        for (const subject of subjects) {
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
        }
    }
}


async function createUsers(prisma: zPrismaClient) {

    for (const person of data) {
        await prisma.user.create({
            data: {
                dni: person.dni,
                firstName: person.firstName,
                lastName: person.lastName,
                password: person.password,
            }
        })

        if(person.roles.includes("student")){
            const student = person as StudentType

            /* Its assumed parents are created before students */

            const parents = await prisma.parent.findMany({
                where: {
                    dni: {
                        in: student.parentDnis
                    }
                }
            })
            await prisma.student.create({
                data: {
                    parents: {
                        connect: parents
                    },
                    user: {
                        connect: {
                            dni: person.dni
                        }
                    },
                    grade: {
                        connect: {
                            name: grades[Math.floor(Math.random() * grades.length)]
                        }
                    },
                    address: person.address,
                    phoneNumber: person.phoneNumber,
                    email: person.email
                }
            })
        }

        if (person.roles.includes("teacher")) {
            await prisma.teacher.create({
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
    }
}

async function seed(){
    await createGrades(prisma)
    await createSubjects(prisma)
    await createUsers(prisma)
}
seed().catch(console.error)