import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import SubmitAssignmentForm from "./submitAssignmentForm";
import { getAssignmentById } from "../../add/fetchAssignments";
import { notFound, redirect } from "next/navigation";
import { fetchSubmissionByStudentAndAssignment } from "@/lib/data/assignmentSubmissions";
import { fetchCurrentUser } from "@/lib/data/users";
import fetchStudentById from "@/lib/actions/student-info";

interface AssignmentSubmitParams {
    params: { id: string };
}

export default async function AssignmentSubmitPage({ params, } : AssignmentSubmitParams) {
    await assertPermission({resource: Resource.ASSIGNMENT, operation: "SUBMIT"});
    

    const assignmentId = Number(params.id);
    const assignment = await getAssignmentById(assignmentId);
    if (!assignment) {
        notFound();
    }

    const user = await fetchCurrentUser();
    if(!user || user.role !== "Student")
        redirect('/403');

    const studentProfile = await fetchStudentById(user.id);
    if(!studentProfile || assignment.subject.gradeName !== studentProfile.gradeName) {
        redirect('/403');
    }

    const existingSubmission = await fetchSubmissionByStudentAndAssignment(studentProfile.id, assignmentId);

    return (
        <SubmitAssignmentForm assignment={assignment} existsSubmission={existingSubmission != null} />
    );
}