import { Page, expect } from "@playwright/test";
import { faker } from "@faker-js/faker/locale/es";
import { searchParentByDni } from "./parentHelper";
import {randomPhoneNumber} from "../../tests/testutils";


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


export function monthToNumber(month: string) {
    switch (month) {
        case 'enero':
            return '01';
        case 'febrero':
            return '02';
        case 'marzo':
            return '03';
        case 'abril':
            return '04';
        case 'mayo':
            return '05';
        case 'junio':
            return '06';
        case 'julio':
            return '07';
        case 'agosto':
            return '08';
        case 'septiembre':
            return '09';
        case 'octubre':
            return '10';
        case 'noviembre':
            return '11';
        case 'diciembre':
            return '12';
        default:
            return '01';
    }
}

export async function newBirthDate(page: Page) {
    const year = randomYear();
    const month = faker.date.month({ context: true, }).toString();
    const day = randomDay();

    await page.waitForTimeout(500);
    await page.locator('#dob').click();
    await page.waitForTimeout(500);

    while (await page.getByRole('dialog').isVisible() === false) {
        await page.locator('#dob').click();
        await page.waitForTimeout(500);
    }


    await page.getByRole('dialog').focus();
    await page.waitForTimeout(1000);


    await page.getByTestId('ArrowDropDownIcon').click();
    await page.getByRole('radio', { exact: true, name: year }).click();

    while (await page.isVisible(`.MuiPickersCalendarHeader-label:has-text("${month}")`) === false) {
        await page.getByTestId('ArrowLeftIcon').click();
        await page.waitForTimeout(500);
    }

    if (await page.isVisible(`.MuiPickersCalendarHeader-label:has-text("${year}")`) === false) {
        await page.getByTestId('ArrowRightIcon').click();
        await page.waitForTimeout(500);
        while (await page.isVisible(`.MuiPickersCalendarHeader-label:has-text("${month}")`) === false) {
            await page.getByTestId('ArrowRightIcon').click();
            await page.waitForTimeout(500);
        }
    }

    await page.getByRole('gridcell', { exact: true, name: day }).first().click();

    return `${day}/${monthToNumber(month)}/${year}`;

}

export async function newBirthDateCustom(page: Page, year: string, month: string, day: string) {

    await page.waitForTimeout(500);
    await page.locator('#dob').click();
    await page.waitForTimeout(500);

    while (await page.getByRole('dialog').isVisible() === false) {
        await page.locator('#dob').click();
        await page.waitForTimeout(500);
    }


    await page.getByRole('dialog').focus();
    await page.waitForTimeout(1000);


    await page.getByTestId('ArrowDropDownIcon').click();
    await page.getByRole('radio', { exact: true, name: year }).click();

    while (await page.isVisible(`.MuiPickersCalendarHeader-label:has-text("${month}")`) === false) {
        await page.getByTestId('ArrowLeftIcon').click();
        await page.waitForTimeout(500);
    }

    await page.getByRole('gridcell', { exact: true, name: day }).first().click();

    return `${day}/${monthToNumber(month)}/${year}`;

}

export async function createStudentWithOneParent(page: Page) {
    const dni = await randomDNI();

    await page.locator('input[id="input-dni"]').fill(dni);
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDate(page);
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).last().click();

    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/student');

    await expect(page).toHaveURL('/student');

    return dni;

}

export async function removeStudent(page: Page, dni: string) {
    await searchStudentByDni(page, dni.toString());

    await page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Alumno eliminado correctamente');
        await dialog.dismiss();
    });

    await page.getByTestId("remove-button").click();
}

export async function removeStudentAndParent(page: Page, dniStudent: string, dniParent: string) {

    await searchStudentByDni(page, dniStudent.toString());

    await page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Alumno eliminado correctamente');
        await dialog.dismiss();
    });

    await page.getByTestId("remove-button").click();

    await page.waitForTimeout(1000);

    await page.goto('/parent');

    await page.waitForURL('/parent');

    expect(await searchParentByDni(page, dniParent.toString())).toBeTruthy();

    await page.getByTestId("remove-parent").click();
}