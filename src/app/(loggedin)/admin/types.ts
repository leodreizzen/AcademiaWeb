import { Administrator, User } from "@prisma/client";

export type AdministatorUser = Administrator & { user: User };

export interface AdminQuery {
    page: number;
    dni?: number;
    lastName?: string;
}