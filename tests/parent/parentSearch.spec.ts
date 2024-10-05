import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchParentByDni, searchParentByLastName } from '@/helpersTest/parentHelper';
import {getTestUser} from "../testdata";


test.beforeEach(async ({ page }) => {
    await page.goto('/');
}
);

const parentToSearch = getTestUser("parent")
const admin = getTestUser("administrator")


test.describe('Testing listado parent', () => {
    

    test('Listado parent buscado por DNI (CASO POSITIVO) ', async ({ page }) => {
            await login(page, admin.dni.toString(), admin.password);
        await page.waitForURL('/');
        await page.locator('a:has-text("Padres")').click();
        await page.waitForURL('/parent',{waitUntil: 'domcontentloaded'});
        await expect(await searchParentByDni(page, parentToSearch.dni.toString())).toBeTruthy();
    }
    );

    test('Listado parent buscado por DNI (CASO NEGATIVO) ', async ({ page }) => {
            await login(page, admin.dni.toString(), admin.password);
        await page.waitForURL('/');
        await page.locator('a:has-text("Padres")').click();
        await page.waitForURL('/parent',{waitUntil: 'domcontentloaded'});
        await expect(await searchParentByDni(page, '1234567890')).toBeFalsy();
    }
    );

    test('Listado parent buscado por Apellido (CASO POSITIVO) ', async ({ page }) => {
            await login(page, admin.dni.toString(), admin.password);
        await page.waitForURL('/');
        await page.locator('a:has-text("Padres")').click();
        await expect(await searchParentByLastName(page, parentToSearch.lastName)).toBeTruthy();
    }
    );

    test('Listado parent buscado por Apellido (CASO NEGATIVO) ', async ({ page }) => {
            await login(page, admin.dni.toString(), admin.password);
        await page.waitForURL('/');
        await page.locator('a:has-text("Padres")').click();
        await expect(await searchParentByLastName(page, 'asdasdasdasdasdasd')).toBeFalsy();
    }
    );

});