import { AttendanceItem, PrismaClient} from "@prisma/client";
import fs from "fs";
import {
    StudentProfile,
    TeacherProfile,
    ParentProfile, AdminProfile
} from "./test_data/person";
import path from "node:path";
import {hashPassword} from "@/lib/data/passwords";
import {z} from "zod";
import {AttendanceItemSchema, TestDataSchema} from "./test_data/testData";

const prisma = new PrismaClient({transactionOptions: {timeout: 15000, maxWait: 15000}});


const grades = ["1º año", "2º año", "3º año", "4º año", "5º año", "6° año"]


function getJsonFromFile(path: string) {
    const rawdata = fs.readFileSync(path).toString();
    return JSON.parse(rawdata);
}


const dataRaw = getJsonFromFile(path.join("prisma", "data.json"))

const data = TestDataSchema.parse(dataRaw)

const studentMap = new Map<number, number>();
const parentMap = new Map<number, number>();
const teacherMap = new Map<number, number>();
const adminMap = new Map<number, number>();

function getStudentId(dni: number): number {
    return studentMap.get(dni) ?? throwError("Student not found with DNI " + dni)
}

function getParentId(dni: number): number {
    return parentMap.get(dni) ?? throwError("Parent not found with DNI " + dni)
}

function getTeacherId(dni: number): number {
    return teacherMap.get(dni) ?? throwError("Teacher not found with DNI " + dni)
}

function getAdminId(dni: number): number {
    return adminMap.get(dni) ?? throwError("Admin not found with DNI " + dni)
}


async function createGrades() {
    console.log("Creating grades")
    console.log("Progress 0%")
    for(let i = 0; i < grades.length; i++) {
        const grade = grades[i];
        await prisma.grade.create({
            data: {
                name: grade
            }
        })
        console.log(`Progress: ${((i + 1) / grades.length * 100).toFixed(2)}%`)
    }
}

async function createSubjects() {
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
            console.log(`Progress: ${((i * subjects.length + j + 1) / (grades.length * subjects.length) * 100).toFixed(2)}%`)
        }
    }
}

async function createUsers() {
    const users = data.users;

    console.log("Creating users")
    console.log(`Progress: 0%`)

    for (let i = 0; i < users.length; i++) {
        const person = users[i];
        await prisma.user.create({
            data: {
                dni: person.dni,
                firstName: person.firstName,
                lastName: person.lastName,
                passwordHash: await hashPassword(person.password)
            }
        })
        console.log(`Progress: ${((i + 1) / users.length * 100).toFixed(2)}%`)
    }

    console.log("Creating profiles")
    console.log(`Progress: 0%`)
    const profileCount = users.reduce((acc, person) => acc + person.profiles.length, 0)
    const studentProfiles: { dni: number, profile: StudentProfile }[] = [];
    const teacherProfiles: { dni: number, profile: TeacherProfile }[] = [];
    const parentProfiles: { dni: number, profile: ParentProfile }[] = [];
    const adminProfiles: { dni: number, profile: AdminProfile }[] = [];
    users.forEach(person => {
        person.profiles.forEach(profile => {
            switch (profile.role) {
                case "Student":
                    studentProfiles.push({dni: person.dni, profile})
                    break;
                case "Teacher":
                    teacherProfiles.push({dni: person.dni, profile})
                    break;
                case "Parent":
                    parentProfiles.push({dni: person.dni, profile})
                    break;
                case "Administrator":
                    adminProfiles.push({dni: person.dni, profile})
                    break;
            }
        })
    })


    let created = 0;
    for (const profile of parentProfiles) {
        await createParent(profile.dni, profile.profile) // parents must be created first because students need to connect to them
        created++
        console.log(`Progress: ${((created) / profileCount * 100).toFixed(2)}%`)
    }
    for (const profile of studentProfiles) {
        await createStudent(profile.dni, profile.profile)
        created++
        console.log(`Progress: ${((created) / profileCount * 100).toFixed(2)}%`)
    }
    for (const profile of teacherProfiles) {
        await createTeacher(profile.dni, profile.profile)
        created++
        console.log(`Progress: ${((created) / profileCount * 100).toFixed(2)}%`)
    }
    for (const profile of adminProfiles) {
        await createAdmin(profile.dni, profile.profile)
        created++
        console.log(`Progress: ${((created) / profileCount * 100).toFixed(2)}%`)
    }
}

async function createStudent(dni: number, profileData: StudentProfile) {
    const parents = profileData.parentDnis.map(getParentId).map((id) => ({id}));
    const student = await prisma.student.create({
        data: {
            profile: {
                create: {
                    role: profileData.role,
                    email: profileData.email,
                    user: {
                        connect: {
                            dni: dni
                        }
                    }
                }
            },
            grade: {
                connect: {
                    name: profileData.grade
                }
            },
            address: profileData.address,
            phoneNumber: profileData.phoneNumber,
            birthdate: profileData.birthDate,
            parents: {
                connect: parents
            }
        }
    })
    studentMap.set(dni, student.id)
}

