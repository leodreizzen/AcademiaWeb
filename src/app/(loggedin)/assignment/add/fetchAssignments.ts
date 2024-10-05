"use server";
import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";
import { AssignmentType } from "@/types/assignment";

export async function fetchAssignments(page: number): Promise<AssignmentType[]> {
  const prisma = await getCurrentProfilePrismaClient();
  const NUMBER_OF_PRODUCTS = 10;
  try {
    const assignments = await prisma.assignment.findMany({
      skip: (page - 1) * NUMBER_OF_PRODUCTS,
      take: NUMBER_OF_PRODUCTS,
      include: {
        subject: true
      }
    });

    return assignments.map(assignment => ({
      ...assignment,
      subjectName: assignment.subject.name
    }));
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
}

export async function countAssignments() {
  const prisma = await getCurrentProfilePrismaClient();
  try {
    return await prisma.assignment.count();
  } catch (error) {
    console.error("Error counting assignments:", error);
    return 0;
  }
}

export async function getAssignmentById(assignmentId: number) {
  const prisma = await getCurrentProfilePrismaClient();
  try {
    return await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
    });
  } catch (error) {
    console.error("Error fetching assignment by id:", error);
    return null;
  }
}

export async function updateAssignment(assignmentId: number, data: any) {
  const prisma = await getCurrentProfilePrismaClient();
  try {
    await prisma.assignment.update({
      where: {
        id: assignmentId,
      },
      data: {
        title: data.title,
        description: data.description,
      },
    });
  } catch (error) {
    console.error("Error updating assignment:", error);
  }
}