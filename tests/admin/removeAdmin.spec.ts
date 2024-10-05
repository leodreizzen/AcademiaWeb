import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchAdminByDni } from '@/helpersTest/adminHelper';
import { randomDNI } from '@/helpersTest/studentHelper';
import { faker } from '@faker-js/faker';

test.describe('Remove admin', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    })

    test('Eliminar admin, luego no se puede logear ', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        await page.locator('a:has-text("Administradores")').click();
        await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });
        //await page.locator('a:has-text("Nuevo")').click(); deberia de cambiarse cuando se agregue el boton de nuevo
        await page.locator('button:has-text("Agregar administrador")').click();
        //await page.waitForURL('/admin/new',{waitUntil: 'domcontentloaded'});
        const DNI = await randomDNI();
        await page.fill('input[id="input-dni"]', DNI);
        await page.fill('input[id="input-firstName"]', faker.person.firstName());
        await page.fill('input[id="input-lastName"]', faker.person.lastName());
        await page.fill('input[id="input-phoneNumber"]', faker.phone.number({ style: 'international' }));
        await page.fill('input[id="input-email"]', faker.internet.email());
        await page.fill('input[id="input-address"]', faker.location.direction());

        page.on('dialog', dialog => {
            expect(dialog.message()).toBe('El admin se ha registrado correctamente');
            dialog.dismiss();
        }
        );

        await page.locator('button[type="submit"]').click();

        await page.waitForURL('/admin', { waitUntil: 'domcontentloaded' });




        await expect(page.getByText('Gabriela Rodríguez HurtadoDNI: 33333333VerEditarBorrar')).toBeVisible();
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

        console.log('Admin nuevo logeado correctamente');
        await menuButton.click();
        await logoutButton.click();

        await page.waitForURL('/login');
        await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();

        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        await page.locator('a:has-text("Administradores")').click();

        await searchAdminByDni(page, DNI);
        await page.locator('button:has-text("Borrar")').click();

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