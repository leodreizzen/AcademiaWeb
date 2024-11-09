import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchAdminByDni } from '@/helpersTest/adminHelper';
import { randomDNI } from '@/helpersTest/studentHelper';
import { faker } from '@faker-js/faker';
import {loginAsTestUser, randomPhoneNumber} from "../testutils";

test.describe('Remove admin', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    })

    test('Eliminar admin, luego no se puede logear ', async ({ page }) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        await page.getByRole('navigation').getByRole('link', { name: 'Administradores' }).click();
        await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });
        
        await page.getByTestId("add-admin-button").click();
        
        const DNI = await randomDNI();
        await page.fill('input[id="input-dni"]', DNI);
        await page.fill('input[id="input-firstName"]', faker.person.firstName());
        await page.fill('input[id="input-lastName"]', faker.person.lastName());
        await page.fill('input[id="input-phoneNumber"]', randomPhoneNumber());
        await page.fill('input[id="input-email"]', faker.internet.email());
        await page.fill('input[id="input-address"]', faker.location.direction());

        page.once('dialog', dialog => {
            expect(dialog.message()).toBe('El admin se ha registrado correctamente');
            dialog.dismiss();
        }
        );

        await page.locator('button[type="submit"]').click();

        await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });




        await expect(page.locator(".test-admin-item").first()).toBeVisible();
        expect(await searchAdminByDni(page, DNI)).toBe(true);


        const menuButton = page.locator('button[aria-haspopup="menu"]');
        await menuButton.click();

        await page.waitForTimeout(300);

        const logoutButton = page.locator('text=Cerrar sesión');
        await logoutButton.click();

        await page.waitForURL('/login');
        await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();

        await login(page, DNI, DNI.toString());

        await page.waitForURL('/');

        await menuButton.click();
        await logoutButton.click();

        await page.waitForURL('/login');
        await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();

        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        await page.getByRole('navigation').getByRole('link', { name: 'Administradores' }).click();;

        await searchAdminByDni(page, DNI);

        page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('¿Esta seguro que quiere eliminar el administrador?');
            await dialog.accept();
        });

        await page.getByTestId("remove-admin-button").click();

        await page.waitForTimeout(300);

        await menuButton.click();

        await page.waitForTimeout(300);

        await logoutButton.click();

        await page.waitForURL('/login');

        await page.fill('input[name="dni"]', DNI);
        await page.fill('input[name="password"]', DNI.toString());
        await page.click('button[type="submit"]');

        await expect(page.locator('body')).toContainText('El usuario no existe');

    });
});