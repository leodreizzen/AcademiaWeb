import sendEmail from "@/lib/email/emailSender";
import SignatureEmail, {SignatureEmailContext, signatureTypeDescription} from "../../../emails/SignatureCode";

type SignatureEmailProps = {
    parent: { firstName: string, lastName: string, email: string }
    student: {firstName:string, lastName:string},
    signatureCode: number,
    context: SignatureEmailContext
}

export default function sendSignatureEmail({parent, student, signatureCode, context}: SignatureEmailProps) {
    const typeDescription = signatureTypeDescription(context)
    return sendEmail({
        fromName: "AcedemiaWeb",
        fromAccount: "firmas",
        to: parent.email,
        subject: `Código para firmar ${typeDescription}`,
        react: <SignatureEmail parent={parent} student={student} signatureCode={signatureCode} context={context}/>
    });

}