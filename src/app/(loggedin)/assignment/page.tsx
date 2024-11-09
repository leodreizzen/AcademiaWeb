import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import { getAssignments } from "@/app/(loggedin)/assignment/add/getAssignments";
import TPListPage from "@/components/list/ListAssignment";
import {ASSIGNMENTS_PER_PAGE} from "@/lib/data/pagination";
import { fetchCurrentUser } from "@/lib/data/users";

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

  const assignments= await getAssignments(page, title, subject, grade);
  const count = assignments[0]?.count || 0;
  const numberOfPages = Math.ceil(count / ASSIGNMENTS_PER_PAGE);
  const profile = await fetchCurrentUser();

  return (
    <TPListPage
      totalAssignments={count}
      data={assignments}
      count={numberOfPages}
      profile={profile}
    />
  );
}
