import "server-only";
import {headers} from "next/headers";
export function getFullUrl(path: string): string{
    const domain = headers().get("host");
    if (!domain)
        throw new Error("No domain found in headers");

    if(process.env.VERCEL)
        return `https://${domain}${path}`
    else
        return `http://${domain}${path}`
}