import {Administrator, Exam, ExamMark, Parent, Profile, Reprimand, Student, Subject, Teacher} from "@prisma/client";
import {StudentWithUser} from "@/lib/definitions/student";
import {Optional} from "utility-types";
import {ParentWithUser, ParentWithUserAndChildren, StudentWithUserAndParent} from "@/lib/definitions/parent";
import {UserWithoutPassword} from "@/lib/definitions";

import {TeacherWithUser} from "@/lib/definitions/teacher";
import {AdministratorWithUser} from "@/lib/definitions/administrator";
import {ReprimandWithTeacher, ReprimandWithTeacherAndStudents} from "@/lib/definitions/reprimand";
import {
    ExamMarkWithStudent,
    ExamWithMarksAndStudents,
    SubjectWithExamsAndStudents,
    TeacherWithMarksPerSubject
} from "@/app/api/internal/exam-marks/teacher/types";

export interface PrismaProfileWithUser extends Profile{
    user : UserWithoutPassword
}
export type PrismaStudentWithUser = Student & {
    profile: PrismaProfileWithUser
}
export type PrismaParentWithUser = Parent & {
    profile: PrismaProfileWithUser
}
export type PrismaTeacherWithUser = Teacher & {
    profile: PrismaProfileWithUser
}
export type PrismaAdministratorWithUser = Administrator & {
    profile: PrismaProfileWithUser
}
export type PrismaParentWithUserAndChildren = PrismaParentWithUser & {
    children: PrismaStudentWithUser[]
}
export type PrismaStudentWithUserAndParents = PrismaStudentWithUser & {
    parents: PrismaParentWithUser[]
}
export type PrismaReprimandWithTeacher = Reprimand & {
    teacher: PrismaTeacherWithUser
}

export type PrismaReprimandWithTeacherAndStudents = PrismaReprimandWithTeacher & {
    students: PrismaStudentWithUser[]
}

export type PrismaExamMarkWithStudent = ExamMark & {
    student: PrismaStudentWithUser
}

export type PrismaExamWithMarksAndStudents = Exam & {
    marks: PrismaExamMarkWithStudent[]
}

export type PrismaSubjectWithExamsAndStudents = Subject & {
    exams: PrismaExamWithMarksAndStudents[]
}

export type PrismaTeacherWithMarksPerSubject = Teacher & {
    subjects: PrismaSubjectWithExamsAndStudents[]
}


export function expandProfile<T extends  {profile: PrismaProfileWithUser}>(specificProfile: T): Omit<T, 'profile'> & PrismaProfileWithUser{
    const specificProfileWithoutProfile: Optional<typeof specificProfile, "profile"> = {...specificProfile};
    delete specificProfileWithoutProfile["profile"];

    return {
        ...specificProfileWithoutProfile,
        ...specificProfile.profile
    }
}

export function mapStudentWithUser(student: PrismaStudentWithUser): StudentWithUser{
    return expandProfile(student);
}

export function mapParentWithUser(parent: PrismaParentWithUser): ParentWithUser{
    return expandProfile(parent);
}

export function mapTeacherWithUser(teacher: PrismaTeacherWithUser): TeacherWithUser{
    return expandProfile(teacher);
}

export function mapAdministratorWithUser(administrator: PrismaAdministratorWithUser): AdministratorWithUser{
    return expandProfile(administrator);
}


export function mapParentWithUserAndChildren(parent: PrismaParentWithUserAndChildren): ParentWithUserAndChildren{
    return {
        ...expandProfile(parent),
        children: parent.children.map(mapStudentWithUser)
    }
}

export function mapStudentWithUserAndParent(student: PrismaStudentWithUserAndParents): StudentWithUserAndParent{
    return {
        ...mapStudentWithUser(student),
        parents: student.parents.map(mapParentWithUser)
    }
}

export function mapReprimandWithTeacher(reprimand: PrismaReprimandWithTeacher): ReprimandWithTeacher{
    return {
        ...reprimand,
        teacher: mapTeacherWithUser(reprimand.teacher)
    }
}

export function mapReprimandWithTeacherAndStudents(reprimand: PrismaReprimandWithTeacherAndStudents): ReprimandWithTeacherAndStudents{
    return {
        ...mapReprimandWithTeacher(reprimand),
        students: reprimand.students.map(mapStudentWithUser)
    }
}

export function mapExamMarkWithStudent(examMark: PrismaExamMarkWithStudent): ExamMarkWithStudent{
    return {
        ...examMark,
        student: mapStudentWithUser(examMark.student)
    }
}

export function mapExamWithMarksAndStudents(exam: PrismaExamWithMarksAndStudents): ExamWithMarksAndStudents{
    return {
        ...exam,
        marks: exam.marks.map(mapExamMarkWithStudent)
    }
}

export function mapSubjectWithExamsAndStudents(subject: PrismaSubjectWithExamsAndStudents): SubjectWithExamsAndStudents{
    return {
        ...subject,
        exams: subject.exams.map(mapExamWithMarksAndStudents)
    }
}

export function mapTeacherWithExamMarks(teacher: PrismaTeacherWithMarksPerSubject): TeacherWithMarksPerSubject{
    return {
        ...teacher,
        subjects: teacher.subjects.map(mapSubjectWithExamsAndStudents)
    }
}