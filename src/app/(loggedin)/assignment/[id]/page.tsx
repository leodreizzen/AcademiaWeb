"use server";

import { assertPermission } from "@/lib/access_control";
import { Resource } from "@/lib/operation_list";
import AssignmentDetailsClient from "./AssignmentDetails";
import prisma from "@/lib/prisma";
import {fetchCurrentUser} from "@/lib/data/users";
import {redirect} from "next/navigation";
import fetchStudentById from "@/lib/actions/student-info";
import {fetchSelectedChild} from "@/lib/data/children";
import { fetchSubmissionByStudentAndAssignment } from "@/lib/data/assignmentSubmissions";

export default async function AssignmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  await assertPermission({ resource: Resource.ASSIGNMENT, operation: "READ" });

  const assignmentData = await prisma.assignment.findUnique({
    where: { id: Number(params.id) },
    include: {
      subject: {
        include: {
          grade: true,
          teachers: true,
        },
      },
    },
  });



  if (!assignmentData) {
    return <div>No se encontró el trabajo práctico.</div>;
  }

  const user = await fetchCurrentUser();
  if(!user){
    redirect("/403");
  }
  if(user.role == "Teacher"){
    if(assignmentData.subject.teachers.find(teacher => teacher.id == user.id) == null){
      redirect("/403");
    }
  } else if (user.role == "Student"){
    const student = await fetchStudentById(user.id);
    if(!student)
      redirect("/403");
    if(student.gradeName != assignmentData.subject.grade.name){
      redirect("/403");
    }
  } else if(user.role == "Parent"){
    const student = await fetchSelectedChild();
    if(!student)
      redirect("/403");
    if(student.gradeName != assignmentData.subject.grade.name){
      redirect("/403");
    }
  }

  const assignment = {
    id: assignmentData.id,
    title: assignmentData.title,
    description: assignmentData.description || "",
    fileUrl: assignmentData.fileUrl,
    grade: assignmentData.subject?.grade || { name: "Sin Grado" },
    subject: assignmentData.subject,
  };

  let existingSubmission = false;

  if (user.role === "Student") {
    const studentProfile = await fetchStudentById(user.id);
    if(!studentProfile || assignment.subject.gradeName !== studentProfile.gradeName) {
        redirect('/403');
    }
  
    existingSubmission = await fetchSubmissionByStudentAndAssignment(studentProfile.id, assignment.id) != null;
  }

  return <AssignmentDetailsClient assignment={assignment} isStudent={user.role === "Student"} isSubmitted={existingSubmission} />;
}
