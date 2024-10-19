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
                    email: person.email,
                    birthdate: person.dateOfBirth
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
                    email: person.email,
                    birthdate: person.dateOfBirth
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

async function createStudentWithReprimands(prisma: zPrismaClient) {
    const student = await prisma.student.create({
        data: {
            user: {
                create: {
                    dni: 14141313,
                    firstName: "Domenick",
                    lastName: "Cruickshank-Murazik",
                    password: "Ao=xz=V%xvo6"
                }
            },
            grade: {
                connect: {
                    name: "2º año"
                }
            },
            parents: {
                create: {
                        user: {
                            create: {
                                dni: 12121515,
                                firstName: "Kennith",
                                lastName: "Tillman",
                                password: "wb^yuSy!4sR!"
                            }
                        },
                        address: "7172 Alexandra Road Apt. 241",
                        phoneNumber: "+17859001694",
                        email: "Annamae.Berge96@gmail.com",
                        birthdate: new Date("1990-04-21")
                }
            },
            address: "7172 Alexandra Road Apt. 241",
            phoneNumber: "+17986648567",
            email: "Alex_Keebler11@gmail.com",
            birthdate: new Date("2008-08-11")
        }
    })

    const teacher = await prisma.teacher.create({
        data: {
            user: {
                create: {
                    dni: 12121212,
                    firstName: "Myah",
                    lastName: "Deckow",
                    password: "kO+W%6e0oAoU"
                }
            },
            address: "5306 The Oval Suite 507",
            phoneNumber: "+13463278552",
            email: "Wellington_Marvin95@hotmail.com",
            subjects: {
                connect: [
                    {
                        gradeName_name: {
                            gradeName: "2º año",
                            name: "Matemáticas"
                        }
                    }
                ]
            }
        }
    })

    await prisma.reprimand.create({
        data: {
            students: {
                connect: {
                    id: student.id
                }
            },
            message: "Se portó mal.",
            dateTime: new Date(),
            Teacher: {
                connect: {
                    id: teacher.id
                }
            }
        }
    })
}

async function createStudentWithExam(prisma: zPrismaClient) {
    const student = await prisma.profile.findUniqueOrThrow({
        where: {
            dni_role: {
                dni: 14141313,
                role: "student"
            }
        },
    })
    await prisma.exam.create({
        data: {
            subject: {
                connect: {
                    gradeName_name: {
                        gradeName: "2º año",
                        name: "Matemáticas"
                    }
                }
            },
            date: new Date("2021-06-01"),
            marks: {
                create: {
                    student: {
                        connect: {
                            id: student.id
                        }
                    },
                    mark: 10
                }
            }
        }
    })
}

async function seed(){
    await createGrades(prisma)
    await createSubjects(prisma)
    await createUsers(prisma)
    await createStudentWithReprimands(prisma)
    await createStudentWithExam(prisma)
}
seed().catch(console.error)