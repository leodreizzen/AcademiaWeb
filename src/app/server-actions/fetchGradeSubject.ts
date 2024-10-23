"use server"

import prisma from "@/lib/prisma";

export async function getGradesAndSubjects() {
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
