'use server';
import {getCurrentProfilePrismaClient} from "@/lib/prisma_utils";



export async function fetchGrades() {
    const prisma = await getCurrentProfilePrismaClient();
    try {
        return await prisma.grade.findMany({
            include: {students: false, subjects: false},
        });
    } catch (error) {
        console.error("Error fetching grades:", error);
        return [];
    }
}

/*
* 'use server';
*
* model Grade {
  name     String    @id()
  subjects Subject[]
  students Student[]
}
*
*
* export async function fetchGrades() {
*
*    try{
*     return await prisma.grade.findMany({
*        include: {students: false, subjects: false},
*    })
*   }catch(error){
*      console.error("Error fetching grades:", error);
*     return [];
*  }
*
*
*
* }
*
*
*
*
*
*
*
*
*
*
* */