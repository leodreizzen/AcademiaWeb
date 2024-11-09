import {login} from "@/helpersTest/loginHelper";
import {getTestUser} from "./testdata";
import {Page} from "@playwright/test";
import {es, Faker} from "@faker-js/faker";

export async function loginAsTestUser(page: Page, alias: string){
    const user = getTestUser(alias);
    await login(page, user.dni.toString(), user.password);
}
const faker = new Faker({ locale: [es] })

export function randomPhoneNumber(){
    return faker.string.numeric({length: {min: 8, max: 10}, allowLeadingZeros: false})
}