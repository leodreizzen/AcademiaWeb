import {z} from 'zod';
import {fromZonedTime} from 'date-fns-tz';
import {parse, isValid} from 'date-fns';
import {parentDateSuperRefine, studentDateSuperRefine} from "@/lib/models/studentParent";
import {AddressSchema, DniSchema, FirstNameSchema, LastNameSchema, PhoneNumberSchema} from "@/lib/models/user";
import {PasswordModel} from "@/lib/models/passwords";
export type StudentProfile = z.infer<typeof UserSchema>["profiles"][0] & {
    "role": "Student"
}
export type TeacherProfile = z.infer<typeof UserSchema>["profiles"][0] & {
    "role": "Teacher"
}
export type ParentProfile = z.infer<typeof UserSchema>["profiles"][0] & {
    "role": "Parent"
}
export type AdminProfile = z.infer<typeof UserSchema>["profiles"][0] & {
    "role": "Administrator"
}

export type Profile = z.infer<typeof UserSchema>["profiles"][0]

export const DateSchema = z.string().transform((value, ctx) => {
    const date = parse(value, 'dd-MM-yyyy', new Date());
    if (!isValid(date)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid date. Format must be DD-MM-YYYY",
        });
        return z.NEVER;
    }
    return fromZonedTime(date, 'America/Argentina/Buenos_Aires');
})

const grades = ["1º año", "2º año", "3º año", "4º año", "5º año", "6º año"]
export const _subjects = ["Matemáticas", "Lengua", "Historia", "Geografía", "Biología", "Física", "Química", "Educación Física", "Arte", "Música", "Inglés", "Computación"]

export const SubjectSchema = z.tuple([z.string(), z.string()]).superRefine(([grade, subject], ctx) => {
    if (!grades.includes(grade)) {
        ctx.addIssue({
            code: "custom",
            message: `Invalid grade ${grade}. Valid grades are: ${grades}`,
        });
        return z.NEVER;
    }
    if (!_subjects.includes(subject)) {
        ctx.addIssue({
            code: "custom",
            message: `Invalid subject ${subject}. Valid subjects are: ${_subjects}`,
        });
        return z.NEVER;
    }
});

export const SubjectListSchema = z.array(SubjectSchema)
    .superRefine((subjects, ctx) => {
        const subjectsSet = new Set<string>();
        for (const subject of subjects) {
            if (subjectsSet.has(JSON.stringify(subject))) {
                ctx.addIssue({
                    code: "custom",
                    message: `Repeated subject ${subject}`,
                });
                return z.NEVER;
            }
            subjectsSet.add(JSON.stringify(subject));
        }
    })


const ParentSchema = z.object({
    role: z.literal("Parent"),
    email: z.string().email(),
    birthDate: DateSchema.superRefine(parentDateSuperRefine),
    phoneNumber: PhoneNumberSchema,
    address: AddressSchema,
})
export const GradeSchema = z.string().superRefine((grade, ctx) => {
    if (!grades.includes(grade)) {
        ctx.addIssue({
            code: "custom",
            message: `Invalid grade ${grade}. Valid grades are: ${grades}`,
        });
        return z.NEVER;
    }
});

const StudentSchema = z.object({
    role: z.literal("Student"),
    email: z.string().email(),
    birthDate: DateSchema.superRefine(studentDateSuperRefine),
    phoneNumber: PhoneNumberSchema,
    address: AddressSchema,
    parentDnis: z.array(DniSchema).nonempty("Students must have at least one parent"),
    grade: GradeSchema
})

const TeacherSchema = z.object({
    role: z.literal("Teacher"),
    email: z.string().email(),
    phoneNumber: PhoneNumberSchema,
    address: AddressSchema,
    subjects: SubjectListSchema
})

const AdminSchema = z.object({
    role: z.literal("Administrator"),
    email: z.string().email(),
    phoneNumber: PhoneNumberSchema,
    address: AddressSchema,
})

