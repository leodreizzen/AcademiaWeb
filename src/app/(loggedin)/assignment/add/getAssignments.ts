import { fetchAssignmentsFiltered } from "@/app/(loggedin)/assignment/add/fetchAssignmentsFiltered";
import { fetchAssignments } from "@/app/(loggedin)/assignment/add/fetchAssignments";
import { AssignmentType } from "@/types/assignment";

export async function getAssignments(
  page: number,
  title?: string,
  subject?: number,
  grade?: string,
): Promise<AssignmentType[]> {
  if ((title && title.length > 0) || (subject && subject >= 0) || (grade && grade.length > 0)) {
    return await fetchAssignmentsFiltered({ title, subject, grade }, page);
  } else {
    return await fetchAssignments(page);
  }
}
