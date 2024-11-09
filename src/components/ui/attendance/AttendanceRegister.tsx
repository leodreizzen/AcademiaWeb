"use client";
import {PrismaStudentWithUser} from "@/lib/data/mappings";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React, {useState} from "react";
import {AttendanceStatus, Grade} from "@prisma/client";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {es} from "date-fns/locale";
import {DateCalendar, DatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {registerAttendance} from "@/lib/actions/registerAttendance";
import {useRouter} from "next/navigation";

export function AttendanceRegister({students, grade, id}: {students: PrismaStudentWithUser[], grade: Grade, id: number}) {

    const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>(Object.fromEntries(students.map(s => ([s.id, "ABSENT"]))))
    const [field, setField] = useState<Date>(new Date());
    const router = useRouter();

    const handleAttendanceChange = (studentId: number, status: AttendanceStatus) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }))
    }

    const handleContinue = async () => {

        const numericAttendance = Object.fromEntries(
            Object.entries(attendance).map(([studentId, status]) => [Number(studentId), status])
        );
        const dataToParse = {
            students: numericAttendance,
            gradeId: grade.id,
        };

        const result = await registerAttendance(dataToParse, field);
        if(result.success){
            alert("Asistencia registrada correctamente")
            router.push(`/attendance/${id}`)
        } else {
            alert(result.error);
        }
    }




    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl mx-auto bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-100">
                       Registro de asistencia para {grade.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 flex flex-col">
                        <p className="text-gray-300">Fecha:</p>
                        <DatePicker value={dayjs(field)} readOnly/>
                        <p className="text-gray-300">Seleccione los estudiantes que asistieron</p>
                        <div className="space-y-2 flex flex-col">


                        </div>
                        <div className="space-y-2 flex flex-col overflow-auto">
                            {students.map(student => (
                                <li key={student.id}
                                    className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow">
                                    <span
                                        className="text-lg font-medium text-gray-100">{student.profile.user.firstName} {student.profile.user.lastName}</span>
                                    <div className="flex space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`present-${student.id}`}
                                                checked={attendance[student.id] === 'PRESENT'}
                                                onCheckedChange={(checked) => {
                                                    handleAttendanceChange(student.id, checked ? 'PRESENT' : 'ABSENT')
                                                }}
                                                className="border-gray-400 text-green-500"
                                            />
                                            <Label htmlFor={`present-${student.id}`}
                                                   className="text-gray-300">Presente</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`absent-${student.id}`}
                                                checked={attendance[student.id] === 'ABSENT'}
                                                onCheckedChange={(checked) => {
                                                    handleAttendanceChange(student.id, checked ? 'ABSENT' : 'ABSENT')
                                                }}
                                                className="border-gray-400 text-red-500"
                                            />
                                            <Label htmlFor={`absent-${student.id}`}
                                                   className="text-gray-300">Ausente</Label>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </div>
                        <Button
                            onClick={handleContinue}
                            disabled={!field || Object.keys(attendance).length === 0}
                            className="mt-6 bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-500"
                        >
                            Cargar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

}