import {PrismaClient} from "@prisma/client";
import {enhance, PrismaClient as zPrismaClient} from "@zenstackhq/runtime";
import {Faker, es} from '@faker-js/faker'

const faker = new Faker({locale: [es]})
const prisma: zPrismaClient = enhance(new PrismaClient(), {user: {role: "Superuser", id: 1}} );

async function createGrades(prisma: zPrismaClient) {
    const grades = ["1º año", "2º año", "3º año", "4º año", "5º año", "6° año"]
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
    for (const subject of subjects) {
        await prisma.subject.create({
            data: {
                name: subject,
                grade: {
                    connect: {
                        name: "1º año"
                    }
                }
            }
        })
    }
}


async function createUsers(prisma: zPrismaClient) {
    const email = "leodreizzen@gmail.com"
    const student = await prisma.student.create({
        data: {
            phoneNumber: faker.phone.number({style: 'international'}),
            email: email,
            grade: {
                connect: {
                    name: "1º año"
                }
            },
            address: faker.location.streetAddress({useFullAddress: true}),
            user: {
                create: {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    dni: 11111111,
                    password: "alumno"
                }
            }
        }
    })

    const parentTeacherStudent = await prisma.student.create({
        data: {
            phoneNumber: faker.phone.number({style: 'international'}),
            email: email,
            grade: {
                connect: {
                    name: "1º año"
                }
            },
            address: faker.location.streetAddress({useFullAddress: true}),
            user: {
                create: {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    dni: 55555555,
                    password: "alumno"
                }
            }
        }
    })

    await prisma.teacher.create({
        data: {
            phoneNumber: faker.phone.number({style: 'international'}),
            email: email,
            address: faker.location.streetAddress({useFullAddress: true}),
            user: {
                create: {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    dni: 22222222,
                    password: "profesor"
                }
            },
            subjects: {
                connect: {
                    id: 2
                }
            }
        }
    })

    await prisma.administrator.create({
        data: {
            phoneNumber: faker.phone.number({style: 'international'}),
            email: email,
            address: faker.location.streetAddress({useFullAddress: true}),
            user: {
                create: {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    dni: 33333333,
                    password: "admin"
                }
            }
        }
    })

    await prisma.parent.create({
        data: {
            phoneNumber: faker.phone.number({style: 'international'}),
            email: email,
            address: faker.location.streetAddress({useFullAddress: true}),
            user: {
                create: {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    dni: 44444444,
                    password: "padre"
                }
            },
            children: {
                connect: {
                    id: student.id
                }
            }
        }
    })

    const parentTeacherPhoneNumber = faker.phone.number({style: 'international'})
    const parentTeacherAddress = faker.location.streetAddress({useFullAddress: true})

    await prisma.parent.create({
        data: {
            phoneNumber: parentTeacherPhoneNumber,
            email: email,
            address: parentTeacherAddress,
            user: {
                create: {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    dni: 66666666,
                    password: "padre"
                }
            },
            children: {
                connect: {
                    id: parentTeacherStudent.id
                }
            }
        }
    })

    await prisma.teacher.create({
        data: {
            phoneNumber: parentTeacherPhoneNumber,
            email: email,
            address: parentTeacherAddress,
            user: {
                connect: {
                    dni: 66666666
                }
            },
            subjects: {
                connect: {
                    id: 1
                }
            }
        }
    })

    const teacherAdminPhoneNumber = faker.phone.number({style: 'international'})
    const teacherAdminAddress = faker.location.streetAddress({useFullAddress: true})

    await prisma.teacher.create({
        data: {
            phoneNumber: teacherAdminPhoneNumber,
            email: email,
            address: teacherAdminAddress,
            user: {
                create: {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    dni: 77777777,
                    password: "profesor"
                }
            }
        }
    })

    await prisma.administrator.create({
        data: {
            phoneNumber: teacherAdminPhoneNumber,
            email: email,
            address: teacherAdminAddress,
            user: {
                connect: {
                    dni: 77777777
                }
            }
        }
    })
}

async function seed(){
    await createGrades(prisma)
    await createSubjects(prisma)
    await createUsers(prisma)
}
seed().catch(console.error)