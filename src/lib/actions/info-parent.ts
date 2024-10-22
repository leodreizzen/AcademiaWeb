import {ParentWithUserAndChildren} from "@/lib/definitions/parent";
import prisma from "@/lib/prisma";
import {mapParentWithUserAndChildren} from "@/lib/data/mappings";

export async function fetchParentById(id: string): Promise<ParentWithUserAndChildren | null> {
    const parent = await prisma.parent.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            profile: {
                include: {
                    user: true
                }
            },
            children: {
                include: {
                    profile: {
                        include: {
                            user: true
                        }
                    }
                }
            }
        }

    })
    return parent ? mapParentWithUserAndChildren(parent): null;
}