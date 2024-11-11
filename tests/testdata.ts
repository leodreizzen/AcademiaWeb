import {Profile, UserList, UserListSchema, UserSchema} from "../scripts/seeder/test_data/person";
import fs from "fs";
import path from "node:path";
import {z} from "zod";
import {TestDataSchema} from "../scripts/seeder/test_data/testData";

function getJsonFromFile(path: string) {
    const rawdata = fs.readFileSync(path).toString();
    return JSON.parse(rawdata);
}

export function getTestUser(alias: string) {
    const dataRaw = getJsonFromFile(path.join("prisma", "data.json"))

    const data: UserList = TestDataSchema.parse(dataRaw).users;

    const testuser = data.find(d => d.alias === alias)
    if (!testuser)
        throw new Error("test user not found with alias " + alias)
    return testuser
}

function hasRole<P extends Profile, R extends P["role"]>(profile: P, role: R): profile is P & { role: R } {
    return profile.role === role;
}

export function getTestUserWithRole<Role extends Profile["role"]>(alias: string, role: Role): z.infer<typeof UserSchema> & Profile & {
    role: Role
} {
    const testuser = getTestUser(alias)
    const requiredProfile = testuser.profiles.find(p => hasRole(p, role))
    if (!requiredProfile)
        throw new Error(`test user with alias ${alias} does not have a profile with role ${role}`)

    return {...testuser, ...requiredProfile}
}


export function getTestUserChildren(alias: string) {
    const dataRaw = getJsonFromFile(path.join("prisma", "data.json"))

    const data: UserList = TestDataSchema.parse(dataRaw).users;

    const testuser = getTestUserWithRole(alias, "Parent")
    const children = data.filter(d => d.profiles.find(p => p.role === "Student" && p.parentDnis.includes(testuser.dni)))
    return children.map(children => {
        const studentProfile = children.profiles.find(p => p.role === "Student" && p.parentDnis.includes(testuser.dni))
        if (!studentProfile)
            throw new Error(`test user with alias ${alias} is not parent of student with dni ${children.dni}`)
        return {...children, ...studentProfile}
    })
}

export function getTestReportCard(releasedFirst: boolean, releasedSecond: boolean) {
    const dataRaw = getJsonFromFile(path.join("prisma", "data.json"))

    const data = TestDataSchema.parse(dataRaw);
    const reportCard = data.reportCards.find(rc => rc.firstSemesterReleased === releasedFirst && rc.secondSemesterReleased === releasedSecond)

    if (!reportCard) {
        throw new Error(`report card not found with first semester released ${releasedFirst} and second semester released ${releasedSecond}`)
    }
    return reportCard
}

export function getTestStudentWithoutReportCards() {
    const dataRaw = getJsonFromFile(path.join("prisma", "data.json"))

    const data = TestDataSchema.parse(dataRaw);
    const grades = Array.from(new Set(data.users.map(u => u.profiles.find(p => p.role === "Student")?.grade))).filter(g => g)
    const gradeWithoutReportCard = grades.find(g => !data.reportCards.find(rc => rc.grade === g))

    const student = data.users.find(u => u.profiles.find(p => p.role === "Student" && p.grade === gradeWithoutReportCard));
    if (!student) {
        throw new Error(`student without report cards not found`)
    }
    return getTestUserByDniWithRole(student.dni, "Student")
}

export function getTestUserByDni(dni: number) {
    const dataRaw = getJsonFromFile(path.join("prisma", "data.json"))

    const users: UserList = TestDataSchema.parse(dataRaw).users;

    const testuser = users.find(d => d.dni === dni)
    if (!testuser)
        throw new Error("test user not found with dni " + dni)
    return testuser
}

export function getTestUserByDniWithRole<Role extends Profile["role"]>(dni: number, role: Role): z.infer<typeof UserSchema> & Profile & {
    role: Role
} {
    const testuser = getTestUserByDni(dni)
    const requiredProfile = testuser.profiles.find(p => hasRole(p, role))
    if (!requiredProfile)
        throw new Error(`test user with dni ${dni} does not have a profile with role ${role}`)

    return {...testuser, ...requiredProfile}
}