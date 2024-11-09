
import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchAdminByDni, searchAdminByLastName } from '@/helpersTest/adminHelper';
import { randomDNI } from '@/helpersTest/studentHelper';
import { faker } from '@faker-js/faker';
import {loginAsTestUser, randomPhoneNumber} from "../testutils";
import { text } from 'stream/consumers';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
})


test('Modificar admin nombre (CASO POSITIVO) ', async ({ page }) => {
    await loginAsTestUser(page, 'administrator');
    await page.waitForURL('/');
    await page.getByRole('navigation').getByRole('link', { name: 'Administradores' }).click();
    await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });
    //await page.locator('a:has-text("Nuevo")').click(); deberia de cambiarse cuando se agregue el boton de nuevo
    await page.getByTestId("add-admin-button").click();
    //await page.waitForURL('/admin/new',{waitUntil: 'domcontentloaded'});
    const DNI = await randomDNI();
    await page.fill('input[id="input-dni"]', DNI);
    await page.fill('input[id="input-firstName"]', faker.person.firstName());
    await page.fill('input[id="input-lastName"]', faker.person.lastName());
    await page.fill('input[id="input-phoneNumber"]', randomPhoneNumber());
    await page.fill('input[id="input-email"]', faker.internet.email());
    await page.fill('input[id="input-address"]', faker.location.direction());

    page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('El admin se ha registrado correctamente');
        dialog.dismiss();
    }
    );

    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });

    await expect(page.locator(".test-admin-item").first()).toBeVisible();
    expect(await searchAdminByDni(page, DNI)).toBe(true);

    await searchAdminByDni(page, DNI);

    await page.locator(".test-admin-item", {hasText: DNI}).first().waitFor();

    await page.getByTestId("edit-admin-button").click();


    const newName = faker.person.firstName();

    await page.fill('input[id="input-firstName"]', newName);

    page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('El admin se ha guardado correctamente');
        dialog.dismiss();
    }
    );

    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });

    await page.locator(".test-admin-item").first().waitFor();

    await searchAdminByDni(page, DNI);

    await page.locator(".test-admin-item", {hasText: DNI}).first().waitFor();

    await page.getByTestId("view-admin-button").click();

    await page.getByText("Información del Administrador").waitFor();

    await expect(page.getByText(newName)).toBeVisible();

    await page.goBack();

    await page.waitForTimeout(1000);

    await searchAdminByDni(page, DNI);

    page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('¿Esta seguro que quiere eliminar el administrador?');
        await dialog.accept();
    });

    await page.getByTestId("remove-admin-button").click();


});

test('Modificar admin todos los campos menos DNI (CASO POSITIVO) ', async ({ page }) => {
    await loginAsTestUser(page, 'administrator');
    await page.waitForURL('/');
    await page.getByRole('navigation').getByRole('link', { name: 'Administradores' }).click();
    await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });
    //await page.locator('a:has-text("Nuevo")').click(); deberia de cambiarse cuando se agregue el boton de nuevo
    await page.getByTestId("add-admin-button").click();
    //await page.waitForURL('/admin/new',{waitUntil: 'domcontentloaded'});
    const DNI = await randomDNI();
    await page.fill('input[id="input-dni"]', DNI);
    await page.fill('input[id="input-firstName"]', faker.person.firstName());
    await page.fill('input[id="input-lastName"]', faker.person.lastName());
    await page.fill('input[id="input-phoneNumber"]', randomPhoneNumber());
    await page.fill('input[id="input-email"]', faker.internet.email());
    await page.fill('input[id="input-address"]', faker.location.direction());

    page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('El admin se ha registrado correctamente');
        dialog.dismiss();
    }
    );

    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });

    await expect(page.locator(".test-admin-item").first()).toBeVisible();
    expect(await searchAdminByDni(page, DNI)).toBe(true);

    await searchAdminByDni(page, DNI);

    await page.locator(".test-admin-item", {hasText: DNI}).first().waitFor();

    await page.getByTestId("edit-admin-button").click();

    const newName = faker.person.firstName();
    const newLastName = faker.person.lastName();
    const newPhoneNumber = randomPhoneNumber();
    const newEmail = faker.internet.email();
    const newAddress = faker.location.direction();

    await page.fill('input[id="input-firstName"]', newName);
    await page.fill('input[id="input-lastName"]', newLastName);
    await page.fill('input[id="input-phoneNumber"]', newPhoneNumber);
    await page.fill('input[id="input-email"]', newEmail);
    await page.fill('input[id="input-address"]', newAddress);

    page.once('dialog',async dialog => {
        expect(dialog.message()).toBe('El admin se ha guardado correctamente');
        await dialog.dismiss();
    }
    );

    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });

    await expect(page.locator(".test-admin-item").first()).toBeVisible();

    await searchAdminByDni(page, DNI);

    await page.locator(".test-admin-item", {hasText: DNI}).first().waitFor();

    await page.getByTestId("view-admin-button").click();

    await page.getByText("Información del Administrador").waitFor();

    await expect(page.getByText(newName)).toBeVisible();
    await expect(page.getByText(newLastName)).toBeVisible();
    await expect(page.getByText(newPhoneNumber.replace("+", ''))).toBeVisible();
    await expect(page.getByText(newEmail)).toBeVisible();
    await expect(page.getByText(newAddress)).toBeVisible();

    await page.goBack();

    await page.waitForTimeout(1000);

    await searchAdminByDni(page, DNI);

    page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('¿Esta seguro que quiere eliminar el administrador?');
        await dialog.accept();
    });

    await page.getByTestId("remove-admin-button").click();


});

