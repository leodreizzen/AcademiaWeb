import {z} from 'zod';
import {MyFormData, ParentFormData, ParentWithUser} from "@/app/(loggedin)/student/add/types";
import {addStudent} from "@/app/(loggedin)/student/add/addNewStudent";
import {addParent} from "@/app/(loggedin)/student/add/addNewParent";
import {fi} from "@faker-js/faker";


const StudentSchema = z.object({
    firstName: z.string().min(1, {message: "Ingrese un nombre válido para el estudiante"}),
    lastName: z.string().min(1, {message: "Ingrese un apellido válido para el estudiante"}),
    email: z.string().email({message: "Ingrese un email válido para el estudiante"}),
    dni: z.string().min(8, {message: "Ingrese un dni válido para el estudiante"}),
    phoneNumber: z.string().min(8, {message: "Ingrese un número de teléfono válido para el estudiante"}),
    address: z.string().min(1, {message: "Ingrese una dirección válida para el estudiante"}),
    gradeName: z.string().min(1, {message: "Ingrese un año válido para el estudiante"}),
});

const ParentSchema = z.object({
    phoneNumber: z.string().min(8, {message: "Ingrese un número de teléfono válido para el responsable"}),
    address: z.string().min(1, {message: "Ingrese una dirección válida para el responsable"}),
    name: z.string().min(1, {message: "Ingrese un nombre válido para el responsable"}),
    surname: z.string().min(1, {message: "Ingrese un apellido válido para el responsable"}),
    dni: z.string().min(8, {message: "Ingrese un dni válido para el responsable"}),
    email: z.string().email({message: "Ingrese un email válido para el responsable"}),
});


function  validateStudentData(formData: MyFormData) {
  return StudentSchema.safeParse({
    firstName: formData.nombre,
    lastName: formData.apellido,
    email: formData.correo,
    dni: formData.dni,
    phoneNumber: formData.telefono,
    address: formData.direccion,
    gradeName: formData.anio,
  });
}

export async function addStudentToDataBase(formData: MyFormData, parents: ParentWithUser[], yearSelected: string) {
    const validateFields = validateStudentData(formData);

    if (!validateFields.success) {
        const errorMessage = Object.values(validateFields.error.flatten().fieldErrors)
            .reduce((acc, current) => acc.concat(current), []);
        return {errors: validateFields.error.flatten().fieldErrors, message: errorMessage}
    }

    const {firstName, lastName, email, dni, phoneNumber, address} = validateFields.data;
    await addStudent(phoneNumber, address, email, parents, yearSelected, firstName, lastName, parseInt(dni),);

}


function validateParentData(formData: ParentFormData) {
    return ParentSchema.safeParse({
        phoneNumber: formData.telefono,
        address: formData.direccion,
        email: formData.correo,
        name: formData.nombre,
        surname: formData.apellido,
        dni: formData.dni,
    });
}

export async function addParentToDataBase(formData: ParentFormData) {
    const validateFields = validateParentData(formData);

    if (!validateFields.success) {
        const errorMessage = Object.values(validateFields.error.flatten().fieldErrors)
            .reduce((acc, current) => acc.concat(current), []);
        return {errors: validateFields.error.flatten().fieldErrors, message: errorMessage}

    }
    const {phoneNumber, address, email, name, surname, dni} = validateFields.data;
    await addParent(phoneNumber, address, email, name, surname, parseInt(dni));
}



