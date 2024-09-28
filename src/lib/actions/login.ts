"use server"
import {LoginData} from "@/lib/models/login";
import {auth, signIn, signOut, unstable_update} from "@/auth";
import {ProfileRole} from "@/lib/definitions";
import {z} from "zod";
import {redirect} from "next/navigation";
import {headers} from "next/headers";

type CallbackError = {
    type: "CallbackRouteError",
    cause: {
        err: Error
    } | any
}

export async function login(_data: LoginData) {
    try{
        const callback = await signIn("credentials", {dni: _data.dni, password: _data.password, redirect: false})
        const params = new URLSearchParams({callbackUrl: callback})
        redirect("/selectrole?"+params.toString())
    }catch (e){
        const error = e as CallbackError;
        if (error.type == "CallbackRouteError"){
            return error.cause.err.message
        }
        else throw e
    }
}

export async function selectRole(_role: ProfileRole, callbackUrl?: string) {
    if(!(await auth())?.user.role) {
        const role = z.string().safeParse(_role)
        if (role.success) {
            await unstable_update({user: {role: role.data as ProfileRole}})
        }

        if(callbackUrl && new URL(callbackUrl).host === headers().get("host"))
            redirect(callbackUrl);
        else
            redirect("/")
    }}

export async function logout() {
    await signOut({redirect: false});
    redirect("/login")
}