test('Modificar admin todos los campos menos DNI, todos los campos en nulo (CASO NEGATIVO) ', async ({ page }) => {
    await loginAsTestUser(page, 'administrator');
    await page.waitForURL('/');
    await page.getByRole('navigation').getByRole('link', { name: 'Administradores' }).click();
    await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });
    //await page.locator('a:has-text("Nuevo")').click(); deberia de cambiarse cuando se agregue el boton de nuevo
    await page.getByTestId("add-admin-button").click();
    //await page.waitForURL('/admin/new',{waitUntil: 'domcontentloaded'});
    const DNI = await randomDNI();
    await page.fill('input[id="input-dni"]', DNI);
    await page.fill('input[id="input-firstName"]', faker.person.firstName());
    await page.fill('input[id="input-lastName"]', faker.person.lastName());
    await page.fill('input[id="input-phoneNumber"]', randomPhoneNumber());
    await page.fill('input[id="input-email"]', faker.internet.email());
    await page.fill('input[id="input-address"]', faker.location.direction());

    page.once('dialog',async dialog => {
        expect(dialog.message()).toBe('El admin se ha registrado correctamente');
        await dialog.dismiss();
    }
    );

    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });

    await expect(page.locator(".test-admin-item").first()).toBeVisible();
    expect(await searchAdminByDni(page, DNI)).toBe(true);

    await searchAdminByDni(page, DNI);

    await page.locator(".test-admin-item", {hasText: DNI}).first().waitFor();

    await page.getByTestId("edit-admin-button").click();


    await page.fill('input[id="input-firstName"]', '');
    await page.fill('input[id="input-lastName"]', '');
    await page.fill('input[id="input-phoneNumber"]', '');
    await page.fill('input[id="input-email"]', '');
    await page.fill('input[id="input-address"]', '');



    await expect( page.locator('button[type="submit"]') ).toBeDisabled();


    await expect(page.locator('#input-dni')).toBeDisabled();

    await expect(page.getByText('Ingrese un nombre válido')).toBeVisible();
    await expect(page.getByText('Ingrese un número de teléfono válido')).toBeVisible();
    await expect(page.getByText('Ingrese un apellido válido')).toBeVisible();
    await expect(page.getByText('Ingrese un email válido')).toBeVisible();
    await expect(page.getByText('Ingrese una dirección válida')).toBeVisible();

    await page.goBack();
    
    await page.waitForTimeout(1000);

    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('¿Esta seguro que quiere eliminar el administrador?');
        await dialog.accept();
    });

    await searchAdminByDni(page, DNI);

    await page.getByTestId("remove-admin-button").click();


});








