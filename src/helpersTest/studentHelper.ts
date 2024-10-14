import { Page, expect } from "@playwright/test";
import {  faker } from "@faker-js/faker/locale/es";


export async function randomDNI() {
    const MAX = 999999999
    const MIN = 10000000
    return (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString()
};

export async function searchStudentByDni(page: Page, Dni: string) {
    await page.fill('input[placeholder="Buscar por DNI"]', Dni);
    await page.click('svg.lucide-search');

    const expectedUrlPattern = new RegExp(`/student\\?dni=${Dni}&lastName=`);
    await page.waitForURL(expectedUrlPattern);

    if (await page.isVisible(`text=${Dni}`)) {
        return true;
    }
    else {
        return false;
    }

}

export async function searchStudentByLastName(page: Page, LastName: string) {
    await page.fill('input[placeholder="Buscar por Apellido"]', LastName);
    await page.click('svg.lucide-search');

    const expectedUrlPattern = new RegExp(`/student\\?dni=&lastName=${LastName}`);
    await page.waitForURL(expectedUrlPattern);

    if (await page.isVisible(`text=${LastName}`)) {
        return true;
    }
    else {
        return false;
    }
}


function randomYear() {
    const MAX = 2019
    const MIN = 2006
    return (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString()
}

function randomDay() {
    const MAX = 28
    const MIN = 1
    return (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString()
}

export async function newBirthDate(page: Page) {
    const year = randomYear();
    const month = faker.date.month({context:true, }).toString();
    const day = randomDay();

    console.log(month);
    await page.waitForTimeout(500);
    await page.locator('#dob').click();
    await page.waitForTimeout(500);
    
    while (await page.getByRole('dialog').isVisible() === false) {
        await page.locator('#dob').click();
        await page.waitForTimeout(500);
    }


    await page.getByRole('dialog').focus();
    await page.waitForTimeout(1000);

    while (await page.isVisible(`text=${month}`) === false) {
        await page.getByTestId('ArrowLeftIcon').click();
    }

    await page.getByTestId('ArrowDropDownIcon').click();
    await page.getByRole('radio', { exact:true, name: year }).click();
    await page.getByRole('gridcell', { exact: true, name: day }).click();

}