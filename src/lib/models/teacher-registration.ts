import {z} from 'zod';
import {maxDigits, minDigits} from "@/app/lib/utils";

const invalidDni = "Ingrese un DNI válido.";
const invalidEmail = "Ingrese un email válido.";
const invalidPhone = "Ingrese un teléfono válido.";
const invalidAddress = "Ingrese una dirección válida.";
const invalidName = "Ingrese un nombre válido.";
const invalidLastName = "Ingrese un apellido válido.";

export const TeacherRegistrationModel = z.object(
    {
        dni: z.coerce.number({invalid_type_error: invalidDni}).int(invalidDni).min(minDigits(7), invalidDni).max(maxDigits(9), invalidDni),
        name: z.string().min(2, invalidName),
        lastName: z.string().min(2, invalidLastName),
        email: z.string().email(invalidEmail),
        phoneNumber: z.string().min(8, invalidPhone),
        address: z.string().min(5, invalidAddress),
    }
);

export type TeacherRegistrationData = z.infer<typeof TeacherRegistrationModel>;
