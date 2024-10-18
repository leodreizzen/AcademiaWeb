"use server"
import {auth, unstable_update} from "@/auth";
import {redirect} from "next/navigation";
import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchChildrenByParentDni} from "@/lib/data/children";
import {tryRedirectToCallback} from "../login_redirects";

export async function selectChild(id: number, callbackUrl?: string) {
    const session = await auth();
    const dni = session?.user.dni;
    if(!dni) {
        console.error("DNI not set")
        redirect("/login")
    }
    await assertPermission({resource: Resource.USER, operation: "SELECT_CHILD"})

    const availableChildren = await fetchChildrenByParentDni(dni);
    if(!availableChildren.find(child => child.id === id)){
        throw new Error("Child is not assigned to this parent");
    }

    await unstable_update({user: {selectedChildId: id}, selectChildKey: process.env.SELECT_CHILD_KEY})
    await tryRedirectToCallback(callbackUrl);
}