import TeacherRegistrationForm from "@/app/(loggedin)/teacher/add/teacher-registration-form";
import {obtainGradesWithSubjects} from "@/lib/actions/teacher-registration";

export type GradeWithSubjects = {name: string, subjects: {name: string}[]}[]

export default async function TeacherRegistrationPage() {

    const grades: GradeWithSubjects = await obtainGradesWithSubjects()
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
            <TeacherRegistrationForm grades={grades}/>
        </div>
    )
}