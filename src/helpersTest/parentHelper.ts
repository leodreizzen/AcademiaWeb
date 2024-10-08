import { Page, expect } from "@playwright/test";
import {faker} from '@faker-js/faker';
import { randomDNI } from "./studentHelper";

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
    await page.goto('http://localhost:3000/student/add');

    var dni = await randomDNI();
    var parentDni = await randomDNI();

    await page.locator('input[id="input-dni"]').fill(dni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    await page.locator('input[id="input-dni"]').fill(parentDni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-name"]').fill(faker.person.firstName());
    await page.locator('input[id="input-surname"]').last().fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());

    await page.getByRole('button', { name: 'Agregar' }).click();

    console.log("Parent created with DNI: " + parentDni);
    return parentDni;
}

export async function createChildrenWithTwoParents(page: Page) {
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    var dni = await randomDNI();
    var parentDni = await randomDNI();

    await page.locator('input[id="input-dni"]').fill(dni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    await page.locator('input[id="input-dni"]').fill(parentDni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-name"]').fill(faker.person.firstName());
    await page.locator('input[id="input-surname"]').last().fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());

    await page.getByRole('button', { name: 'Agregar' }).click();

    await page.waitForTimeout(2000);

    searchParentByDni(page, parentDni);


    await page.getByRole('button', { name: 'Seleccionar' }).last().click(); //como el creado es el ultimo, selecciono este para asignarle al alumno



    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('http://localhost:3000/student');
    expect(await page.locator('text="Nuevo Alumno"')).toBeVisible();
    return parentDni;
}

export async function createParentWithOnlyOneChild(page: Page) {
    await page.goto('http://localhost:3000/student/add');

    var dni = await randomDNI();

    await page.locator('input[id="input-dni"]').fill(dni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    var parentDni = await randomDNI();

    await page.locator('input[id="input-dni"]').fill(parentDni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-name"]').fill(faker.person.firstName());
    await page.locator('input[id="input-surname"]').last().fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());

    await page.getByRole('button', { name: 'Agregar' }).click();

    await page.waitForTimeout(2000);

    searchParentByDni(page, parentDni);

    await page.getByRole('button', { name: 'Seleccionar' }).last().click(); //como el creado es el ultimo, selecciono este para asignarle al alumno



    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('http://localhost:3000/student');
    expect(await page.locator('text="Nuevo Alumno"')).toBeVisible();

    return parentDni;
}
