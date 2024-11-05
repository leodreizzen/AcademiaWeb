import {DateTime} from "luxon";

if(process.env.SERVER_TIMEZONE === undefined)
    throw new Error("SERVER_TIMEZONE is not set")


export function localDayStart(date: Date) {
    const inicioDelDia = DateTime.fromJSDate(date)
        .setZone(process.env.SERVER_TIMEZONE)
        .startOf('day'); // Configura a las 00:00 en la zona horaria de Argentina
    return inicioDelDia.toJSDate();
}

export function localDayEnd(date: Date) {
    const finDelDia = DateTime.fromJSDate(date)
        .setZone(process.env.SERVER_TIMEZONE)
        .endOf('day'); // Configura a las 23:59:59.999 en la zona horaria de Argentina
    return finDelDia.toJSDate();
}

export function localTodayStart(){
    return localDayStart(new Date())
}

export function localTodayEnd(){
    return localDayEnd(new Date())
}