async function createTeacher(dni: number, profileData: TeacherProfile) {
    const teacher = await prisma.teacher.create({
        data: {
            profile: {
                create: {
                    user: {
                        connect: {
                            dni: dni
                        }
                    },
                    role: profileData.role,
                    email: profileData.email
                }
            },
            address: profileData.address,
            phoneNumber: profileData.phoneNumber,
            subjects: {
                connect: profileData.subjects.map((subject) => ({
                    gradeName_name: {
                        gradeName: subject[0],
                        name: subject[1]
                    }
                }))
            }
        }
    })
    teacherMap.set(dni, teacher.id)
}

async function createParent(dni: number, profileData: ParentProfile) {
    const parent = await prisma.parent.create({
        data: {
            profile: {
                create: {
                    user: {
                        connect: {
                            dni: dni
                        }
                    },
                    role: profileData.role,
                    email: profileData.email
                }
            },
            address: profileData.address,
            phoneNumber: profileData.phoneNumber,
            birthdate: profileData.birthDate
        }
    })
    parentMap.set(dni, parent.id)
}

async function createAdmin(dni: number, profileData: AdminProfile) {
    const admin = await prisma.administrator.create({
        data: {
            profile: {
                create: {
                    user: {
                        connect: {
                            dni: dni
                        }
                    },
                    role: profileData.role,
                    email: profileData.email
                }
            },
            address: profileData.address,
            phoneNumber: profileData.phoneNumber
        }
    })
    adminMap.set(dni, admin.id)
}

async function createReprimands() {
    console.log("Creating reprimands")
    console.log(`Progress: 0%`)
    for (let i = 0; i < data.reprimands.length; i++) {
        const reprimand = data.reprimands[i];
        const teacherId = getTeacherId(reprimand.teacherDni);

        await prisma.reprimand.create({
            data: {
                message: reprimand.message,
                dateTime: reprimand.date,
                teacher: {
                    connect: {
                        id: teacherId
                    }
                },
                students: {
                        create: reprimand.students.map(student => ({
                            student: {
                                connect: {
                                    id: getStudentId(student.dni)
                                }
                            },
                            signature: (student.signature) ? {
                                create: {
                                    parent: {
                                        connect: {
                                            id: getParentId(student.signature.signedByDni)
                                        }
                                    },
                                    signedAt: student.signature.dateTime
                                }
                            } : undefined
                        }))

                },

            }
        })
        console.log(`Progress: ${((i + 1) / data.reprimands.length * 100).toFixed(2)}%`)
    }
}

async function createExams() {
    for (let i = 0; i < data.exams.length; i++) {
        const exam = data.exams[i];
        await prisma.exam.create({
                data: {
                    date: exam.date,
                    subject: {
                        connect: {
                            gradeName_name: {
                                gradeName: exam.subject[0],
                                name: exam.subject[1]
                            }
                        }
                    },
                    marks: {
                        create: exam.marks.map((mark) => ({
                            student: {
                                connect: {
                                    id: studentMap.get(mark.studentDni)
                                }
                            },
                            mark: mark.mark,
                            signature: mark.signature ? {
                                create: {
                                    signedAt: mark.signature.dateTime,
                                    parent: {
                                        connect: {
                                            id: getParentId(mark.signature.signedByDni)
                                        }
                                    }
                                }
                            } : undefined
                        }))
                    }
                }
            }
        )
    }
}

async function createAssignments() {
    console.log("Creating assignments")
    console.log(`Progress: 0%`)
    for (let i = 0; i < data.assignments.length; i++) {
        const assignment = data.assignments[i];
        await prisma.assignment.create({
            data: {
                uploadDate: assignment.uploadDate,
                subject: {
                    connect: {
                        gradeName_name: {
                            gradeName: assignment.subject[0],
                            name: assignment.subject[1]
                        }
                    }
                },
                description: assignment.description,
                title: assignment.title,
                fileUrl: assignment.fileUrl,
                submissions: {
                    create: assignment.submissions.map((submission) => ({
                        uploadDate: submission.uploadDate,
                        fileUrl: submission.fileUrl,
                        student: {
                            connect: {
                                id: studentMap.get(submission.studentDni)
                            }
                        }
                    }))
                }
            }
        })
        console.log(`Progress: ${((i + 1) / data.assignments.length * 100).toFixed(2)}%`)
    }
}

