import {ActionResult, ParentWithUser} from "@/app/(loggedin)/student/add/types";
import {addStudent} from "@/app/(loggedin)/student/add/addNewStudent";
import {addParent} from "@/app/(loggedin)/student/add/addNewParent";
import {ParentSchema, StudentData, StudentSchema, ParentData} from "@/lib/models/studentParent";
import {FormState} from "react-hook-form";


function validateParentData(formData: ParentData) {
    return ParentSchema.safeParse(formData);
}

function  validateStudentData(formData: StudentData) {
    return StudentSchema.safeParse(formData);
}

export async function addStudentToDataBase(formData: StudentData, parents: ParentWithUser[]): Promise<ActionResult> {
    const validateFields = validateStudentData(formData);

    if (!validateFields.success) {
        const errorMessage = "Por favor, corrija los siguientes errores: " + Object.values(validateFields.error.flatten().fieldErrors);
        return {success: false, error: errorMessage}
    }

    const {firstName, lastName, email, dni, phoneNumber, address, gradeName} = validateFields.data;
    return await addStudent(phoneNumber, address, email, parents, gradeName, firstName, lastName, dni);
}



export async function addParentToDataBase(formData: ParentData) : Promise<ActionResult> {
    const validateFields = validateParentData(formData);

    if (!validateFields.success) {
        const errorMessage= "Por favor, corrija los siguientes errores: " + Object.values(validateFields.error.flatten().fieldErrors);
        return {success: false, error: errorMessage}

    }
    const {phoneNumber, address, email, name, surname, dni} = validateFields.data;
    return await addParent(phoneNumber, address, email, name, surname, dni);
}