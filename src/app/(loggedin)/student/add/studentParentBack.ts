import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {addStudent} from "@/app/(loggedin)/student/add/addNewStudent";
import {addParent} from "@/app/(loggedin)/student/add/addNewParent";
import {ParentSchema, StudentData, StudentSchema, ParentData} from "@/lib/models/studentParent";
import {FormState} from "react-hook-form";
import {updateParent} from "@/app/(loggedin)/parent/[id]/edit/updateParent";
import {ParentWithUser} from "@/lib/definitions/parent";
import {updateStudent} from "@/app/(loggedin)/student/[id]/edit/updateStudent";


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

    const {firstName, lastName, email, dni, phoneNumber, address, gradeName, birthDate} = validateFields.data;
    return await addStudent(phoneNumber, address, email, parents, gradeName, firstName, lastName, dni, birthDate);
}



export async function addParentToDataBase(formData: ParentData) : Promise<ActionResult> {
    const validateFields = validateParentData(formData);

    if (!validateFields.success) {
        const errorMessage= "Por favor, corrija los siguientes errores: " + Object.values(validateFields.error.flatten().fieldErrors);
        return {success: false, error: errorMessage}

    }
    const {phoneNumber, address, email, firstName, lastName, dni, birthDate} = validateFields.data;
    return await addParent(phoneNumber, address, email, firstName, lastName, dni, birthDate);
}

export async function updateParentInDataBase(id: number, formData: ParentData) : Promise<ActionResult> {
    const validateFields = validateParentData(formData);

    if (!validateFields.success) {
        const errorMessage= "Por favor, corrija los siguientes errores: " + Object.values(validateFields.error.flatten().fieldErrors);
        return {success: false, error: errorMessage}

    }
    const {phoneNumber, address, email, firstName, lastName, dni, birthDate} = validateFields.data;
    return await updateParent(id,phoneNumber, address, email, firstName, lastName, dni, birthDate);
}

export async function updateStudentInDataBase(id: number, formData: StudentData, parents: ParentWithUser[] ) : Promise<ActionResult> {
    const validateFields = validateStudentData(formData);

    if (!validateFields.success) {
        const errorMessage= "Por favor, corrija los siguientes errores: " + Object.values(validateFields.error.flatten().fieldErrors);
        return {success: false, error: errorMessage}

    }
    const {phoneNumber, address, email, firstName, lastName, dni, birthDate, gradeName} = validateFields.data;
    return await updateStudent(id,phoneNumber, address, email, parents, gradeName, firstName, lastName, dni, birthDate);
}