import prisma from "@/lib/prisma";


export default async function removeTodayAttendance() {
    const today = new Date()
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await prisma.attendanceData.findMany({
        where: {
            date: {
                gte: today
            },
            gradeName:"1º año",
            
        }
    })

    for (const attendance of todayAttendance) {
        await prisma.attendanceItem.deleteMany({
            where: {
                AttendanceData: {
                    id: attendance.id,
                }
            }
        })

        await prisma.attendanceData.delete({
            where: {
                id: attendance.id,

            }
        })
    }

}