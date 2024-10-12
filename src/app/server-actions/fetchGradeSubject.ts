"use server"

import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";

export async function getGradesAndSubjects() {
  const prisma = await getCurrentProfilePrismaClient();

  try {
    const grades = await prisma.grade.findMany({
      include: {
        subjects: true,
      },
    });

    return { grades };
  } catch (error) {
    console.error("Error fetching grades and subjects:", error);
    return { grades: [] };
  }
}
