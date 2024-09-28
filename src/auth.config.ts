import {NextAuthConfig} from "next-auth";
import {fetchUserProfiles} from "@/lib/data/users";
import {ProfileRole} from "@/lib/definitions";
import {z} from "zod";
import {getPermission} from "@/url_operations";
import {hasPermission} from "@/lib/permissions";

export const authConfig = {
    pages: {
        signIn: '/login'
    },
    callbacks: {
        authorized({auth, request: {nextUrl}}) {
            const isLoggedIn = !!auth?.user;
            if (!isLoggedIn) {
                return nextUrl.pathname === '/login'
            } else{
                if(nextUrl.pathname === '/selectrole' || nextUrl.pathname === '/403')
                    return true
                if (!auth.user.role){
                    const newUrl = new URL('/selectrole', nextUrl);
                    const callback = nextUrl.searchParams.get('callbackUrl');
                    if (callback)
                        newUrl.searchParams.set('callbackUrl', callback)
                    else
                        newUrl.searchParams.set('callbackUrl', nextUrl.toString())
                    return Response.redirect(newUrl)
                }
                if(nextUrl.pathname === '/')
                    return true;

                const permission = getPermission(nextUrl.pathname)

                if(!permission)
                    return Response.redirect(new URL('/403', nextUrl));

                if(!hasPermission(auth.user.role, permission))
                    return Response.redirect(new URL('/403', nextUrl));
            }
            return true

        },
        session({session, token, user}) {
            session.user.role = token.role
            session.user.dni = token.dni
            return session
        },
        async jwt({token, user, account, profile, trigger, session}) {
            if(trigger === 'update' && session?.user?.role) {
                const newRole = z.string().safeParse(session.user.role)
                if(newRole.success) {
                    const userProfiles = await fetchUserProfiles(token.dni)
                    const userProfile = userProfiles.find(profile => profile.role === newRole.data)
                    if (userProfile) {
                        token.role = userProfile.role as ProfileRole
                    }
                    else
                        console.error("Invalid role", session.user.role)
                }
                else
                    console.error("Invalid role", session.user.role)
            }
            if (user) {
                token.dni = user.dni
                token.role = user.role
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