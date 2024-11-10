"use client";
import {ReportCardWithAllData} from "@/lib/actions/fetchReportCardByStudentIDAndYear";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";



export default function ReportCardInfo({reportCard}: {reportCard: ReportCardWithAllData}) {

    const[subjectsFirstSemester, setSubjectsFirstSemester] = useState<{name: string, mark: string}[]>();
    const[subjectsSecondSemester, setSubjectsSecondSemester] = useState<{name: string, mark: string}[]>();
    const[subjectsFinal, setSubjectsFinal] = useState<{name: string, mark: number}[]>();

    useEffect(() => {
        if (reportCard.gradeReportCards.firstSemesterReleased) {
            const subjectsFirstSemester = reportCard.firstSemesterMarks.map((mark) => ({
                name: mark.subject.name,
                mark: mark.mark,
            }));
            setSubjectsFirstSemester(subjectsFirstSemester);
        }
    }, [reportCard.firstSemesterMarks, reportCard.gradeReportCards.firstSemesterReleased]);

    useEffect(() => {
        if (reportCard.gradeReportCards.secondSemesterReleased) {
            const subjectsSecondSemester = reportCard.secondSemesterMarks.map((mark) => ({
                name: mark.subject.name,
                mark: mark.mark,
            }));
            setSubjectsSecondSemester(subjectsSecondSemester);

            const subjectsFinal = reportCard.finalMarks.map((mark) => ({
                name: mark.subject.name,
                mark: mark.mark,
            }));
            setSubjectsFinal(subjectsFinal);
        }
    }, [reportCard.secondSemesterMarks, reportCard.finalMarks, reportCard.gradeReportCards.secondSemesterReleased]);

    const subjects = subjectsFirstSemester && subjectsSecondSemester && subjectsFinal ? subjectsFirstSemester.map((subject, index) => ({
        name: subject.name,
        semester1: subject.mark,
        semester2: subjectsSecondSemester[index].mark,
        finalGrade: subjectsFinal[index].mark,
    })) : [];





    return (
        <div
            className="dark min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
            <Card
                className="w-full max-w-2xl mx-auto bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl border border-gray-700">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-white">Boletín</CardTitle>
                    <p className="text-sm text-gray-400">
                        Estudiante: {reportCard.student.profile.user.firstName} {reportCard.student.profile.user.lastName}
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!subjectsFirstSemester ? (
                        <div className="text-center text-gray-200">
                            <p>Los datos de este boletín aún no están disponibles.</p>
                            <p>Por favor, vuelva a intentarlo más tarde.</p>
                        </div>
                    ) :<>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-gray-700 bg-gray-800 bg-opacity-40">
                                    <TableHead
                                        className="w-[200px] text-left font-semibold text-gray-300">Materia</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-300">1° Semestre</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-300">2° Semestre</TableHead>
                                    <TableHead className="text-center font-semibold text-gray-300">Nota Final</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>

                                {subjects.length === 0 && subjectsFirstSemester.map((subject, index) => (
                                    <TableRow key={subject.name
                                    } className={index % 2 === 0 ? "bg-gray-800 bg-opacity-30" : "bg-gray-900 bg-opacity-30"}>
                                        <TableCell className="font-medium text-gray-200">{subject.name}</TableCell>
                                        <TableCell className="text-center text-gray-300">{subject.mark}</TableCell>
                                        <TableCell className="text-center text-gray-300">-</TableCell>
                                        <TableCell className="text-center text-gray-300">-</TableCell>
                                    </TableRow>
                                ))}
                                {subjects.length!=0 && subjects.map((subject, index) => (
                                    <TableRow key={subject.name}
                                              className={index % 2 === 0 ? "bg-gray-800 bg-opacity-30" : "bg-gray-900 bg-opacity-30"}>
                                        <TableCell className="font-medium text-gray-200">{subject.name}</TableCell>
                                        <TableCell className="text-center text-gray-300">{subject.semester1}</TableCell>
                                        <TableCell className="text-center text-gray-300">{subject.semester2}</TableCell>
                                        <TableCell
                                            className="text-center font-semibold text-gray-200">{subject.finalGrade}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="flex justify-center pt-4">
                        <Button variant="outline" size="lg"
                        className="text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white transition-colors duration-200">
                        Descargar PDF
                        </Button>
                        </div>
                    </>

                    }


                </CardContent>
            </Card>
        </div>
    );

}