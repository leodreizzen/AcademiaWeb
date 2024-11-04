"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React, {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export function AttendanceChooseYear({grades} : {grades: { name: string, id: number }[]}) {

    const [gradeName, setGradeName] = useState<string>(grades[0].name);
    const [gradeNumber, setGradeNumber] = useState<number>(grades[0].id);
    const router = useRouter();

    const handleContinue = () => {
        router.push(`/attendance/${gradeNumber}`);
    }

    const handleGradeChange = (e: string) => {
        const grade = grades.find(g => g.name === e);
        if(grade){
            setGradeName(grade.name);
            setGradeNumber(grade.id);
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl mx-auto bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-100">
                       Selecciona el año para el cual quiere visualizar la asistencia
                    </CardTitle>
                </CardHeader>
                <CardContent>

                    <div className="space-y-2 flex flex-col">
                        <Select
                            name="anio"
                            value={gradeName}
                            onValueChange={e => handleGradeChange(e)}
                        >
                            <SelectTrigger
                                className="bg-grey-700 text-gray-100 border-gray-600 focus:border-gray-500">
                                <SelectValue placeholder="Elija un año"/>
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700">
                                {grades.map((grade) => (
                                    <SelectItem
                                        key={grade.name}
                                        className="bg-gray-700 text-gray-100 focus:border-gray-500"
                                        value={grade.name}
                                    >
                                        {grade.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        onClick={handleContinue}
                        disabled={!grades.find(g => g.name === gradeName)}
                        className="mt-6 bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-500"
                    >
                        Siguiente
                    </Button>


                </CardContent>
            </Card>
        </div>
    )
}