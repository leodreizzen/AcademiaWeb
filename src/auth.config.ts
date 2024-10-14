import {NextAuthConfig} from "next-auth";
import {anonymousPages, getPermission} from "@/url_operations";
import {hasPermission} from "@/lib/permissions";
import {NextURL} from "next/dist/server/web/next-url";


if(!process.env.ROLE_CHANGE_KEY)
    throw new Error("ROLE_CHANGE_KEY not set")
if(!process.env.SELECT_CHILD_KEY)
    throw new Error("SELECT_CHILD_KEY not set")

function redirectWithCallback(nextUrl: NextURL, path: string) {
    const newUrl = new URL(path, nextUrl);
    const callback = nextUrl.searchParams.get('callbackUrl');
    if (callback)
        newUrl.searchParams.set('callbackUrl', callback)
    else
        newUrl.searchParams.set('callbackUrl', nextUrl.toString())
    return Response.redirect(newUrl)
}

export const authConfig = {
    pages: {
        signIn: '/login'
    },
    callbacks: {
        authorized({auth, request: {nextUrl}}) {
            const isLoggedIn = !!auth?.user;
            if(anonymousPages.includes(nextUrl.pathname))
                return true

            if (!isLoggedIn) {
                return nextUrl.pathname === '/login'
            } else{
                if(nextUrl.pathname === '/selectrole')
                    return true
                if (!auth.user.role){
                    return redirectWithCallback(nextUrl, "/selectrole");
                }
                if(auth.user.role == "Parent"){
                    if(nextUrl.pathname === '/selectstudent')
                        return true
                    if(!auth.user.selectedChildId){
                        return redirectWithCallback(nextUrl, "/selectstudent");
                    }
                }

                if(nextUrl.pathname === '/')
                    return true;

                const permission = getPermission(nextUrl.pathname)

                if(!permission) {
                    console.error("Permission not found for", nextUrl.pathname)
                    return Response.redirect(new URL('/403', nextUrl));
                }
                if(!hasPermission(auth.user.role, permission)) {
                    console.log(`User with role ${auth.user.role} tried to access ${JSON.stringify(permission)}`);
                    return Response.redirect(new URL('/403', nextUrl));
                }
            }
            return true

        },
        session({session, token, user}) {
            session.user.role = token.role
            session.user.dni = token.dni
            session.user.selectedChildId = token.selectedChildId
            return session
        },
        async jwt({token, user, account, profile, trigger, session}) {
            if(trigger === 'update') {
                if (session?.user?.role) {
                    if (!session.roleChangeKey || session.roleChangeKey !== process.env.ROLE_CHANGE_KEY) {
                        console.error("Invalid role change key")
                        return token
                    }
                    token.role = session.user.role
                }
                if (session?.user?.selectedChildId) {
                    if (!session.selectChildKey || session.selectChildKey !== process.env.SELECT_CHILD_KEY) {
                        console.error("Invalid selected student change key")
                        return token
                    }
                    token.selectedChildId = session.user.selectedChildId
                }
            }
            if (user) {
                token.dni = user.dni
                token.role = user.role
                token.selectedChildId = user.selectedChildId
            }
            return token
        },
        redirect({url, baseUrl}) {
            const urlObject = new URL(url)
            const callbackUrl = urlObject.searchParams.get('callbackUrl')
            if (callbackUrl) {
                url = callbackUrl
            }

            // default behavior
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl

        }
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;