'use server';
import getPrismaClient from '@/app/lib/prisma';

const prisma = getPrismaClient({id: 1, role: "Administrator"});


export async function fetchGrades() {
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