'use client'

import React, {useState} from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { es } from 'date-fns/locale'
import {
    Typography,
    Box,
    Paper,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    Button
} from '@mui/material'
import {PickersDay, PickersDayProps} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import {AttendanceDataWithItems} from "@/lib/actions/get-attendance";
import {useRouter} from "next/navigation";

// Tema oscuro
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
})

type TeacherAttendanceProps = {
    attendanceData: AttendanceDataWithItems[],
    gradeId: number,
    gradeName: string
}

type AttendanceFormat = {
    [key: string]: Record<string, boolean>
}

export default function TeacherAttendance({attendanceData, gradeId, gradeName}: TeacherAttendanceProps) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null)
    const router = useRouter()


    const attendanceFormatted: AttendanceFormat = attendanceData.reduce((acc, item) => {
        const date = item.date.toISOString().split('T')[0]
        acc[date] = item.items.reduce((acc, item) => {
            acc[item.student.profile.user.firstName + ' ' + item.student.profile.user.lastName] = item.status === 'PRESENT'
            return acc
        }, {} as Record<string, boolean>)
        return acc
    }, {} as Record<string, Record<string, boolean>>)

    const handleDayClick = (date: Date) => {
        const dateString = date.toISOString().split('T')[0]
        if (attendanceFormatted[dateString]) {
            setDiaSeleccionado(dateString)
            setDialogOpen(true)
        } else {
            alert('No hay datos de asistencia para este día')
        }
    }


    function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
        const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
        const attendance = attendanceFormatted[props.day.toISOString().split('T')[0]]

        if (attendance != undefined)
            return (
                <Badge
                    key={props.day.toString()}
                    overlap="circular"
                    onClick={() => handleDayClick(dayjs(props.day).toDate())}
                >
                    <PickersDay {...other} sx={{backgroundColor: 'green'}} outsideCurrentMonth={outsideCurrentMonth} day={day} />
                </Badge>
            )

        return (
            <Badge
                key={props.day.toString()}
                overlap="circular"
                onClick={() => handleDayClick(dayjs(props.day).toDate())}
            >
                <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
            </Badge>
        );
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <Paper elevation={3} sx={{ p: 3, maxWidth: 400, margin: 'auto', mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Asistencia de la clase de {gradeName}
                    </Typography>
                    <DateCalendar
                        renderLoading={() => <div>Cargando calendario...</div>}
                        disableFuture
                        readOnly
                        slots={{
                            day: ServerDay,
                        }}
                    />
                    <Box justifyContent="center" alignItems="center" display={"flex"}>
                        <Badge overlap="circular" color={"success"} badgeContent={" "} sx={{mr: 2}}></Badge> Hay datos de asistencia.
                    </Box>
                    <Box justifyContent="center" alignItems="center" display={"flex"} sx={{ mt: 2 }}>
                        Los días que no presentan colores no tienen información de asistencia.
                    </Box>
                    <Box justifyContent={"center"} alignItems={"center"} display={"flex"}>
                        <Button sx={{mt:2, justifySelf:'center'}} onClick={() => router.push(`/attendance/${gradeId}/add`)}>Registrar asistencia</Button>
                    </Box>
                </Paper>


                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>
                        Asistencia del día {diaSeleccionado}
                    </DialogTitle>
                    <DialogContent>
                        {diaSeleccionado && (
                            <>
                                <List>
                                    {Object.entries(attendanceFormatted[diaSeleccionado]).map(([alumno, asistio]) => (
                                        <ListItem key={alumno}>
                                            <ListItemText
                                                primary={alumno}
                                                secondary={asistio ? 'Presente' : 'Ausente'}
                                                sx={{ color: asistio ? 'green' : 'red' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Typography variant="subtitle1">
                                    Total de ausencias: {Object.values(attendanceFormatted[diaSeleccionado]).filter(a => !a).length}
                                </Typography>
                                <Button sx={{mt:3}} onClick={() => setDialogOpen(false)}>Cerrar</Button>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </LocalizationProvider>
        </ThemeProvider>
    )
}