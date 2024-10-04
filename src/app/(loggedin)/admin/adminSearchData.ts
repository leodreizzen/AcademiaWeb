import {z} from 'zod';

export const AdminSearchModel = z.object(
    {
        dni: z.optional(
            z.coerce
            .number({invalid_type_error: "Ingrese un DNI válido."})
            .int("Ingrese un DNI válido.")
            .refine((value) => value.toString().length >= 7 && value.toString().length <= 9, {
                message: "El DNI debe tener entre 7 y 9 dígitos.",
            })
        ),
        lastName: z.optional(z.string().min(2, "Ingrese un apellido válido.")),
    }
);

export type AdminSearchData = z.infer<typeof AdminSearchModel>;