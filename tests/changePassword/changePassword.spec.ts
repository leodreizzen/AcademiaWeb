import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchAdminByDni, searchAdminByLastName } from '@/helpersTest/adminHelper';
import { randomDNI } from '@/helpersTest/studentHelper';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
})

test.describe('Change password', () => {
    test('Change password with correct data', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        await page.getByRole('navigation').getByRole('link', { name: 'Administradores' }).click();
        await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });
        //await page.locator('a:has-text("Nuevo")').click(); deberia de cambiarse cuando se agregue el boton de nuevo
        await page.getByRole('button', { name: 'Nuevo administrador' }).click();
        //await page.waitForURL('/admin/new',{waitUntil: 'domcontentloaded'});
        const DNI = await randomDNI();
        await page.fill('input[id="input-dni"]', DNI);
        await page.fill('input[id="input-firstName"]', faker.person.firstName());
        await page.fill('input[id="input-lastName"]', faker.person.lastName());
        await page.fill('input[id="input-phoneNumber"]', faker.phone.number({ style: 'international' }));
        await page.fill('input[id="input-email"]', faker.internet.email());
        await page.fill('input[id="input-address"]', faker.location.direction());

        page.on('dialog', dialog => {
            dialog.dismiss();
        }
        );

        await page.locator('button[type="submit"]').click();

        await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });


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
        const changePasswordBtn = page.locator('text=Cambiar contraseña');

        await changePasswordBtn.click();

        await page.waitForURL('/changepassword');

        await page.fill('input[id="input-password"]', DNI.toString());

        const newPassword = 'Contrasena123@';

        await page.fill('input[id="input-newPassword"]', newPassword);

        await page.fill('input[id="input-newPasswordConfirmation"]', newPassword);

        page.on('dialog', dialog => {
            expect(dialog.message()).toBe('Contraseña actualizada');
            dialog.dismiss();
        }
        );

        await page.locator('button[type="submit"]').click();

        await menuButton.click();

        await logoutButton.click();

        await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();

        await login(page, DNI, newPassword);

        await page.waitForURL('/');

        expect (await page.locator('h3:has-text("Bienvenido a AcademiaWeb")')).toBeVisible();

    }
    );

});

