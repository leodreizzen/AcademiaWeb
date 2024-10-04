import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchParentByDni, searchParentByLastName } from '@/helpersTest/parentHelper';


test.beforeEach(async ({ page }) => {
    await page.goto('/');
}
);

const DNISeeded = '44444444';
const LastNameSeeded = 'Rosario';
const FullNameSeeded = 'Ester Ávalos Rosario';




test.describe('Testing listado parent', () => {
    

    test('Listado parent buscado por DNI (CASO POSITIVO) ', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        await page.locator('a:has-text("Padres")').click();
        await page.waitForURL('/parent',{waitUntil: 'domcontentloaded'});
        await expect(await searchParentByDni(page, DNISeeded)).toBeTruthy();
    }
    );

    test('Listado parent buscado por DNI (CASO NEGATIVO) ', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        await page.locator('a:has-text("Padres")').click();
        await page.waitForURL('/parent',{waitUntil: 'domcontentloaded'});
        await expect(await searchParentByDni(page, '123456789')).toBeFalsy();
    }
    );

    test('Listado parent buscado por Apellido (CASO POSITIVO) ', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        await page.locator('a:has-text("Padres")').click();
        await expect(await searchParentByLastName(page, LastNameSeeded)).toBeTruthy();
    }
    );

    test('Listado parent buscado por Apellido (CASO NEGATIVO) ', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        await page.locator('a:has-text("Padres")').click();
        await expect(await searchParentByLastName(page, 'asdasdasdasdasdasd')).toBeFalsy();
    }
    );

});