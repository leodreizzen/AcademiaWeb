"use server";
import { AssignmentType } from "@/types/assignment";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GradeWithSubjects } from "@/lib/actions/exam-mark";

export async function fetchAssignments(
  page: number,
  possibleGrades: GradeWithSubjects[]
): Promise<AssignmentType[]> {
  const NUMBER_OF_PRODUCTS = 10;
  const skip = Math.max(0, (page - 1) * NUMBER_OF_PRODUCTS);
  try {
    const assignments = await prisma.assignment.findMany({
      skip: skip,
      take: NUMBER_OF_PRODUCTS,
      include: {
        subject: true,
      },
      where: {
        subject: {
          gradeName: {
            in: possibleGrades.map((grade) => grade.name),
          },
        },
      },
    });

    const count = await prisma.assignment.count({});

    return assignments.map((assignment) => ({
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
            grade: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching assignment by id:", error);
    return null;
  }
}

export async function fetchAssignmentsFiltered(
  page: number,
  possibleGrades: GradeWithSubjects[],
  title?: string,
  subject?: number,
  grade?: string,
): Promise<AssignmentType[]> {
  const NUMBER_OF_PRODUCTS = 10;
  const skip = Math.max(0, (page - 1) * NUMBER_OF_PRODUCTS);

  try {
    const whereClause: any = {};

    if (title) {
      whereClause.title = {
        contains: title,
        mode: "insensitive",
      };
    }

    if (grade && grade !== "-1") {
      whereClause.subject = {
        ...whereClause.subject,
        gradeName: grade,
      };
    }

    if (subject && subject !== -1) {
      whereClause.subject = {
        ...whereClause.subject,
        id: subject,
      };
    }

    const results = await prisma.assignment.findMany({
      skip: skip,
      take: NUMBER_OF_PRODUCTS,
      where: {
        ...whereClause,
        subject: {
          gradeName: {
            in: possibleGrades.map((grade) => grade.name),
          },
        },
      },
      include: {
        subject: {
          include: {
            grade: true,
          },
        },
      },
    });

    const count = await prisma.assignment.count({
      where: whereClause,
    });

    const mappedResults = results.map((result) => ({
      ...result,
      subjectName: result.subject.name,
      gradeName: result.subject.gradeName,
      count: count,
    }));

    return mappedResults;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
}

export async function updateAssignment(
  assignmentId: number,
  data: { title: string; description: string; subjectId: number }
) {
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
