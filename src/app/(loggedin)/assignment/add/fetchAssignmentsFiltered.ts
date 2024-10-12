"use server";

import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";
import { AssignmentType } from "@/types/assignment";

export async function fetchAssignmentsFiltered(
  {
    title,
    subject,
    grade,
  }: { title?: string; subject?: number; grade?: string },
  page: number
): Promise<AssignmentType[]> {
  const prisma = await getCurrentProfilePrismaClient();
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
      where: whereClause,
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
