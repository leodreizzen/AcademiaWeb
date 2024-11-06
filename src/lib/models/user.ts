import {z} from "zod";
import {maxDigits, minDigits} from "@/lib/utils";
const dniMessage = "Ingrese un dni válido";

export const FirstNameSchema = z
    .string()
    .min(1, {message: "Ingrese un nombre válido"})
    .regex(/\S+\s*\S*/, {message: "El nombre debe contener al menos un carácter no espacio"});
export const LastNameSchema = z
    .string()
    .min(1, {message: "Ingrese un apellido válido"})
    .regex(/\S+\s*\S*/, {message: "El apellido debe contener al menos un carácter no espacio"});
export const PhoneNumberSchema = z
    .string()
    .regex(/^[0-9]*$/, "El número de teléfono debe contener solo números")
    .min(8, {message: "Ingrese un número de teléfono válido"});
export const AddressSchema = z
    .string()
    .min(1, { message: "Ingrese una dirección válida" })
    .regex(/\S+\s*\S*/, { message: "La dirección debe contener al menos un carácter no espacio" })
export const DniSchema = z
    .coerce.number({message: dniMessage})
    .min(minDigits(7), {message: dniMessage})
    .max(maxDigits(9), {message: dniMessage})