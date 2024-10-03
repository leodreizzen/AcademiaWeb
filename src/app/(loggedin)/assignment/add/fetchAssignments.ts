"use server";
import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils";

export async function fetchAssignments(page: number) {
  const prisma = await getCurrentProfilePrismaClient();
  const NUMBER_OF_PRODUCTS = 10;
  try {
    return await prisma.assignment.findMany({
      skip: (page - 1) * NUMBER_OF_PRODUCTS,
      take: NUMBER_OF_PRODUCTS,
    });
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
