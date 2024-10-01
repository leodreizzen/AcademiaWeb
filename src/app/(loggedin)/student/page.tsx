/*
* Imports necesarios
* */

import {assertPermission} from "@/lib/access_control";
import {Resource} from "@/lib/operation_list";

export default async function StudentListPage() {
    await assertPermission({resource: Resource.STUDENT, operation: "LIST"});
    return (
        <div className=" w-full flex flex-col items-center justify-center min-h-screen relative">
            <div className=" absolute">
                <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
                </div>
                A LIST OF THE STUDENTS OWO
            </div>
        </div>
    );
}