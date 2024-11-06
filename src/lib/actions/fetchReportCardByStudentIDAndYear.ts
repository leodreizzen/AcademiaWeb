import prisma from "@/lib/prisma";
import {
    ReportCard,
    SemesterReportCardMark,
    FinalReportCardMark,
    GradeReportCards,
    Subject
} from "@prisma/client";
import {PrismaStudentWithUserAndParent} from "@/lib/data/mappings";

export interface ReportCardWithAllData extends ReportCard {
    student:PrismaStudentWithUserAndParent
    firstSemesterMarks: SemesterReportCardMarkWithSubject[]
    secondSemesterMarks: SemesterReportCardMarkWithSubject[]
    finalMarks: FinalReportCardMarkWithSubject[]
    gradeReportCards: GradeReportCards
}

export interface SemesterReportCardMarkWithSubject extends SemesterReportCardMark {
    subject: Subject
}

export interface FinalReportCardMarkWithSubject extends FinalReportCardMark {
    subject: Subject
}




export async function fetchReportCardByStudentIDAndYear(studentID: number, year: number) : Promise<ReportCardWithAllData | null> {
    try {
        return await prisma.reportCard.findUnique({
            where: {
                studentId_year: {
                    studentId: studentID,
                    year: year
                }
            },
            include: {
                student: {
                    include: {
                        profile:{
                            include:{
                                user:true
                            }
                        },
                        parents: {
                            include: {
                                profile: {
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        }
                    }
                },
                firstSemesterMarks:{
                    orderBy:{
                        subjectId: 'asc'
                    },
                    include:{
                        subject:true
                    }
                },
                secondSemesterMarks: {
                    orderBy: {
                        subjectId: 'asc'
                    },
                    include: {
                        subject: true
                    }
                },
                finalMarks: {
                    orderBy: {
                        subjectId: 'asc'
                    },
                    include: {
                        subject: true
                    }
                },
                gradeReportCards: true,
            },
        });
    }
    catch (e) {
        console.error(e);
        return null;
    }
}