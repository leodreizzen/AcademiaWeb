import {login} from "@/helpersTest/loginHelper";
import {getTestUser} from "./testdata";
import {Page} from "@playwright/test";

export async function loginAsTestUser(page: Page, alias: string){
    const user = getTestUser(alias);
    await login(page, user.dni.toString(), user.password);
}