"use client"

import {createTheme, ThemeProvider} from "@mui/material";
import {ReactNode} from "react";
import { esES } from '@mui/material/locale';
import {esES as datePickersEsES} from "@mui/x-date-pickers/locales"
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/es"
export default function ThemeWrapper({children}:{children: ReactNode}){
    const theme = createTheme({
        palette:{
            mode: "dark"
        },
    }, esES, datePickersEsES);

    return(
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        {children}
            </LocalizationProvider>
        </ThemeProvider>
    )
}