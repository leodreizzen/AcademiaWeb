import {Profile, Prisma, User} from "@prisma/client";
type DelegateKeys<T> = {
    [K in keyof T]: K extends `delegate${string}` ? K : never;
}[keyof T];
type DelegateNames<T> = {
    [K in DelegateKeys<T>]: NonNullable<T[K]> extends { name: infer N } ? N : never;
}[DelegateKeys<T>];

export type ProfileRole = Exclude<DelegateNames<Prisma.$ProfilePayload["objects"]>, "Superuser">;

export interface ProfileWithRole extends Profile {
    role: ProfileRole
}

export interface ProfileWithRoleAndUser extends ProfileWithRole{
    user : User
}
import getPrismaClient from "./prisma";

export type EnhancedPrismaClient = ReturnType<typeof getPrismaClient>;


type ExtractFnType<T> = T extends (fn: (arg: infer A, ...args: any[]) => any, options?: any) => any ? A : never;

export type TransactionPrismaClient = ExtractFnType<EnhancedPrismaClient['$transaction']>;

export type FieldNullable<T, K extends keyof T> = Omit<T, K> & {
    [P in K]: T[P] | null;
};