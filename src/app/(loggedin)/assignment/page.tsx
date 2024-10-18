import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import { getAssignments } from "@/app/(loggedin)/assignment/add/getAssignments";
import TPListPage from "@/components/list/ListAssignment";

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
  const COUNT_PER_PAGE = 10;

  const assignments= await getAssignments(page, title, subject, grade);
  const count = assignments[0]?.count || 0;
  const numberOfPages = Math.ceil(count / COUNT_PER_PAGE);

  return (
    <TPListPage
      data={assignments}
      count={numberOfPages}
    />
  );
}
