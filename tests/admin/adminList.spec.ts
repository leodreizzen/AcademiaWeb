import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchAdminByDni, searchAdminByLastName } from '@/helpersTest/adminHelper';
import {getTestUser} from "../testdata";

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})


const adminToSearch = getTestUser("administrator")


test.describe('Testing listado admin', () => {

    test('Listado admin buscado por DNI (CASO POSITIVO) ', async ({ page }) => {
        await login(page, adminToSearch.dni.toString(), adminToSearch.password);
        await page.waitForURL('/');

        
        await page.locator('a:has-text("Administradores")').click();
        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});

        await expect(page.getByText(`${adminToSearch.firstName} ${adminToSearch.lastName}DNI: ${adminToSearch.dni.toString()}VerEditarBorrar`)).toBeVisible();
        await expect(await searchAdminByDni(page, adminToSearch.dni.toString())).toBeTruthy();
        
    });

    test('Listado admin buscado por DNI (CASO NEGATIVO) ', async ({ page }) => {
        await login(page, adminToSearch.dni.toString(), adminToSearch.password);
        await page.waitForURL('/');

        
        await page.locator('a:has-text("Administradores")').click();
        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});
        await expect(page.getByText(`${adminToSearch.firstName} ${adminToSearch.lastName}DNI: ${adminToSearch.dni.toString()}VerEditarBorrar`)).toBeVisible();
        await expect(await searchAdminByDni(page, '1234567890')).toBeFalsy();
        
    });

    test('Listado admin buscado por Apellido (CASO POSITIVO) ', async ({ page }) => {
        await login(page, adminToSearch.dni.toString(), adminToSearch.password);
        await page.waitForURL('/');

        
        await page.locator('a:has-text("Administradores")').click();
        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});

        await expect(await searchAdminByLastName(page, adminToSearch.lastName)).toBeTruthy();
        
    });

    test('Listado admin buscado por Apellido (CASO NEGATIVO) ', async ({ page }) => {
        await login(page, adminToSearch.dni.toString(), adminToSearch.password);
        await page.waitForURL('/');

        
        await page.locator('a:has-text("Administradores")').click();
        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});

        await expect(await searchAdminByLastName(page, 'asdasdasdasdasd')).toBeFalsy();
        
    });

    




});
