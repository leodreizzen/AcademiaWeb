/*
* imports necesarios
* */

import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function EditParentPage() {
    await assertPermission({resource: Resource.PARENT, operation: "UPDATE"});

    return (
        <div className=" w-full flex flex-col items-center justify-center min-h-screen relative">
            <div className=" absolute">
                <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
                </div>
               se edita el parent :D
            </div>
        </div>
    );
}