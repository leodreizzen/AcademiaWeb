'use client'

import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { es } from 'date-fns/locale'
import { Typography, Box, Paper, Badge} from '@mui/material'
import {PickersDay, PickersDayProps} from "@mui/x-date-pickers";
import {Dayjs} from "dayjs";
import {AttendanceResponse} from "@/lib/actions/get-attendance";

// Tema oscuro
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
})

type StudentAttendanceProps = {
    student: AttendanceResponse
}

type AttendanceFormat = {
    [key: string]: boolean
}

export default function StudentAttendance({student}: StudentAttendanceProps) {

    const countAbsencies = () => {
        return student.attendance.filter(item => item.items[0].status === 'ABSENT')?.length
    }

    const attendanceFormatted: AttendanceFormat = student.attendance.reduce((acc, item) => {
        const date = item.date.toISOString().split('T')[0]
        acc[date] = item.items[0].status === 'PRESENT'
        return acc
    }, {} as Record<string, boolean>)


    function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
        const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

        const attendance = attendanceFormatted[props.day.toISOString().split('T')[0]]

        if (attendance != undefined)
            return (
                <Badge
                    key={props.day.toString()}
                    overlap="circular"
                >
                    <PickersDay {...other} sx={{backgroundColor: attendance ? 'green' : 'red'}} outsideCurrentMonth={outsideCurrentMonth} day={day} />
                </Badge>
            )

        return (
            <Badge
                key={props.day.toString()}
                overlap="circular"
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
                        Asistencia de {student.student.profile.user.firstName} {student.student.profile.user.lastName}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Total de faltas: {countAbsencies()}
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
                        <Badge overlap="circular" color={"success"} badgeContent={" "} sx={{mr: 2}}></Badge> Presente
                        <Badge overlap="circular" color={"error"} badgeContent={" "} sx={{mr: 2, ml: 2}}></Badge> Ausente
                    </Box>
                    <Box justifyContent="center" alignItems="center" display={"flex"} sx={{ mt: 2 }}>
                        Los días que no presentan colores no tienen información de asistencia.
                    </Box>
                </Paper>
            </LocalizationProvider>
        </ThemeProvider>
    )
}