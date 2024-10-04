import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchAdminByDni, searchAdminByLastName } from '@/helpersTest/adminHelper';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})


const DNISeeded = '33333333';
const LastNameSeeded = 'Hurtado';





test.describe('Testing listado admin', () => {

    test('Listado admin buscado por DNI (CASO POSITIVO) ', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');

        
        await page.locator('a:has-text("Administradores")').click();
        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});

        await expect(page.getByText('Gabriela Rodríguez HurtadoDNI: 33333333VerEditarBorrar')).toBeVisible();
        await expect(await searchAdminByDni(page, DNISeeded)).toBeTruthy();
        
    });

    test('Listado admin buscado por DNI (CASO NEGATIVO) ', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');

        
        await page.locator('a:has-text("Administradores")').click();
        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});
        await expect(page.getByText('Gabriela Rodríguez HurtadoDNI: 33333333VerEditarBorrar')).toBeVisible();

        await expect(await searchAdminByDni(page, '123456789')).toBeFalsy();
        
    });

    test('Listado admin buscado por Apellido (CASO POSITIVO) ', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');

        
        await page.locator('a:has-text("Administradores")').click();
        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});

        await expect(await searchAdminByLastName(page, LastNameSeeded)).toBeTruthy();
        
    });

    test('Listado admin buscado por Apellido (CASO NEGATIVO) ', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');

        
        await page.locator('a:has-text("Administradores")').click();
        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});

        await expect(await searchAdminByLastName(page, 'asdasdasdasdasd')).toBeFalsy();
        
    });

    




});
