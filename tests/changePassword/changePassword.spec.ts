import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchAdminByDni, searchAdminByLastName } from '@/helpersTest/adminHelper';
import { randomDNI } from '@/helpersTest/studentHelper';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
})

test.describe('Change password', () => {
    test('Cambiar contraseña (CASO VALIDO)', async ({ page }) => {
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

        page.once('dialog', async dialog => {
            await dialog.accept();
        });

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

        page.once('dialog', dialog => {
            expect(dialog.message()).toBe('Contraseña actualizada');
            dialog.dismiss();
        }
        );

        await page.locator('button[type="submit"]').click();

        await page.waitForURL('/');

        await menuButton.click();

        await logoutButton.click();

        await page.waitForURL('/login');

        await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();

        await login(page, DNI, newPassword);

        await page.waitForURL('/');

        await expect(page.getByRole('heading')).toContainText('Bienvenido a AcademiaWeb');

    }
    );

    test('Cambiar contraseña con contraseña actual incorrecta(CASO NEGATIVO)', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        

        const menuButton = page.locator('button[aria-haspopup="menu"]');
        await menuButton.click();
        const changePasswordBtn = page.locator('text=Cambiar contraseña');

        await changePasswordBtn.click();

        await page.waitForURL('/changepassword');

        await page.fill('input[id="input-password"]', 'CasiLePegoALeo');

        const newPassword = 'Contrasena123@';

        await page.fill('input[id="input-newPassword"]', newPassword);

        await page.fill('input[id="input-newPasswordConfirmation"]', newPassword);

        await page.locator('button[type="submit"]').click();

        await expect(page.getByRole('main')).toContainText('Contraseña incorrecta');

        await page.fill('input[id="input-password"]', 'admin');

        const shortPasswordWith12 = 'Contra123@';

        const PasswordWithCapitalLetter = 'Contrasenaaaaaaa';

        const PasswordWithNumber = 'contrasenaaaaaaa123@';

        const PasswordWithoutSpecialCharacter = 'Contrasenaaaaaaa123';




        await page.fill('input[id="input-newPassword"]', shortPasswordWith12);

        await page.fill('input[id="input-newPasswordConfirmation"]', PasswordWithCapitalLetter);

        await page.locator('button[type="submit"]').click();

        await expect(page.getByRole('main')).toContainText('La contraseña debe tener al menos 12 caracteres');

        await expect(page.getByRole('main')).toContainText('La contraseña debe contener al menos un número.');

        await page.fill('input[id="input-newPassword"]', PasswordWithNumber);

        await page.fill('input[id="input-newPasswordConfirmation"]', PasswordWithoutSpecialCharacter);


        await page.locator('button[type="submit"]').click();

        await expect(page.getByRole('main')).toContainText('La contraseña debe contener al menos una letra mayúscula');

        await expect(page.getByRole('main')).toContainText('La contraseña debe contener al menos un carácter especial.');


        await page.fill('input[id="input-newPassword"]', "Contraseña123@");

        await page.fill('input[id="input-newPasswordConfirmation"]', "Contraseña123@@");

        await page.locator('button[type="submit"]').click();

        await expect(page.getByRole('main')).toContainText('Las contraseñas no coinciden');



    }
    );



});

