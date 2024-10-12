import {ReactElement, ReactNode} from "react";
import {Resend} from "resend";
import {saveTestingEmail} from "@/lib/testing/testUtils";
import {isTesting} from "../../../next.config.mjs";

if(!process.env.RESEND_API_KEY)
    throw new Error("RESEND_API_KEY is not defined")
if(!process.env.EMAIL_DOMAIN)
    throw new Error("EMAIL_DOMAIN is not defined")

const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailSendResult = {
    success: true
} | {
    success: false
    error: string
}

export default async function sendEmail({fromName, fromAccount, to, subject, react, cc, bcc}:{fromName:string, fromAccount:string, to: string, subject: string, cc?: string, bcc?: string, react: ReactElement}): Promise<EmailSendResult>{
    const from = `${fromName} <${fromAccount}@${process.env.EMAIL_DOMAIN}>`;
    if(isTesting()) {
        console.log("Ommiting email send in testing mode")
        saveTestingEmail({to, subject, from: from, cc: cc, bcc: bcc, props:react.props})
        return {success: true}
    }



    const { data, error } = await resend.emails.send({
        from: from,
        to: to,
        subject: subject,
        react: react,
        cc: cc,
        bcc: bcc
    });
    if (error) {
        return {success: false, error: error.message}
    }
    else
        return {success: true}
}