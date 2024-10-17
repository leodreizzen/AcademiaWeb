import {TestEmailsAPIResponse} from "@/app/api/internal/test-emails/types";

export const dynamic = "force-dynamic"
import {NextResponse} from "next/server";
import {
    clearTestingEmails,
    getTestingEmails
} from "@/lib/testing/testUtils";
import {notFound} from "next/navigation";
import {isTesting} from "../../../../../next.config.mjs";

export function POST(): NextResponse<TestEmailsAPIResponse>{
    if(!isTesting()) {
        console.error("This endpoint is only available in testing mode")
        notFound()
    }
    const res = getTestingEmails();
    clearTestingEmails();
    return NextResponse.json(res)
}