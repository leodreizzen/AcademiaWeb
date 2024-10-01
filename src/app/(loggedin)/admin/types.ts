import { Administrator, User } from "@prisma/client";

export type AdministatorUser = Administrator & { user: User };