import {Profile, Prisma, User} from "@prisma/client";
import * as runtime from "@prisma/client/runtime/library";
import prisma from "@/lib/prisma";
type DelegateKeys<T> = {
    [K in keyof T]: K extends `delegate${string}` ? K : never;
}[keyof T];
type DelegateNames<T> = {
    [K in DelegateKeys<T>]: NonNullable<T[K]> extends { name: infer N } ? N : never;
}[DelegateKeys<T>];

export type ProfileRole = Profile["role"];

export type FieldNullable<T, K extends keyof T> = Omit<T, K> & {
    [P in K]: T[P] | null;
};

export interface UserWithoutPassword extends Omit<User, "passwordHash"> {}


export type TransactionPrismaClient = Omit<typeof prisma, runtime.ITXClientDenyList>