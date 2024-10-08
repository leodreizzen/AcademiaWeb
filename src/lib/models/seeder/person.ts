import {z} from 'zod';
import {maxDigits, minDigits} from "@/lib/utils";

const dniMessage = "Los DNI tienen que tener de 7 a 9 dígitos, y ser solo números.";
const dniSchema = z.coerce.number({message: dniMessage}).min(minDigits(7), {message: dniMessage}).max(maxDigits(9), {message: dniMessage});

export const PersonSchema = z.object({
    roles: z.array(z.enum(["parent", "teacher", "student", "administrator"])),
    phoneNumber: z.string({message: "Invalid phone number"}),
    email: z.string({message: "Invalid email"}).email("Invalid email"),
    address: z.string({message:"Invalid address"}),
    firstName: z.string({message:"Invalid first name"}),
    lastName: z.string({message:"Invalid last name"}),
    dni: dniSchema,
    password: z.string({message:"Invalid password"}),
    alias: z.string().optional(),
    parentDnis: z.array(dniSchema).optional()
}).refine((value) => {
    if (value.roles.includes("student"))
        return value.parentDnis !== undefined && value.parentDnis.length > 0;
    else
        return true
}, {message: "Students must have at least one parent"})
    .refine((value) => {
        if (value.roles.includes("student"))
            return true;
        else
            return value.parentDnis === undefined || value.parentDnis.length === 0;
    }, {message: "Only students can have parents"});


export const PersonListSchema = z.array(PersonSchema).refine((list) => {
        const dniSet = new Set<number>();
        const emailSet = new Set<string>();
        const aliasSet = new Set<string>();
        for (const person of list) {
            if (dniSet.has(person.dni)) {
                console.error(`DNI ${person.dni} is repeated`);
                return false;
            }
            dniSet.add(person.dni);
            if (emailSet.has(person.email)) {
                console.error(`Email ${person.email} is repeated`);
                return false;
            }
            emailSet.add(person.email);
            if(person.alias){
                if( aliasSet.has(person.alias)){
                    console.error(`Alias ${person.alias} is repeated`);
                    return false;
                }
                aliasSet.add(person.alias);
            }
        }
        return true;
    }
    , {message: "There are repeated DNI or emails in the list"});

export type PersonList = z.infer<typeof PersonListSchema>;

export type PersonType = z.infer<typeof PersonSchema>;



