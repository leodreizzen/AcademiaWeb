import prisma from "@/lib/prisma";
import {Prisma} from "@prisma/client"
import {fetchCurrentUser} from "@/lib/data/users";
import {fetchSubjectsFromTeacher} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/fetchSubjectsFromTeacher";

export async function getCurrentSemesterForReportCard(year: number, gradeName: string): Promise<"first" | "second" | "none">{
    const gradeReportCard = await prisma.gradeReportCards.findUnique({
        where: {
            gradeName_year: {
                gradeName,
                year,
            },
        },
    });

    if (!gradeReportCard) {
        return "first";
    }

    if (!gradeReportCard.firstSemesterReleased) {
        return "first";
    } else if (!gradeReportCard.secondSemesterReleased) {
        return "second"
    }
    else
        return "none"
}

export async function hasRegisteredMarks(year: number, gradeName: string, subjectId: number, semester: "first" | "second"){
    const semesterFilter: Prisma.SemesterReportCardMarkWhereInput = semester == "first" ? {
        reportCardFirstSemester: {
            gradeReportCards: {
                year: year,
                grade: {
                    name: gradeName
                }
            }
        }
    } : {
        reportCardSecondSemester: {
            gradeReportCards: {
                year: year,
                grade: {
                    name: gradeName
                }
            }
        }
    }

    const subjectMarks = await prisma.semesterReportCardMark.findFirst({
        where: {
            subject: {
                id: subjectId
            },
            ...semesterFilter
        }
    })
    return subjectMarks !== null
}



export type GetSubjectsWithReportCardStatusReturnType = Map<number, {currentSemester: "first" | "second", canLoad: boolean}>

export async function getSubjectsWithReportCardStatus(year: number): Promise<GetSubjectsWithReportCardStatusReturnType>{
    const teacher = await fetchCurrentUser();
    if(!teacher)
        throw new Error("User not found");
    if(teacher.role !== "Teacher")
        throw new Error("User is not a teacher");

    const subjects = await fetchSubjectsFromTeacher();

    const gradeReportCards = await prisma.gradeReportCards.findMany({
        where: {
            year: year,
            grade: {
                subjects: {
                    some: {
                        id: {
                            in: subjects.map(s => s.id)
                        }
                    }
                }
            }
        }, include: {
            reportCards: {
                take: 1,
                include: {
                    firstSemesterMarks: {
                        where: {
                            subject: {
                                id: {
                                    in: subjects.map(s => s.id)
                                }
                            }
                        }
                    },
                    secondSemesterMarks: {
                        where: {
                            subject: {
                                id: {
                                    in: subjects.map(s => s.id)
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    const result: GetSubjectsWithReportCardStatusReturnType = new Map();
    for(const subject of subjects){
        const gradeReportCard = gradeReportCards.find(g => g.gradeName == subject.gradeName)
        if (!gradeReportCard) {
            result.set(subject.id, {currentSemester: "first", canLoad: true})
            continue;
        }
        if(gradeReportCard.reportCards.length == 0){
            result.set(subject.id, {currentSemester: "second", canLoad: true})
        }
        else if(!gradeReportCard.firstSemesterReleased){
                const reportCard = gradeReportCard.reportCards[0];
                if(!reportCard.firstSemesterMarks.find(mark => mark.subjectId == subject.id))
                    result.set(subject.id, {currentSemester: "first", canLoad: true})
                else
                    result.set(subject.id, {currentSemester: "first", canLoad: false})
        }
        else if(!gradeReportCard.secondSemesterReleased) {
                const reportCard = gradeReportCard.reportCards[0];
                if(!reportCard.secondSemesterMarks.find(mark => mark.subjectId == subject.id))
                    result.set(subject.id, {currentSemester: "second", canLoad: true})
                else
                    result.set(subject.id, {currentSemester: "second", canLoad: false})
        }
        else
            result.set(subject.id, {currentSemester: "second", canLoad: false})
    }
    return result;
}