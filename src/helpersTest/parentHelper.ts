import { Page, expect } from "@playwright/test";
import {  faker } from "@faker-js/faker/locale/es";
import { newBirthDate, randomDNI } from "./studentHelper";
import exp from "constants";



export async function searchParentByDni(page: Page, Dni: string) {
    await page.getByPlaceholder('DNI').click();
    await page.getByPlaceholder('DNI').fill(Dni);
    await page.click('svg.lucide-search');

    const expectedUrlPattern = new RegExp(`/parent\\?dni=${Dni}&lastName=`);
    await page.waitForURL(expectedUrlPattern,{waitUntil: 'domcontentloaded'});

    const bool = page.isVisible(`text=${'Dni: ' + Dni}`,{timeout:1000}).then((value) => {
        return value;
    });

    return bool;

}

export async function searchParentByLastName(page: Page, LastName: string) {
    await page.getByPlaceholder('Apellido').click();
    await page.getByPlaceholder('Apellido').fill(LastName);
    await page.click('svg.lucide-search');

    const expectedUrlPattern = new RegExp(`/parent\\?dni=&lastName=${LastName}`);
    await page.waitForURL(expectedUrlPattern,{waitUntil: 'domcontentloaded'});



    const bool = page.isVisible(`p:has-text("${LastName}")`,{timeout:1000}).then((value) => {
        return value;
    });
    return bool;
}


export async function createParentWithoutChildren(page: Page) {
    await page.goto('/student/add');

    const dni = await randomDNI();
    const parentDni = await randomDNI();

    await page.locator('input[id="input-dni"]').fill(dni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());
    await newBirthDate(page);
    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    await page.locator('input[id="input-dni"]').fill(parentDni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').last().fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDateOverEighteen(page);

    await page.getByRole('button', { name: 'Agregar' }).click();

    console.log("Parent created with DNI: " + parentDni);
    return parentDni;
}

export async function createChildrenWithTwoParents(page: Page) {
    await page.waitForURL('/')
    await page.goto('/student/add');

    const dni = await randomDNI();
    const parentDni = await randomDNI();

    await page.locator('input[id="input-dni"]').fill(dni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());
    await newBirthDate(page);

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    await page.locator('input[id="input-dni"]').fill(parentDni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').last().fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDateOverEighteen(page);
    await page.getByRole('button', { name: 'Agregar' }).click();

    await page.waitForTimeout(2000);

    await page.getByPlaceholder('Buscar por DNI').click();
    await page.getByPlaceholder('Buscar por DNI').fill(parentDni);
    
    await page.locator('div:nth-child(2) > .inline-flex').first().click();

    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Seleccionar' }).click();

   

    
    
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });

    await page.getByRole('button', { name: 'Registrar' }).click();


    

    await expect(page).toHaveURL('/student');
    expect(await page.locator('text="Nuevo Alumno"')).toBeVisible();
    return parentDni;
}

export async function createParentWithOnlyOneChild(page: Page) {
    await page.goto('/student/add');

    const dni = await randomDNI();

    await page.locator('input[id="input-dni"]').fill(dni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());
    await newBirthDate(page);

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    const parentDni = await randomDNI();

    await page.locator('input[id="input-dni"]').fill(parentDni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').last().fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDateOverEighteen(page);

    await page.getByRole('button', { name: 'Agregar' }).click();

    await page.waitForTimeout(2000);

    await page.getByPlaceholder('Buscar por DNI').click();
    await page.getByPlaceholder('Buscar por DNI').fill(parentDni);
    
    await page.locator('div:nth-child(2) > .inline-flex').first().click();

    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Seleccionar' }).click();

   

    
    
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });

    await page.getByRole('button', { name: 'Registrar' }).click();

    await expect(page).toHaveURL('/student');
    await expect(page.locator('text="Nuevo Alumno"')).toBeVisible();

    return parentDni;
}


function randomYearOverEighteen() {
    const MAX = 2005
    const MIN = 1980
    return (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString()
}

function randomDay() {
    const MAX = 28
    const MIN = 1
    return (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString()
}

export async function newBirthDateOverEighteen(page: Page) {
    const year = randomYearOverEighteen();
    const month = faker.date.month({context:true}).toString();
    const day = randomDay();

    await page.waitForTimeout(500);
    await page.locator('#dob').click();
    await page.waitForTimeout(500);
    
    while (await page.getByRole('dialog').nth(1).isVisible() === false) {
        await page.locator('#dob').click();
        await page.waitForTimeout(500);
    }


    await page.getByRole('dialog').nth(1).focus();
    await page.waitForTimeout(1000);

    while (await page.isVisible(`text=${month}`) === false) {
        await page.getByTestId('ArrowLeftIcon').click();
    }

    await page.getByTestId('ArrowDropDownIcon').click();
    await page.getByRole('radio', { exact:true, name: year }).click();
    await page.getByRole('gridcell', { exact: true, name: day }).click();


}