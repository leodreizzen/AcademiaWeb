import {loginRedirect} from "@/lib/login_redirects";
export default async function LoginRedirect({searchParams: {callbackUrl}}: {
    searchParams: { callbackUrl: string | undefined }
}) {
    await loginRedirect(callbackUrl)
    return (
        <div>
            <h1>Redirecting</h1>
        </div>
    )
}