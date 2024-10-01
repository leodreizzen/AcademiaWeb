import {auth} from "@/auth";
import {redirect} from "next/navigation";
import LoginForm from "@/components/ui/LoginForm";

export default async function LoginPage({searchParams: {callbackUrl}}: {searchParams: {callbackUrl?: string}}) {
    if ((await auth())?.user) {
        redirect(callbackUrl ?? "/")
    }
    else {
        return <LoginForm/>
    }
}
