import sendEmail, {EmailSendResult} from "@/lib/email/emailSender";
import ResetPasswordEmail from "../../../emails/PasswordReset";

export default function sendResetPasswordEmail(user: {firstName: string, lastName: string, email: string }, resetLink: string): Promise<EmailSendResult> {
    return sendEmail({
        fromName: "AcedemiaWeb",
        fromAccount: "cuenta",
        to: user.email,
        subject: "Restablecer contraseña",
        react: <ResetPasswordEmail firstName={user.firstName} lastName={user.lastName} resetLink={resetLink}/>});
}