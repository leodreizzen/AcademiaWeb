'use server'

import { getCurrentProfilePrismaClient } from "@/lib/prisma_utils"
import { AssignmentType } from "@/types/assignment"

export async function fetchAssignmentsFiltered(
  {
    title,
    subject,
    grade,
  }: { title?: string; subject?: number; grade?: string },
  page: number
): Promise<AssignmentType[]> {
  console.log("Function called with params:", { title, subject, grade, page })

  const prisma = await getCurrentProfilePrismaClient()
  const NUMBER_OF_PRODUCTS = 10
  const skip = Math.max(0, (page - 1) * NUMBER_OF_PRODUCTS)

  console.log("Calculated skip:", skip)

  try {
    const whereClause: any = {}

    if (title) {
      whereClause.title = {
        contains: title,
        mode: "insensitive",
      }
      console.log("Title filter added:", whereClause.title)
    }

    if (grade && grade !== '-1') {
      whereClause.subject = {
        ...whereClause.subject,
        gradeName: grade,
      }
      console.log("Grade filter added:", grade)
    }

    if (subject && subject !== -1) {
      whereClause.subject = {
        ...whereClause.subject,
        id: subject,
      }
      console.log("Subject filter added:", subject)
    }

    console.log("Final whereClause:", JSON.stringify(whereClause, null, 2))

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
    })

    console.log("Number of results fetched:", results.length)

    const mappedResults = results.map((result) => ({
      ...result,
      subjectName: result.subject.name,
      gradeName: result.subject.gradeName,
    }))

    console.log("First result (if any):", mappedResults[0] || "No results")

    return mappedResults
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return []
  }
}