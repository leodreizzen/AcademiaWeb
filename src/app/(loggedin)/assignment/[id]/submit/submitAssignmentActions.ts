"use server"
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {getAssignmentById} from "@/app/(loggedin)/assignment/add/fetchAssignments";
import {fetchCurrentUser} from "@/lib/data/users";
import fetchStudentById from "@/lib/actions/student-info";
import {generateSignature} from "@/lib/cloudinary/cloudinary_server";
import {SignatureResult} from "@/app/server-actions/submitAssignment";
import {ActionResult} from "@/app/(loggedin)/student/add/types";
import {fetchSubmissionByStudentAndAssignment} from "@/lib/data/assignmentSubmissions";


export async function getAssignmentSubmissionSignature(assignmentId: number): Promise<SignatureResult>{
    const user = await fetchCurrentUser();
    if(!user)
        return { success: false, error: "Debes iniciar sesión para enviar el trabajo" };
    if(user.role !== "Student"){
        return { success: false, error: "No puedes enviar el trabajo porque no eres estudiante" };
    }

    const assignment = await getAssignmentById(assignmentId);
    if(!assignment){
        return { success: false, error: "La tarea no existe" };
    }

    const studentProfile = await fetchStudentById(user.id);
    if(!studentProfile){
        return { success: false, error: "No puedes enviar el trabajo porque no eres estudiante" };
    }
    if(assignment.subject.gradeName !== studentProfile.gradeName){
        return { success: false, error: "No puedes enviar el trabajo porque no eres estudiante del mismo curso" };
    }

    const existingSubmission = await fetchSubmissionByStudentAndAssignment(studentProfile.id, assignmentId);
    if(existingSubmission){
        return { success: false, error: "Ya has enviado este trabajo" };
    }

    const signature = await generateSignature();

    return { success: true, signatureData: signature };
}

export async function submitAssignmentToServer(fileUrl:string, assignmentId: number): Promise<ActionResult>{
    const user = await fetchCurrentUser();
    if(!user)
        return { success: false, error: "Debes iniciar sesión para enviar el trabajo" };
    if(user.role !== "Student"){
        return { success: false, error: "No puedes enviar el trabajo porque no eres estudiante" };
    }

    const assignment = await getAssignmentById(assignmentId);
    if(!assignment){
        return { success: false, error: "La tarea no existe" };
    }

    const studentProfile = await fetchStudentById(user.id);
    if(!studentProfile){
        return { success: false, error: "No puedes enviar el trabajo porque no eres estudiante" };
    }
    if(assignment.subject.gradeName !== studentProfile.gradeName){
        return { success: false, error: "No puedes enviar el trabajo porque no eres estudiante del mismo curso" };
    }

    const existingSubmission = await fetchSubmissionByStudentAndAssignment(studentProfile.id, assignmentId);
    if(existingSubmission){
        return { success: false, error: "Ya has enviado este trabajo" };
    }

    await prisma.assignmentSubmission.create({
        data: {
            uploadDate: new Date(),
            fileUrl,
            student: {
                connect: {
                    id: studentProfile.id
                }
            },
            assignment: {
                connect: {
                    id: assignmentId
                }
            },
        },
    });
    return { success: true };
}