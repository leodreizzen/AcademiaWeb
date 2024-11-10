import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import { getAssignments } from "@/app/(loggedin)/assignment/add/getAssignments";
import TPListPage from "@/components/list/ListAssignment";
import { ASSIGNMENTS_PER_PAGE } from "@/lib/data/pagination";
import { fetchCurrentUser } from "@/lib/data/users";
import {
  fetchGradesWithSubjectsForStudent,
  fetchGradesWithSubjectsForTeacher,
  GradeWithSubjects,
} from "@/lib/actions/exam-mark";
import fetchStudentById from "@/lib/actions/student-info";
import { redirect } from "next/navigation";

export default async function AssignmentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  await assertPermission({ resource: Resource.ASSIGNMENT, operation: "LIST" });
  const title = searchParams?.title?.toString() || "";
  const subject = parseInt(searchParams?.subject?.toString() || "-1", 10);
  const grade = searchParams?.grade?.toString() || "-1";
  const page = Number(searchParams?.page) || 1;

  const profile = await fetchCurrentUser();
  let grades: GradeWithSubjects[] = [];
  if (profile?.role === "Teacher") {
    grades = await fetchGradesWithSubjectsForTeacher(profile.id);
  } else if (profile?.role === "Student") {
    const student = await fetchStudentById(profile.id);
    if (student) {
      grades = await fetchGradesWithSubjectsForStudent(student.gradeName);
    }
  } else {
    redirect("/403");
  }
  const assignments = await getAssignments(
    page,
    grades,
    title,
    subject,
    grade,
    profile,
  );
  const count = assignments[0]?.count || 0;
  const numberOfPages = Math.ceil(count / ASSIGNMENTS_PER_PAGE);
  return (
    <TPListPage
      totalAssignments={count}
      assignmentsInitial={assignments}
      count={numberOfPages}
      profile={profile}
      grades={grades}
    />
  );
}
