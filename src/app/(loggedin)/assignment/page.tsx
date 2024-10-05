import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import { getAssignments } from "@/app/(loggedin)/assignment/add/getAssignments";
import TPListPage from "@/components/ui/Assignment/ListAssignment";
import { countAssignments } from "./add/fetchAssignments";

export default async function AssignmentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  await assertPermission({ resource: Resource.ASSIGNMENT, operation: "LIST" });
  const title = searchParams?.title || "";
  const subject = searchParams?.subject || "";
  const page = Number(searchParams?.page) || 1;
  const COUNT_PER_PAGE = 10;

  const assignments = await getAssignments(page, title, subject);
  const count = await countAssignments();

  const numberOfPages = Math.ceil(count / COUNT_PER_PAGE);

  return <TPListPage initialAssignments={assignments} count={numberOfPages} />;
}
