import {z} from "zod";
import {minDigits, maxDigits} from "@/lib/utils";

const invalidTokenMsg = "Ingresa un código válido"
export const SignatureTokenModel = z.object({
    token: z.coerce.number({
        message: "Ingresa un código",
        invalid_type_error: invalidTokenMsg
    }).int(invalidTokenMsg)
        .min(minDigits(4), invalidTokenMsg)
        .max(maxDigits(4), invalidTokenMsg)
})

export type SignatureTokenData = z.infer<typeof SignatureTokenModel>