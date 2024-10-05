import {z} from 'zod';
import {maxDigits, minDigits} from "@/lib/utils";

const dniMessage = "Los DNI tienen que tener de 7 a 9 dígitos, y ser solo números.";
const dniSchema = z.coerce.number({message: dniMessage}).min(minDigits(7), {message: dniMessage}).max(maxDigits(9), {message: dniMessage});

export const PersonSchema = z.object({
    roles: z.array(z.enum(["parent", "teacher", "student", "administrator"])),
    phoneNumber: z.string(),
    email: z.string().email(),
    address: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    dni: dniSchema,
    password: z.string(),
    alias: z.string().optional(),
    parentDnis: z.array(dniSchema).optional()
}).refine((value)=>{
    if(value.roles.includes("student"))
        return value.parentDnis !== undefined && value.parentDnis.length > 0;
    else
        return value.parentDnis === undefined
});


export const PersonListSchema = z.array(PersonSchema);

export type PersonList = z.infer<typeof PersonListSchema>;

export type PersonType = z.infer<typeof PersonSchema>;



