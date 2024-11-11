import "server-only";
import prisma from '@/lib/prisma';
import {fetchSubject} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/fetchSubject";
import {fetchStudentsFromSubject} from "@/app/(loggedin)/reportcard/teacher/add-student-marks/fetchStudentsFromSubject";
import {z} from "zod";
import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {revalidatePath} from "next/cache";
import {SecondSemesterMarkListModel} from "@/lib/models/marks";


export async function addSecondSemesterMarks(subjectId: number, notas: z.infer<typeof SecondSemesterMarkListModel>): Promise<ActionResult> {
    const year = new Date().getFullYear();
    const subject = await fetchSubject(subjectId);

    try {
        if (!subject)
            return {
                success: false,
                error: "La materia no existe"
            }
        return await prisma.$transaction(async tx => {
            const gradeReportCard = await tx.gradeReportCards.findUnique({
                where: {
                    gradeName_year: {
                        gradeName: subject.gradeName,
                        year: year,
                    }
                }
            });

            if (!gradeReportCard) {
                return {
                    success: false,
                    error: "No hay boletines registrados para el primer semestre"
                }
            }
            if (!gradeReportCard.firstSemesterReleased)
                return {
                    success: false,
                    error: "No está listo el boletín del primer semestre"
                }


            const students = await fetchStudentsFromSubject(subjectId);

            for (const student of students) {
                const reportCard = await tx.reportCard.findUnique({
                    where: {
                        studentId_year: {
                            studentId: student.id,
                            year: year,
                        }
                    }, include: {
                        secondSemesterMarks: true
                    }
                });

                if (!reportCard) {
                    throw new DataError("No hay boletines registrados para el primer semestre")
                }


                if (reportCard.secondSemesterMarks.map(m => m.subjectId).includes(subjectId)) {
                    throw new DataError("Las notas ya están subidas")
                }

                const mark = notas[student.id];
                if(!mark)
                    throw new DataError("Faltan notas")

                await tx.semesterReportCardMark.create({
                    data: {
                        reportCardSecondSemester: {
                            connect: {
                                id: reportCard.id
                            }
                        },
                        subject: {
                            connect: {
                                id: subjectId
                            }
                        },
                        mark: mark.secondSemester,
                    }
                });

                await tx.finalReportCardMark.create({
                    data: {
                        reportCard: {
                            connect: {
                                id: reportCard.id
                            }
                        },
                        subject: {
                            connect: {
                                id: subjectId
                            }
                        },
                        mark: mark.final,
                    }
                });

                revalidatePath(`/reportcard/${reportCard.id}`)


                const newReportCard = await tx.reportCard.findUnique({
                    where: {
                        id: reportCard.id
                    }, include: {
                        secondSemesterMarks: true
                    }
                })
                if (!newReportCard)
                    throw new DataError("Error cargando boletin");

                const gradeSubjects = await tx.subject.findMany({
                    where: {
                        grade: {
                            name: subject.grade.name
                        }
                    }
                })

                const savedSubjects = newReportCard.secondSemesterMarks.map(m => m.subjectId);
                const allSubjectsSaved = gradeSubjects.every(subject => savedSubjects.includes(subject.id))

                if (allSubjectsSaved) {
                    await tx.gradeReportCards.update({
                        where: {
                            gradeName_year: {
                                gradeName: subject.grade.name,
                                year: year
                            }
                        }, data: {
                            secondSemesterReleased: true
                        }
                    })
                }
            }
            revalidatePath("/reportcard")
            revalidatePath("/reportcard/teacher/add-student-marks")
            revalidatePath("/reportcard/teacher")
            return {success: true};

        })

    } catch (error) {
        console.error('Error al agregar las notas:', error);

        if(error instanceof DataError)
            return {success: false, error: error.message}
        return {success: false, error: 'Hubo un error al agregar las notas'};
    }
}

class DataError extends Error {
    constructor(message = "") {
        super(message);
    }
}