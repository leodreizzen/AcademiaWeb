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

    const studentWithTwoReprimands = await prisma.student.create({
        data: {
            user: {
                create: {
                    dni: 14141314,
                    firstName: "Hermina",
                    lastName: "Mohr",
                    password: "+$iiD*5MYM5Y"
                }
            },
            grade: {
                connect: {
                    name: "3º año"
                }
            },
            parents: {
                create: {
                    user: {
                        create: {
                            dni: 12121516,
                            firstName: "Patrick",
                            lastName: "Johns",
                            password: "R^Ed+Es0_f8r"
                        }
                    },
                    address: "675 6th Street Apt. 697",
                    phoneNumber: "+13214786260",
                    email: "Dustin_Veum34@yahoo.com",
                    birthdate: new Date("1990-04-21"),
                }
            },
            address: "675 6th Street Apt. 697",
            phoneNumber: "+19464413146",
            email: "Nils_Morar48@gmail.com",
            birthdate: new Date("2008-08-11"),
        }
    })

    const teacherTwoReprimands = await prisma.teacher.create({
        data: {
            user: {
                create: {
                    dni: 12121213,
                    firstName: "Imogene",
                    lastName: "Orn",
                    password: ">aH9n5wBy_It"
                }
            },
            address: "97120 Sanford Hills Apt. 726",
            phoneNumber: "+15203111694",
            email: "Anya_Weissnat1@yahoo.com",
            subjects: {
                connect: [
                    {
                        gradeName_name: {
                            gradeName: "3º año",
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
                    id: studentWithTwoReprimands.id
                }
            },
            message: "Tiró un util escolar por la ventana.",
            dateTime: new Date(),
            Teacher: {
                connect: {
                    id: teacherTwoReprimands.id
                }
            }
        }
    })

    await prisma.reprimand.create({
        data: {
            students: {
                connect: {
                    id: studentWithTwoReprimands.id
                }
            },
            message: "Rompio un banco a propósito.",
            dateTime: new Date(),
            Teacher: {
                connect: {
                    id: teacherTwoReprimands.id
                }
            }
        }
    })

    const studentWithOneReprimand = await prisma.student.create({
        data: {
            user: {
                create: {
                    dni: 14141315,
                    firstName: "Jade",
                    lastName: "Heller",
                    password: "JRA+WxP6as=("
                }
            },
            grade: {
                connect: {
                    name: "4º año"
                }
            },
            parents: {
                create: {
                    user: {
                        create: {
                            dni: 12121517,
                            firstName: "Geo",
                            lastName: "Little",
                            password: "!X)0ijnVsI@5"
                        }
                    },
                    address: "5539 Elinore Dam Suite 520",
                    phoneNumber: "+18944317300",
                    email: "Aniyah_Erdman22@gmail.com",
                    birthdate: new Date("1990-04-21"),
                }
            },
            address: "5539 Elinore Dam Suite 520",
            phoneNumber: "+16719766023",
            email: "Katrine87@gmail.com",
            birthdate: new Date("2008-08-11"),
        }
    })

    const teacherOneReprimand = await prisma.teacher.create({
        data: {
            user: {
                create: {
                    dni: 12121214,
                    firstName: "Myah",
                    lastName: "Deckow",
                    password: "kO+W%6e0oAoU"
                }
            },
            address: "5306 The Oval Suite 507",
            phoneNumber: "+13463278552",
            email: "Royce55@yahoo.com",
            subjects: {
                connect: [
                    {
                        gradeName_name: {
                            gradeName: "4º año",
                            name: "Matemáticas"
                        }
                    }
                ]
            },
        }
    })

    await prisma.reprimand.create({
        data: {
            students: {
                connect: {
                    id: studentWithOneReprimand.id
                }
            },
            message: "Usó el teléfono a escondidas en un exámen.",
            dateTime: new Date(),
            Teacher: {
                connect: {
                    id: teacherOneReprimand.id
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

    const secondStudentForFirstExam = await prisma.student.create({
        data: {
            user: {
                create: {
                    dni: 14141316,
                    firstName: "Britney",
                    lastName: "Harvey",
                    password: "We(AD5O@I@8*"
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
                            firstName: "Gregoria",
                            lastName: "Watsica",
                            password: "=8)N5$<c!GNf"
                        }
                    },
                    address: "6540 Third Street Apt. 520",
                    phoneNumber: "+19885293824",
                    email: "Doyle.McLaughlin12@yahoo.com",
                    birthdate: new Date("1990-04-21")
                }
            },
            address: "6540 Third Street Apt. 520",
            phoneNumber: "+12382535911",
            email: "Aurelie.Corkery@yahoo.com",
            birthdate: new Date("2008-08-11")
        }
    })

    const thirdStudentForFirstExam = await prisma.student.create({
        data: {
            user: {
                create: {
                    dni: 14141317,
                    firstName: "Anissa",
                    lastName: "Lindgren",
                    password: "Gs8=t&t_?*GH"
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
                            dni: 12121516,
                            firstName: "Reggie",
                            lastName: "Mante-Lubowitz",
                            password: "gE<W5k!=u$Ik"
                        }
                    },
                    address: "84856 University Avenue Apt. 574",
                    phoneNumber: "+18266199048",
                    email: "Daija.Schowalter26@yahoo.com",
                    birthdate: new Date("1990-04-21")
                }
            },
            address: "84856 University Avenue Apt. 574",
            phoneNumber: "+16763641080",
            email: "Amara_Strosin8@hotmail.com",
            birthdate: new Date("2008-08-11")
        }
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
            date: new Date("2024-06-01"),
            marks: {
                create: [
                    {
                        student: {
                            connect: {
                                id: student.id
                            }
                        },
                        mark: 7
                    },
                    {
                        student: {
                            connect: {
                                id: secondStudentForFirstExam.id
                            }
                        },
                        mark: 5
                    },
                    {
                        student: {
                            connect: {
                                id: thirdStudentForFirstExam.id
                            }
                        },
                        mark: 9
                    }
                ]
            }
        }
    })

    const studentWithTwoExams = await prisma.profile.findUniqueOrThrow({
        where: {
            dni_role: {
                dni: 14141314,
                role: "student"
            }
        },
    })

    const secondStudentForSecondExam = await prisma.student.create({
        data: {
            user: {
                create: {
                    dni: 14141318,
                    firstName: "Allen",
                    lastName: "Schowalter",
                    password: "7zsFg$Ghm&V%"
                }
            },
            grade: {
                connect: {
                    name: "3º año"
                }
            },
            parents: {
                create: {
                    user: {
                        create: {
                            dni: 12121517,
                            firstName: "Lucinda",
                            lastName: "Powlowski",
                            password: "v28Aww8&9Qtz"
                        }
                    },
                    address: "43854 S Main Suite 869",
                    phoneNumber: "+15147608135",
                    email: "Thurman.Schaefer95@hotmail.com",
                    birthdate: new Date("1990-04-21")
                }
            },
            address: "43854 S Main Suite 869",
            phoneNumber: "+14139457826",
            email: "Cassandre_Fadel1@gmail.com",
            birthdate: new Date("2008-08-11")
        }
    })

    const thirdStudentForSecondExam = await prisma.student.create({
        data: {
            user: {
                create: {
                    dni: 14141319,
                    firstName: "Violette",
                    lastName: "Carroll",
                    password: "zPI_t0&d@RPI"
                }
            },
            grade: {
                connect: {
                    name: "3º año"
                }
            },
            parents: {
                create: {
                    user: {
                        create: {
                            dni: 12121518,
                            firstName: "Peter",
                            lastName: "Hamill",
                            password: "Zi6#kqp6sJPI"
                        }
                    },
                    address: "64692 Klocko Haven Apt. 554",
                    phoneNumber: "+16857891088",
                    email: "Raymond.Gerlach43@hotmail.com",
                    birthdate: new Date("1990-04-21")
                }
            },
            address: "64692 Klocko Haven Apt. 554",
            phoneNumber: "+14493227056",
            email: "Grayson.Champlin99@yahoo.com",
            birthdate: new Date("2008-08-11")
        }
    })

    await prisma.exam.create({
        data: {
            subject: {
                connect: {
                    gradeName_name: {
                        gradeName: "3º año",
                        name: "Matemáticas"
                    }
                }
            },
            date: new Date("2024-06-01"),
            marks: {
                create: [
                    {
                        student: {
                            connect: {
                                id: studentWithTwoExams.id
                            }
                        },
                        mark: 6
                    },
                    {
                        student: {
                            connect: {
                                id: secondStudentForSecondExam.id
                            }
                        },
                        mark: 5
                    },
                    {
                        student: {
                            connect: {
                                id: thirdStudentForSecondExam.id
                            }
                        },
                        mark: 9
                    }
                ]
            }
        }
    })

    await prisma.exam.create({
        data: {
            subject: {
                connect: {
                    gradeName_name: {
                        gradeName: "3º año",
                        name: "Matemáticas"
                    }
                }
            },
            date: new Date("2024-06-02"),
            marks: {
                create: [
                    {
                        student: {
                            connect: {
                                id: studentWithTwoExams.id
                            }
                        },
                        mark: 8
                    },
                    {
                        student: {
                            connect: {
                                id: secondStudentForSecondExam.id
                            }
                        },
                        mark: 6
                    },
                    {
                        student: {
                            connect: {
                                id: thirdStudentForSecondExam.id
                            }
                        },
                        mark: 10
                    }
                ]
            }
        }
    })

    await prisma.exam.create({
        data: {
            subject: {
                connect: {
                    gradeName_name: {
                        gradeName: "3º año",
                        name: "Lengua"
                    }
                }
            },
            date: new Date("2024-06-03"),
            marks: {
                create: [
                    {
                        student: {
                            connect: {
                                id: studentWithTwoExams.id
                            }
                        },
                        mark: 9
                    },
                    {
                        student: {
                            connect: {
                                id: secondStudentForSecondExam.id
                            }
                        },
                        mark: 7
                    },
                    {
                        student: {
                            connect: {
                                id: thirdStudentForSecondExam.id
                            }
                        },
                        mark: 10
                    }
                ]
            }
        }
    })

    const studentWithOneExam = await prisma.profile.findUniqueOrThrow({
        where: {
            dni_role: {
                dni: 14141315,
                role: "student"
            }
        },
    })

    const studentWithOneExam2 = await prisma.student.create({
        data: {
            user: {
                create: {
                    dni: 14141320,
                    firstName: "Mercedes",
                    lastName: "Deckow",
                    password: "Zy%mM5W%(@C7"
                }
            },
            grade: {
                connect: {
                    name: "4º año"
                }
            },
            parents: {
                create: {
                    user: {
                        create: {
                            dni: 12121517,
                            firstName: "Aisha",
                            lastName: "Dibbert",
                            password: "GcqC^q76aVo1"
                        }
                    },
                    address: "58015 Sadye Cliff Apt. 244",
                    phoneNumber: "+15077052911",
                    email: "Orin.Franey@gmail.com",
                    birthdate: new Date("1990-04-21"),
                }
            },
            address: "58015 Sadye Cliff Apt. 244",
            phoneNumber: "+15248788790",
            email: "Aryanna_Roberts@gmail.com",
            birthdate: new Date("2008-08-11"),
        }
    })

    const studentWithOneExam3 = await prisma.student.create({
        data: {
            user: {
                create: {
                    dni: 14141321,
                    firstName: "Marjolaine",
                    lastName: "Emmerich",
                    password: "o&MmqR<I3$0a"
                }
            },
            grade: {
                connect: {
                    name: "4º año"
                }
            },
            parents: {
                create: {
                    user: {
                        create: {
                            dni: 12121517,
                            firstName: "Chelsea",
                            lastName: "Cole",
                            password: "5Ol7*EK=qu)="
                        }
                    },
                    address: "5810 S High Street Suite 541",
                    phoneNumber: "+19445951880",
                    email: "Sam9@gmail.com",
                    birthdate: new Date("1990-04-21"),
                }
            },
            address: "5810 S High Street Suite 541",
            phoneNumber: "+14398967244",
            email: "Domenic_Nikolaus-Kuhlman33@yahoo.com",
            birthdate: new Date("2008-08-11"),
        }
    })

    await prisma.exam.create({
        data: {
            subject: {
                connect: {
                    gradeName_name: {
                        gradeName: "4º año",
                        name: "Matemáticas"
                    }
                }
            },
            date: new Date("2024-06-01"),
            marks: {
                create: [
                    {
                        student: {
                            connect: {
                                id: studentWithOneExam.id
                            }
                        },
                        mark: 8
                    },
                    {
                        student: {
                            connect: {
                                id: studentWithOneExam2.id
                            }
                        },
                        mark: 6
                    },
                    {
                        student: {
                            connect: {
                                id: studentWithOneExam3.id
                            }
                        },
                        mark: 10
                    }
                ]
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