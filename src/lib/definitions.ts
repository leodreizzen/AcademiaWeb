import {Profile, Prisma} from "@prisma/client";

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
