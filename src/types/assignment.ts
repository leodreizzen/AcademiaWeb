"use server";
import { Assignment } from "@prisma/client";

export type AssignmentType = Assignment & {
    subjectName: string;
    gradeName: string;
};