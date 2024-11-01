"use server"
import {LoginData} from "@/lib/models/login";
import {auth, signIn, signOut, unstable_update} from "@/auth";
import {ProfileRole} from "@/lib/definitions";
import {z} from "zod";
import {redirect} from "next/navigation";
import {fetchUserProfiles} from "@/lib/data/users";
import {fetchChildrenByParentDni} from "@/lib/data/children";
import {tryRedirectToCallback} from "../login_redirects";

type CallbackError = {
    type: "CallbackRouteError",
    cause: {
        err: Error
    } | any
}

export async function login(_data: LoginData) {
    try{
        const callback = await signIn("credentials", {dni: _data.dni, password: _data.password, redirect: false})
        await tryRedirectToCallback(callback);
    }catch (e){
        const error = e as CallbackError;
        if (error.type == "CallbackRouteError"){
            return error.cause.err.message
        }
        else throw e
    }
}

export async function selectRole(_role: ProfileRole, callbackUrl?: string): Promise<never> {
    const dni = (await auth())?.user.dni;
    if(!dni) {
        console.error("DNI not set")
        redirect("/login")
    }
    if(!(await auth())?.user.role) {
        const role = z.string().safeParse(_role)
        if(role.success) {
            const userProfiles = await fetchUserProfiles(dni)
            const userProfile = userProfiles.find(profile => profile.role === role.data)

            if (userProfile) {
                let selectedStudentData = {};
                if(role.data == "Parent"){
                    const children = await fetchChildrenByParentDni(userProfile.id);
                    if(children.length === 1){
                        selectedStudentData = {
                            selectedChildId: children[0].id,
                            selectedStudentChangeKey: process.env.SELECT_CHILD_KEY
                        }
                    }
                }

                await unstable_update({user: {role: role.data as ProfileRole}, roleChangeKey: process.env.ROLE_CHANGE_KEY, ...selectedStudentData})
            }
            else {
                console.error("Invalid role", role)
                redirect("/login")
            }

            await tryRedirectToCallback(callbackUrl);
        }
    }
    redirect("/login")
}


export async function logout() {
    await signOut({redirect: false});
    redirect("/login")
}