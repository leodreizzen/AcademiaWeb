import {Parent, Profile, User} from "@prisma/client"

export type ActionResult = {
    success: true,
} | {
    success: false,
    error: string,
}