async function createReportCards() {
    for (let i = 0; i < data.reportCards.length; i++) {
        const reportCard = data.reportCards[i];
        const byStudentDni: Map<number, {
            firstSemesterMarks: { subject: string, mark: string }[],
            secondSemesterMarks: { subject: string, mark: string }[],
            finalMarks: { subject: string, mark: number }[]
        }> = new Map();

        const studentDnis = reportCard.firstSemesterMarks.map(subjectMark => subjectMark.marks.map(mark => mark.studentDni)).flat();
        studentDnis.forEach(dni => {
            byStudentDni.set(dni, {
                firstSemesterMarks: [],
                secondSemesterMarks: [],
                finalMarks: []
            })
        });
        reportCard.firstSemesterMarks.forEach(subjectMark => {
            subjectMark.marks.forEach(mark => {
                const studentMarks = byStudentDni.get(mark.studentDni);
                if(!studentMarks) {
                    throwError("Student not found in map (first semester)")
                }
                studentMarks.firstSemesterMarks.push({subject: subjectMark.subject, mark: mark.mark})
            })
        })
        reportCard.secondSemesterMarks.forEach(subjectMark => {
            subjectMark.marks.forEach(mark => {
                const studentMarks = byStudentDni.get(mark.studentDni);
                if(!studentMarks) {
                    throwError("Student not found in map (second semester)")
                }
                studentMarks.secondSemesterMarks.push({subject: subjectMark.subject, mark: mark.mark})
            })
        })
        reportCard.finalMarks.forEach(subjectMark => {
            subjectMark.marks.forEach(mark => {
                const studentMarks = byStudentDni.get(mark.studentDni);
                if(!studentMarks) {
                    throwError("Student not found in map (final)")
                }
                studentMarks.finalMarks.push({subject: subjectMark.subject, mark: mark.mark})
            })
        })


        await prisma.gradeReportCards.create({
            data: {
                grade: {
                    connect: {
                        name: reportCard.grade
                    }
                },
                year: reportCard.year,
                firstSemesterReleased: reportCard.firstSemesterReleased,
                secondSemesterReleased: reportCard.secondSemesterReleased,
                reportCards: {
                    create: Array.from(byStudentDni.keys()).map(dni => {
                        const studentMarks = byStudentDni.get(dni);
                        if(!studentMarks) {
                            throwError("Student not found in map")
                        }
                        return {
                            student: {
                                connect: {
                                    id: getStudentId(dni)
                                }
                            },
                            firstSemesterMarks: {
                                create: studentMarks.firstSemesterMarks.map(mark => ({
                                    subject: {
                                        connect: {
                                            gradeName_name: {
                                                gradeName: reportCard.grade,
                                                name: mark.subject
                                            }
                                        }
                                    },
                                    mark: mark.mark
                                }))
                            },
                            secondSemesterMarks: {
                                create: studentMarks.secondSemesterMarks.map(mark => ({
                                    subject: {
                                        connect: {
                                            gradeName_name: {
                                                gradeName: reportCard.grade,
                                                name: mark.subject
                                            }
                                        }
                                    },
                                    mark: mark.mark
                                }))
                            },
                            finalMarks: {
                                create: studentMarks.finalMarks.map(mark => ({
                                    subject: {
                                        connect: {
                                            gradeName_name: {
                                                gradeName: reportCard.grade,
                                                name: mark.subject
                                            }
                                        }
                                    },
                                    mark: mark.mark
                                }))
                            }
                        }
                    })
                }

            }
        })
        console.log(`Progress: ${((i + 1) / data.reportCards.length * 100).toFixed(2)}%`)
    }
}

function mapAttendanceStatus(status: z.infer<typeof AttendanceItemSchema>["status"]): AttendanceItem["status"] {
    if(status === "present") {
        return "PRESENT"
    }
    else if(status === "absent") {
        return "ABSENT"
    }
    else
        throw new Error("Invalid attendance status")
}

async function createAttendanceData(){
    console.log("Creating attendance data")
    console.log(`Progress: 0%`)
    for(let i = 0; i < data.attendance.length; i++){
        const attendanceData = data.attendance[i];
        await prisma.attendanceData.create({
            data: {
                date: attendanceData.date,
                grade: {
                    connect: {
                        name: attendanceData.grade
                    }
                },
                items: {
                    create: attendanceData.items.map(item => ({
                        student: {
                            connect: {
                                id: getStudentId(item.studentDni)
                            }
                        },
                        status: mapAttendanceStatus(item.status)
                    }))
                }
            }
        })
        console.log(`Progress: ${((i + 1) / data.attendance.length * 100).toFixed(2)}%`)
    }
}

async function createMessages(){
    console.log("Creating messages")
    console.log(`Progress: 0%`)
    for (let i = 0; i < data.messages.length; i++) {
        const message = data.messages[i];
        await prisma.message.create({
            data: {
                sender: {
                    connect: {
                        dni: message.fromDni
                    }
                },
                recipient: {
                    connect: {
                        dni: message.toDni
                    }
                },
                message: message.message,
                date: message.dateTime,
                isRead: message.isRead
            }
        })
        console.log(`Progress: ${((i + 1) / data.messages.length * 100).toFixed(2)}%`)
    }
}

function throwError(message: string): never {
    throw new Error(message)
}

async function seed() {
    await createGrades()
    await createSubjects()
    await createUsers()
    await createReprimands()
    await createExams()
    await createAssignments()
    await createReportCards()
    await createAttendanceData()
    await createMessages();
}

seed().catch(console.error);