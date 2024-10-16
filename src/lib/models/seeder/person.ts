import {z} from 'zod';
import {maxDigits, minDigits} from "@/lib/utils";

const dniMessage = "Los DNI tienen que tener de 7 a 9 dígitos, y ser solo números.";
const dniSchema = z.coerce.number({message: dniMessage}).min(minDigits(7), {message: dniMessage}).max(maxDigits(9), {message: dniMessage});

const grades = ["1º año", "2º año", "3º año", "4º año", "5º año", "6º año"]

export const PersonSchema = z.object({
    roles: z.array(z.enum(["parent", "teacher", "student", "administrator"])),
    phoneNumber: z.string({message: "Invalid phone number"}),
    email: z.string({message: "Invalid email"}).email("Invalid email"),
    address: z.string({message: "Invalid address"}),
    firstName: z.string({message: "Invalid first name"}),
    lastName: z.string({message: "Invalid last name"}),
    dni: dniSchema,
    password: z.string({message: "Invalid password"}),
    alias: z.string().optional(),
    parentDnis: z.array(dniSchema).optional(),
    grade: z.string().optional(),
    subjects: z.array(z.tuple([z.string(), z.string()])).optional()
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
    }, {message: "Only students can have parents"})
    .superRefine((value, ctx) => {
        if (value.roles.includes("student")) {
            if (!value.grade) {
                ctx.addIssue({
                    code: "custom",
                    message: `Grade is required for student with dni ${value.dni}`,
                    path: ['grade'],
                });
            }
            if (!value.grade || !grades.includes(value.grade)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Invalid grade ${value.grade}. Valid grades are: ${grades}`,
                    path: ['grade'],
                });
            }
        }
    })


    .refine((value) => {
        if (value.roles.includes("teacher"))
            return value.subjects !== undefined && value.subjects.length > 0;
        else
            return true
    }, {message: "Teachers must have at least one subject they teach."});


export const PersonListSchema = z.array(z.any()).transform((arr, ctx) => {
    const resList: z.infer<typeof PersonSchema>[] = [];
    for (let i = 0; i < arr.length; i++) {
        const person = arr[i];
        const parsedPerson = PersonSchema.safeParse(person);
        if (!parsedPerson.success) {
            ctx.addIssue({
                code: "custom",
                message: `Error parsing person with dni ${person.dni} (index ${i}): ${JSON.stringify(parsedPerson.error.errors)}`,
            });
            return z.NEVER;
        } else
            resList.push(parsedPerson.data);
    }
    return resList;
}).superRefine((list, ctx) => {
    if((list as {status?: string})["status"] == "aborted")
        return z.NEVER;
    const dniSet = new Set<number>();
    const emailSet = new Set<string>();
    const aliasSet = new Set<string>();
    for (const person of list) {
        if (dniSet.has(person.dni)) {
            ctx.addIssue({
                code: "custom",
                message: `DNI ${person.dni} is repeated`
            });
            return z.NEVER;
        }
        dniSet.add(person.dni);
        if (emailSet.has(person.email)) {
            ctx.addIssue({
                code: "custom",
                message: `Email "${person.email}" is repeated`
            });
            return z.NEVER;
        }
        emailSet.add(person.email);
        if (person.alias) {
            if (aliasSet.has(person.alias)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Alias "${person.alias}" is repeated`
                });
                return z.NEVER;
            }
            aliasSet.add(person.alias);
        }
    }
}). superRefine((list, ctx) => {
    for (let i = 0; i < list.length; i++) {
        const person = list[i];
        if (person.roles.includes("student")) {
            const parents = person.parentDnis as number[];
            for (const parentDni of parents) {
                const index = list.findIndex((p) => p.dni === parentDni);
                if (index === -1) {
                    ctx.addIssue({
                        code: "custom",
                        message: `Parent with DNI ${parentDni} not found`
                    });
                    return z.NEVER;
                }
                if (index > i) {
                    ctx.addIssue({
                        code: "custom",
                        message: `Parent with DNI ${parentDni} must be created before student with DNI ${person.dni}`
                    });
                    return z.NEVER;
                }
                if (!list[index].roles.includes("parent")) {
                    ctx.addIssue({
                        code: "custom",
                        message: `Person with DNI ${parentDni} is not a parent but is listed as a parent of student with DNI ${person.dni}`
                    });
                    return z.NEVER;
                }
            }
        }
    }
});

export type PersonList = z.infer<typeof PersonListSchema>;

export type PersonType = z.infer<typeof PersonSchema>;



