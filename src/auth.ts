import "server-only";
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import {LoginModel} from "@/lib/models/login";
import {checkLogin, fetchUserProfiles, LoginError} from "@/lib/data/users";
import {ProfileRole} from "@/lib/definitions";

export const { auth, signIn, signOut , unstable_update} = NextAuth({
    ...authConfig,
    providers: [Credentials({
        async authorize(credentials) {
            const parsedCredentials = LoginModel.safeParse(credentials)
            if(!parsedCredentials.success) {
                throw new Error("Datos inválidos:" + parsedCredentials.error.errors)
            }
            const loginResult = await checkLogin(parsedCredentials.data.dni, parsedCredentials.data.password)
            if(!loginResult.success) {
                switch(loginResult.error) {
                    case LoginError.USER_NOT_FOUND:
                        throw new Error("El usuario no existe")
                    case LoginError.PASSWORD_INCORRECT:
                        throw new Error("La contraseña ingresada es incorrecta")
                    default:
                        console.error("Unknown login error type", loginResult)
                        throw new Error("Error desconocido")
                }
            }
            const profiles = await fetchUserProfiles(parsedCredentials.data.dni);
            if(profiles.length === 1){
                return {dni: parsedCredentials.data.dni, role: profiles[0].role as ProfileRole}
            }
            else
                return {dni: parsedCredentials.data.dni, role: undefined}
        }
    })]
});