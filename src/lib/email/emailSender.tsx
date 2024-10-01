import {ReactNode} from "react";
import {Resend} from "resend";

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

export default async function sendEmail({fromName, fromAccount, to, subject, react}:{fromName:string, fromAccount:string, to: string, subject: string, react: ReactNode}): Promise<EmailSendResult>{
    const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromAccount}@${process.env.EMAIL_DOMAIN}>`,
        to: to,
        subject: subject,
        react: react
    });
    if (error) {
        return {success: false, error: error.message}
    }
    else
        return {success: true}
}