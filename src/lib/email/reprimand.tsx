import sendEmail, {EmailSendResult} from "@/lib/email/emailSender";
import ReprimandNotificationEmail from "../../../emails/ReprimandNotification";
import {Reprimand} from "@prisma/client";
import {getFullUrl} from "@/lib/serverUtils";

export default function sendReprimandEmail(parent: { firstName: string, lastName: string, email: string }, student: {firstName:string, lastName:string}, reprimand: Reprimand): Promise<EmailSendResult> {
    const detailsLink = getFullUrl(`/reprimand/${reprimand.id}`);
    return sendEmail({
        fromName: "AcedemiaWeb",
        fromAccount: "amonestaciones",
        to: parent.email,
        subject: "Notificación de amonestación",
        react: <ReprimandNotificationEmail student={student} recipient={parent} detailsLink={detailsLink} sanctionReason={reprimand.message}/>});
}