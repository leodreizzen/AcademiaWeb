import {Profile} from "@prisma/client"
import {User as AcademiaUser} from "@prisma/client"
import { JWT } from "next-auth/jwt"
import {CredentialsInputs} from "next-auth/providers/credentials"
import {ProfileRole} from "@/lib/definitions";

declare module 'next-auth' {
    interface User{
        dni: number
        role: ProfileRole | undefined
        selectedChildId?: number
    }
    interface Session {
        user: User
        roleChangeKey?: string
        selectChildKey?: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role: ProfileRole | undefined,
        dni: number
        selectedChildId?: number
    }
}
