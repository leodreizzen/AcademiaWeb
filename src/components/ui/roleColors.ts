import {ProfileRole} from "@/lib/definitions";

export const roleColors: Record<ProfileRole, string> = {
    "Parent": "text-blue-400",
    "Teacher": "text-green-400",
    "Student": "text-yellow-400",
    "Administrator": "text-red-400",
} as const