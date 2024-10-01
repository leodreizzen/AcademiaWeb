"use server";

import  getPrismaClient  from "@/lib/prisma";
import { AssignmentListProps } from "@/types/assignment";

const session: { user: { dni: number; role: "Teacher" | "Superuser" | "Student" | "Parent" | "Administrator" } } = {
  user: {
    dni: 22222222,
    role: "Teacher",
  },
}
const prisma = getPrismaClient({id: session.user.dni, role: session.user.role});

export async function getAssignments(): Promise<AssignmentListProps> {
    const assignments = await prisma.assignment.findMany();
    return { initialAssignments: assignments };
  }
  