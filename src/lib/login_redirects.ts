"use server"
import {auth} from "../auth";
import {redirect} from "next/navigation";
import {headers} from "next/headers";
import {URL} from "url"
/*
    Needed due to a Next/Nextjs bug with double redirects
 */

export async function tryRedirectToCallback(callbackUrl: string | undefined) {
    redirect("/loginredirect?callbackUrl=" + encodeURIComponent(callbackUrl ?? "/"))
}

export async function loginRedirect(callbackUrl: string | undefined){
    const session = await auth();

    const searchParams = new URLSearchParams();
    if(callbackUrl && (callbackUrl.startsWith("/") ||  new URL(callbackUrl).host === headers().get("host")))
        searchParams.append("callbackUrl", callbackUrl);

    if(!session?.user)
        redirect("/login?"+searchParams.toString());
    if(!session.user.role)
        redirect("/selectrole?"+searchParams.toString());
    if(session.user.role == "Parent" && !session.user.selectedChildId)
        redirect("/selectstudent?"+searchParams.toString());

    redirect(callbackUrl || "/");
}