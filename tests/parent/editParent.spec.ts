import { test, expect } from '@playwright/test';
import { searchParentByDni } from '@/helpersTest/parentHelper';
import { createParentWithoutChildren } from '@/helpersTest/parentHelper';

import {loginAsTestUser, randomPhoneNumber} from "../testutils";
import { getTestUser } from "../testdata";
import { faker } from '@faker-js/faker/locale/es_MX';
import { newBirthDate, newBirthDateCustom } from '@/helpersTest/studentHelper';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

const dniDefaultParent = getTestUser('parent').dni.toString();


test('Modificar padre con datos validos', async ({ page }) => {
    await loginAsTestUser(page, 'administrator');
    await page.waitForURL('/');
    const parentDni = await createParentWithoutChildren(page);

    await page.getByTestId("home_button").click();
    await page.waitForURL('/');
    await page.getByRole('link', { name: 'Responsables' }).first().click();

    await expect(page.getByText("Listado de Responsables")).toBeVisible();
    expect(await searchParentByDni(page, parentDni)).toBeTruthy();

    await page.getByTestId('edit-parent').click();
    

    await expect(page.getByText("Editar responsable")).toBeVisible();
    const newPhoneNumber = randomPhoneNumber();
    const newFirstName = faker.person.firstName();
    const newLastName = faker.person.lastName();
    const newAddress = faker.location.streetAddress({ useFullAddress: true });
    const newEmail = faker.internet.email();

    await page.locator('input[id="input-phoneNumber"]').fill(newPhoneNumber);
    await page.locator('input[id="input-firstName"]').fill(newFirstName);
    await page.locator('input[id="input-lastName"]').fill(newLastName);
    await page.locator('input[id="input-address"]').fill(newAddress);
    await page.locator('input[id="input-email"]').fill(newEmail);
    const newDate = await newBirthDateCustom(page, '1990', 'enero', '1');

    page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('El responsable se ha modificado correctamente');
        await dialog.accept();
    });

    await page.getByRole('button', { name: 'Editar' }).last().click();

    await page.waitForEvent('dialog');


    await expect( page.locator('text="Información del Responsable"') ).toBeVisible();

    expect (await page.locator(`text=${newPhoneNumber}`).isVisible()).toBe(true);
    expect (await page.locator(`text=${newFirstName}`).isVisible()).toBe(true);
    expect (await page.locator(`text=${newLastName}`).isVisible()).toBe(true);
    expect (await page.locator(`text=${newAddress}`).isVisible()).toBe(true);
    expect (await page.locator(`text=${newEmail}`).isVisible()).toBe(true);
    
    expect (await page.locator(`text=${newDate}`).isVisible()).toBe(true);

    await page.goto('/parent');

    await page.waitForURL('/parent');

    expect(await searchParentByDni(page, parentDni)).toBeTruthy();

    await page.getByTestId('remove-parent').click();;
});

test('Modificar padre con datos invalidos', async ({ page }) => {
    await loginAsTestUser(page, 'administrator');
    await page.waitForURL('/');
    const parentDni = await createParentWithoutChildren(page);

    await page.getByTestId("home_button").click();
    await page.waitForURL('/');
    await page.getByRole('link', { name: 'Responsables' }).first().click();
    await expect(page.getByText("Listado de Responsables")).toBeVisible();

    expect(await searchParentByDni(page, parentDni)).toBeTruthy();

    await page.getByTestId('edit-parent').click();

    await expect(page.getByText("Editar responsable")).toBeVisible();
    const newPhoneNumber = randomPhoneNumber().toString().replace('+','');
    const newFirstName = faker.person.firstName();
    const newLastName = faker.person.lastName();
    const newAddress = faker.location.streetAddress({ useFullAddress: true });
    const newEmail = faker.internet.email();

    await page.locator('input[id="input-phoneNumber"]').fill('');
    await page.locator('input[id="input-firstName"]').fill("");
    await page.locator('input[id="input-lastName"]').fill("");
    await page.locator('input[id="input-address"]').fill("");
    await page.locator('input[id="input-email"]').fill("");
    const newDate = await newBirthDate(page);

    
    await expect( page.getByRole('button', { name: 'Editar' }).last()).toBeDisabled();
    expect (await page.locator(`text=Ingrese un nombre válido`).isVisible()).toBe(true);
    expect (await page.locator(`text=Ingrese un apellido válido`).isVisible()).toBe(true);
    expect (await page.locator(`text=Ingrese un email válido`).isVisible()).toBe(true);
    expect (await page.locator(`text=Ingrese una dirección válida`).isVisible()).toBe(true);
    expect (await page.locator(`text=El responsable debe ser mayor de 18 años`).isVisible()).toBe(true);

    await page.getByRole('link', { name: 'Responsables' }).first().click();
    await expect(page.getByText("Listado de Responsables")).toBeVisible();

    expect(await searchParentByDni(page, parentDni)).toBeTruthy();

    await page.getByTestId('remove-parent').click();;
});