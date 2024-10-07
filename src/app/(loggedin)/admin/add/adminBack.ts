import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {AdminData, AdminSchema} from "@/lib/models/admin";
import {addAdmin} from "@/app/(loggedin)/admin/add/addNewAdmin";

function validateAdminData(formData: AdminData) {
    return AdminSchema.safeParse(formData);
}

export async function addAdminToDataBase(formData: AdminData): Promise<ActionResult> {
    const validateFields = validateAdminData(formData);

    if (!validateFields.success) {
        const errorMessage = "Por favor, corrija los siguientes errores: " + Object.values(validateFields.error.flatten().fieldErrors);
        return {success: false, error: errorMessage}
    }

    const {firstName, lastName, email, dni, phoneNumber, address} = validateFields.data;
    return await addAdmin(phoneNumber, address, email, firstName, lastName, dni);
}