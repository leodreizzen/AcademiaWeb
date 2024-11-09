import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchAdminByDni, searchAdminByLastName } from '@/helpersTest/adminHelper';
import { randomDNI } from '@/helpersTest/studentHelper';
import { faker } from '@faker-js/faker';
import {loginAsTestUser, randomPhoneNumber} from "../testutils";

test.beforeEach(async ({ page }) => {
    await page.goto('/');
})


    test('Crear nuevo admin (CASO POSITIVO) ', async ({ page }) => {
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

        page.on('dialog', dialog => {
            expect(dialog.message()).toBe('El admin se ha registrado correctamente');
            dialog.dismiss();
        }
        );

        await page.locator('button[type="submit"]').click();

        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});




        await expect(page.locator(".test-admin-item").first()).toBeVisible();
        expect(await searchAdminByDni(page, DNI)).toBe(true);




    });

    test('Crear nuevo admin sin DNI (CASO NEGATIVO) ', async ({ page }) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        await page.getByRole('navigation').getByRole('link', { name: 'Administradores' }).click();
        await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });
        //await page.locator('a:has-text("Nuevo")').click(); deberia de cambiarse cuando se agregue el boton de nuevo
        await page.getByTestId("add-admin-button").click();
        //await page.waitForURL('/admin/new',{waitUntil: 'domcontentloaded'});
        await page.getByLabel('DNI').click({delay: 100});
        await page.getByLabel('DNI').type('',{delay: 1000});
        await page.getByLabel('Apellido').click({delay: 100});
        await page.fill('input[id="input-firstName"]', faker.person.firstName());
        await page.fill('input[id="input-lastName"]', faker.person.lastName());
        await page.fill('input[id="input-phoneNumber"]', randomPhoneNumber());
        await page.fill('input[id="input-email"]', faker.internet.email());
        await page.fill('input[id="input-address"]', faker.location.direction());

        await expect(page.locator('form')).toContainText('Ingrese un dni válido');

        expect(await page.locator('button[type="submit"]').isDisabled()).toBe(true);
        expect
    });

    test('Crear nuevo admin sin nombre (CASO NEGATIVO) ', async ({ page }) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        await page.getByRole('navigation').getByRole('link', { name: 'Administradores' }).click();
        await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });
        //await page.locator('a:has-text("Nuevo")').click(); deberia de cambiarse cuando se agregue el boton de nuevo
        await page.getByTestId("add-admin-button").click();
        //await page.waitForURL('/admin/new',{waitUntil: 'domcontentloaded'});
        const DNI = await randomDNI();
        await page.fill('input[id="input-dni"]', DNI);
        await page.getByLabel('Nombre').click({delay: 100});
        await page.getByLabel('Apellido').click({delay: 1000});
        await page.type('input[id="input-firstName"]', '',{delay: 100});
        await page.fill('input[id="input-lastName"]', faker.person.lastName());
        await page.fill('input[id="input-phoneNumber"]', randomPhoneNumber());
        await page.fill('input[id="input-email"]', faker.internet.email());
        await page.fill('input[id="input-address"]', faker.location.direction());

        await expect(page.locator('form')).toContainText('Ingrese un nombre válido');

        expect(await page.locator('button[type="submit"]').isDisabled()).toBe(true);
    });

    test('Crear nuevo admin sin apellido (CASO NEGATIVO) ', async ({ page }) => {
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
        await page.getByLabel('Apellido').click({delay: 100});
        await page.type('input[id="input-lastName"]', '',{delay: 1000});
        await page.getByLabel('Apellido').click({delay: 100});
        await page.fill('input[id="input-phoneNumber"]', randomPhoneNumber());
        await page.fill('input[id="input-email"]', faker.internet.email());
        await page.fill('input[id="input-address"]', faker.location.direction());

        await expect(page.locator('form')).toContainText('Ingrese un apellido válido');

        expect(await page.locator('button[type="submit"]').isDisabled()).toBe(true);
    });

    test('Crear nuevo admin sin telefono (CASO NEGATIVO) ', async ({ page }) => {
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
        await page.getByLabel('Telefono').click({delay: 100});
        await page.getByLabel('Telefono').type('',{delay: 1000});
        await page.getByLabel('Apellido').click({delay: 100});
        await page.fill('input[id="input-email"]', faker.internet.email());
        await page.fill('input[id="input-address"]', faker.location.direction());

        await expect(page.locator('form')).toContainText('Ingrese un número de teléfono válido');

        expect(await page.locator('button[type="submit"]').isDisabled()).toBe(true);
    });

    test('Crear nuevo admin sin email (CASO NEGATIVO) ', async ({ page }) => {
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
        await page.getByLabel('Correo electrónico').click({delay: 100});
        await page.getByLabel('Correo electrónico').type('',{delay: 1000});
        await page.getByLabel('Apellido').click({delay: 100});
        await page.fill('input[id="input-address"]', faker.location.direction());

        await expect(page.locator('form')).toContainText('Ingrese un email válido');

        expect(await page.locator('button[type="submit"]').isDisabled()).toBe(true);
    });

    test('Crear nuevo admin sin direccion (CASO NEGATIVO) ', async ({ page }) => {
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
        await page.getByText('Direccion').click({delay: 100});
        await page.getByText('Direccion').type('',{delay: 1000});
        await page.getByLabel('Apellido').click({delay: 100});

        await expect(page.locator('form')).toContainText('Ingrese una dirección válida');

        expect(await page.locator('button[type="submit"]').isDisabled()).toBe(true);
    });




