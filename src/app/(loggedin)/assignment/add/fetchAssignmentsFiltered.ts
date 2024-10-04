"use server";

import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";

export async function fetchAssignmentsFiltered(
  { title, subject }: { title?: string; subject?: string },
  page: number
) {
  const prisma = await getCurrentProfilePrismaClient();
  try {
    if (title) {
      const NUMBER_OF_PRODUCTS = 10;
      return await prisma.assignment.findMany({
        skip: (page - 1) * NUMBER_OF_PRODUCTS,
        take: NUMBER_OF_PRODUCTS,
        where: {
          title: {
            contains: title,
            mode: "insensitive",
          },
        },
      });
    } else {
      return await prisma.assignment.findMany({
        where: {
          /* TODO: uncomment
          subject: {
            contains: subject,
            mode: "insensitive",
          },*/
        },
      });
    }
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
}
