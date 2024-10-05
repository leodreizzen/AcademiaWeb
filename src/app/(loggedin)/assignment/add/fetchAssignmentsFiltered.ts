"use server";

import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";
import { AssignmentType } from "@/types/assignment";

export async function fetchAssignmentsFiltered(
  { title, subject }: { title?: string; subject?: string },
  page: number
): Promise<AssignmentType[]> {
  const prisma = await getCurrentProfilePrismaClient();
  try {
    if (title) {
      const NUMBER_OF_PRODUCTS = 10;
      const results = await prisma.assignment.findMany({
        skip: (page - 1) * NUMBER_OF_PRODUCTS,
        take: NUMBER_OF_PRODUCTS,
        where: {
          title: {
            contains: title,
            mode: "insensitive",
          },
        },
        include: {
          subject: true,
        },
      });

      return results.map(result => ({
        ...result,
        subjectName: result.subject.name,
      }));
    } else {
      const results = await prisma.assignment.findMany({
        where: {
          subject: {
            name: {
              contains: subject,
              mode: "insensitive",
            }
          }
        },
        include: {
          subject: true,
        },
      });

      return results.map(result => ({
        ...result,
        subjectName: result.subject.name,
      }));
    }
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
}