export const UserSchema = z.object({
    profiles: z.array(z.discriminatedUnion("role", [StudentSchema, ParentSchema, TeacherSchema, AdminSchema])),
    firstName: FirstNameSchema,
    lastName: LastNameSchema,
    dni: DniSchema,
    password: PasswordModel,
    alias: z.string().optional(),
}).superRefine((user, ctx) => {
    //@ts-ignore
    if (Object.keys(user).some(key => (user[key] as { status?: string })["status"] == "aborted"))
        return z.NEVER;
    const rolesSet = new Set<string>();
    for (const profile of user.profiles) {
        if (rolesSet.has(profile.role)) {
            ctx.addIssue({
                code: "custom",
                message: `Repeated role ${profile.role}`,
            });
            return z.NEVER;
        }
        rolesSet.add(profile.role);
    }
    if(rolesSet.has("student") && rolesSet.size > 1) {
        ctx.addIssue({
            code: "custom",
            message: `Student cannot have another role`
        });
        return z.NEVER;
    }
});

let UserListSchemaRaw;
if(!process.env.TEST_DATA_SCHEMA_GENERATION)
    UserListSchemaRaw = z.array(z.any()).transform((arr, ctx) => {
        const resList: z.infer<typeof UserSchema>[] = [];
        for (let i = 0; i < arr.length; i++) {
            const person = arr[i];
            const parsedPerson = UserSchema.safeParse(person);
            if (!parsedPerson.success) {
                ctx.addIssue({
                    code: "custom",
                    message: `Error parsing user with dni ${person.dni} (index ${i}): ${JSON.stringify(parsedPerson.error.errors)}`,
                });
                return z.NEVER;
            } else
                resList.push(parsedPerson.data);
        }
        return resList;
    })
else
    UserListSchemaRaw = z.array(UserSchema);


export const UserListSchema = UserListSchemaRaw.superRefine((list, ctx) => {
    if ((list as { status?: string })["status"] == "aborted")
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
        for (const profile of person.profiles) {
            if (emailSet.has(profile.email)) {
                const usersWithEmail = list.filter(p => p.profiles.map(p => p.email).includes(profile.email));
                if(usersWithEmail.some(p => p.dni !== person.dni)) {
                    ctx.addIssue({
                        code: "custom",
                        message: `Email "${profile.email}" is repeated in different users`
                    });
                    return z.NEVER;
                }
                const rolesWithEmail = usersWithEmail.map(p => p.profiles.find(p => p.email === profile.email)?.role);
                if(rolesWithEmail.length > 2 && rolesWithEmail.includes("Administrator")) {
                    ctx.addIssue({
                        code: "custom",
                        message: `Email "${profile.email}" is repeated in different profiles and one of them is an administrator`
                    });
                    return z.NEVER;
                }
            }
            emailSet.add(profile.email);
        }

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
}).superRefine((list, ctx) => {
    if ((list as { status?: string })["status"] == "aborted")
        return z.NEVER;

    for (let i = 0; i < list.length; i++) {
        const user = list[i];
        const userProfile = user.profiles.find(p => p.role === "Student");
        if (userProfile) {
            for (const parentDni of userProfile.parentDnis) {
                const index = list.findIndex((p) => p.dni === parentDni);
                if (index === -1) {
                    ctx.addIssue({
                        code: "custom",
                        message: `Parent with DNI ${parentDni} not found`
                    });
                    return z.NEVER;
                }
                if (!list[index].profiles.map(p => p.role).includes("Parent")) {
                    ctx.addIssue({
                        code: "custom",
                        message: `Person with DNI ${parentDni} is not a parent but is listed as a parent of student with DNI ${user.dni}`
                    });
                    return z.NEVER;
                }
            }
        }
    }
}).superRefine((list, ctx) => {
    if ((list as { status?: string })["status"] == "aborted")
        return z.NEVER;

    const students = list.filter(p => p.profiles.map(p => p.role).includes("Student"));
    const studentsWithAnotherRole = students.filter(p => p.profiles.length > 1);
    if (studentsWithAnotherRole.length > 0) {
        ctx.addIssue({
            code: "custom",
            message: `The following students have another role: ${studentsWithAnotherRole.map(p => p.dni)}`
        });
        return z.NEVER;
    }
});

export type UserList = z.infer<typeof UserListSchema>;



