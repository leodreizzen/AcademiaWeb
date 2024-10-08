import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchAdminByDni, searchAdminByLastName } from '@/helpersTest/adminHelper';
import {getTestUser} from "../testdata";
import {loginAsTestUser} from "../testutils";

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})


const admin = getTestUser('administrator');
const DNISeeded = admin.dni.toString();
const LastNameSeeded = admin.lastName;





test.describe('Testing listado admin', () => {

    test('Listado admin buscado por DNI (CASO POSITIVO)', async ({ page }) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');

        
        await page.getByRole('navigation').getByRole('link', { name: 'Administradores' }).click();
        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});

        await expect(page.locator(".test-admin-item").first()).toBeVisible();
        await expect(await searchAdminByDni(page, DNISeeded)).toBeTruthy();
        
    });

    test('Listado admin buscado por DNI (CASO NEGATIVO) ', async ({ page }) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');

        
        await page.getByRole('navigation').getByRole('link', { name: 'Administradores' }).click();
        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});
        await expect(page.locator(".test-admin-item").first()).toBeVisible();

        await expect(await searchAdminByDni(page, '123456789')).toBeFalsy();
        
    });

    test('Listado admin buscado por Apellido (CASO POSITIVO) ', async ({ page }) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');

        await page.getByRole('navigation').getByRole('link', { name: 'Administradores' }).click();
        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});

        await expect(await searchAdminByLastName(page, LastNameSeeded)).toBeTruthy();
        
    });

    test('Listado admin buscado por Apellido (CASO NEGATIVO) ', async ({ page }) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');

        
        await page.getByRole('navigation').getByRole('link', { name: 'Administradores' }).click();
        await page.waitForURL('/admin',{waitUntil: 'domcontentloaded'});

        await expect(await searchAdminByLastName(page, 'asdasdasdasdasd')).toBeFalsy();
        
    });

    




});
