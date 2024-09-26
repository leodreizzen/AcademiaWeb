import {PrismaClient} from "@prisma/client";
import {enhance, PrismaClient as zPrismaClient} from "@zenstackhq/runtime";
import {Faker, es} from '@faker-js/faker'

const faker = new Faker({locale: [es]})
const prisma: zPrismaClient = enhance(new PrismaClient(), {user: {role: "Superuser", id: 1}} );

async function createGrades(prisma: zPrismaClient) {
    await prisma.grade.create({
        data: {
            name: "1º año"
        }
    })
}

async function createUsers(prisma: zPrismaClient) {
    await prisma.student.create({
        data: {
            phoneNumber: faker.phone.number({style: 'international'}),
            email: "leodreizzen@gmail.com",
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
    })}

async function seed(){
    await createGrades(prisma)
    await createUsers(prisma)
}
seed().catch(console.error)