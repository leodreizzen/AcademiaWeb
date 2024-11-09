import {
  fetchAssignments,
  fetchAssignmentsFiltered,
} from "@/app/(loggedin)/assignment/add/fetchAssignments";
import { AssignmentType } from "@/types/assignment";
import { PrismaProfileWithUser } from "@/lib/data/mappings";
import { GradeWithSubjects } from "@/lib/actions/exam-mark";

export async function getAssignments(
  page: number,
  possibleGrades: GradeWithSubjects[],
  title?: string,
  subject?: number,
  grade?: string,
  profile?: PrismaProfileWithUser | null,
): Promise<AssignmentType[]> {
  if (!profile) {
    return [];
  }
  if (
    (title && title.length > 0) ||
    (subject && subject >= 0) ||
    (grade && grade.length > 0)
  ) {
    return await fetchAssignmentsFiltered(
      page,
      possibleGrades,
      title,
      subject,
      grade
    );
  } else {
    return await fetchAssignments(page, possibleGrades);
  }
}
