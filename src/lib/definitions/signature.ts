import {ParentWithUser} from "@/lib/definitions/parent";
import {Signature} from "@prisma/client";

export type SignatureWithParent = Signature & {
    parent: ParentWithUser
}