import {Parent, User} from "@prisma/client"

export type MyFormData = {
    dni: string,
    nombre: string,
    apellido: string,
    telefono: string,
    direccion: string,
    correo: string,
    anio: string
}

export type Parentt ={
    id: number
    dni: string
    nombre: string
    apellido: string
    telefono: string
}

export type ParentFormData = {
    dni: string,
    nombre: string,
    apellido: string,
    telefono: string,
    direccion: string,
    correo: string,
}



export interface ParentWithUser extends Parent{
    user : User
}


