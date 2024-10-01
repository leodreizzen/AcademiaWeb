import {redirect} from "next/navigation";
import {auth} from "@/auth";
import RequestResetPassword from "@/components/ui/password_reset/RequestResetForm";

export default async function RequestResetPasswordPage() {
    if((await auth())?.user)
        redirect("/")
    return <RequestResetPassword/>
}
