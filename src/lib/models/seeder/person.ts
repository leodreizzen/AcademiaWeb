import {z} from 'zod';
import {maxDigits, minDigits} from "@/lib/utils";

const dniMessage = "Los DNI tienen que tener de 7 a 9 dígitos, y ser solo números.";
const dniSchema = z.coerce.number({message: dniMessage}).min(minDigits(7), {message: dniMessage}).max(maxDigits(9), {message: dniMessage});

export const PersonSchema = z.object({
    roles: z.enum(["parent", "teacher", "student", "administrator"]),
    phoneNumber: z.string(),
    email: z.string().email(),
    address: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    dni: dniSchema,
    password: z.string(),
});

export const StudentSchema = PersonSchema.extend({
    roles: z.enum(["student"]),
    parentDnis: z.array(dniSchema),
});

export const PersonListSchema = z.array(PersonSchema);

export type PersonList = z.infer<typeof PersonListSchema>;

export type PersonType = z.infer<typeof PersonSchema>;

export type StudentType = z.infer<typeof StudentSchema>;



