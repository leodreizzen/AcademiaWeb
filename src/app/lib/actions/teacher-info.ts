import {expandProfile} from "@/lib/data/mappings";
import prisma from "@/lib/prisma";

export default async function getTeacherInfo(id: number) {
    const teacherInfo = await prisma.teacher.findFirst({
        where: {
            id: id
        },
        include: {
            profile: {
                include: {
                    user: true
                }
            },
            subjects: true
        }
    });
    return teacherInfo ? expandProfile(teacherInfo) : null;
}