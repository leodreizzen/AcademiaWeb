"use server";
import { Assignment } from "@prisma/client";

export interface AssignmentListProps {
  initialAssignments: Assignment[];
}