"use server";
import { AssignmentType } from "@/types/assignment";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export async function fetchAssignments(page: number): Promise<AssignmentType[]> {
  const NUMBER_OF_PRODUCTS = 10;
  const skip = Math.max(0, (page - 1) * NUMBER_OF_PRODUCTS);
  try {
    const assignments = await prisma.assignment.findMany({
      skip: skip,
      take: NUMBER_OF_PRODUCTS,
      include: {
        subject: true
      }
    });

    const count = await prisma.assignment.count({
    });

    return assignments.map(assignment => ({
      ...assignment,
      subjectName: assignment.subject.name,
      gradeName: assignment.subject.gradeName,
      count: count,
    }));
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
}

export async function getAssignmentById(assignmentId: number) {
  try {
    return await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        subject: {
          include: {
            grade: true
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching assignment by id:", error);
    return null;
  }
}

export async function updateAssignment(assignmentId: number, data: { title: string, description: string, subjectId: number }) {
  try {
    await prisma.assignment.update({
      where: {
        id: assignmentId,
      },
      data: {
        title: data.title,
        description: data.description,
        subjectId: data.subjectId,
      },
    });
    revalidatePath("/assignment");
    revalidatePath(`/assignment/${assignmentId}`);
    revalidatePath(`/assignment/${assignmentId}/edit`);
  } catch (error) {
    console.error("Error updating assignment:", error);
    throw error;
  }
}