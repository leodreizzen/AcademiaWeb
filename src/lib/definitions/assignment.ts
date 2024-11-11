import {Assignment, Grade, Subject} from "@prisma/client";

export interface AssignmentWithSubject extends Assignment {
    subject: Subject & {
        grade: Grade
    }
}