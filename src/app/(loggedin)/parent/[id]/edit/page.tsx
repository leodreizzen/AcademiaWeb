import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";
import {fetchParentById} from "@/lib/actions/info-parent";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import EditParent from "@/components/ui/editParent";
import {ParentWithUser} from "@/lib/definitions/parent";


export default async function EditParentPage({params}: {params: {id: string}}) {

    await assertPermission({resource: Resource.PARENT, operation: "UPDATE"});
    const parent = await fetchParentById(params.id);
    if (!parent) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-gray-800 text-gray-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Responsable no encontrado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">El responsable con el ID {params.id} no existe.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }
    return(
        <EditParent parent={parent} id={parseInt(params.id)}/>
    )

}
