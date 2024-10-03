import { fetchAssignmentsFiltered } from "@/app/(loggedin)/assignment/add/fetchAssignmentsFiltered";
import { fetchAssignments } from "@/app/(loggedin)/assignment/add/fetchAssignments";

export async function getAssignments(
  page: number,
  title?: string,
  subject?: string
) {
  if ((title && title.length > 0) || (subject && subject.length > 0)) {
    return await fetchAssignmentsFiltered({ title, subject }, page);
  } else {
    return await fetchAssignments(page);
  }
}
