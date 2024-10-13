"use client"

import {createTheme, ThemeProvider} from "@mui/material";
import {ReactNode} from "react";

export default function ThemeWrapper({children}:{children: ReactNode}){
    const theme = createTheme({
        palette:{
            mode: "dark"
        }
    });

    return(
        <ThemeProvider theme={theme}>
        {children}
        </ThemeProvider>
    )
}