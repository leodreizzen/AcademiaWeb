import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import SubmitAssignmentForm from "./submitAssignmentForm";
import { getAssignmentById } from "../../add/fetchAssignments";
import { notFound } from "next/navigation";

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

    return (
        <SubmitAssignmentForm assignment={assignment} />
    );
}