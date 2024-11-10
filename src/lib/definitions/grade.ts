import {Grade, Subject} from "@prisma/client";

export interface GradeWithSubjects extends Grade{
    subjects: Subject[];
}