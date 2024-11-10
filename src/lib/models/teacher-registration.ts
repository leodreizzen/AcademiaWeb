import {z} from 'zod';
import {maxDigits, minDigits} from "@/app/lib/utils";
import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {updateTeacher} from "@/app/(loggedin)/teacher/[id]/edit/updateTeacher";
import {Subject} from "@prisma/client";


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

function  validatTeacherData(formData: TeacherRegistrationData) {
        return TeacherRegistrationModel.safeParse(formData);
}

export async function updateTeacherInDatabase(id: number, formData: TeacherRegistrationData, subjects : Subject[]) : Promise<ActionResult> {
        const validateFields = validatTeacherData(formData);

        if (!validateFields.success) {
                const errorMessage= "Por favor, corrija los siguientes errores: " + Object.values(validateFields.error.flatten().fieldErrors);
                return {success: false, error: errorMessage}
        }
        if(subjects.length === 0){
                return {success: false, error: "Por favor, seleccione al menos una materia"}
        }

        const {phoneNumber, address, email, name, lastName, dni} = validateFields.data;
        return await updateTeacher(id, phoneNumber, address, email, subjects, name, lastName, dni);
}
