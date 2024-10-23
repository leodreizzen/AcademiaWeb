import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchAdminByDni} from '@/helpersTest/adminHelper';
import {loginAsTestUser} from "../testutils";
import {getTestUser} from "../testdata";

test.beforeEach(async ({page}) => {
    await page.goto('/');
});

const dniDefaultAdmin = getTestUser('administrator').dni.toString();

test.describe('Testing info admin', () => {

    test('info correspondiente al administrador desde rol administrador', async ({ page })=> {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        const firstButton = await page.locator('button:has-text("Administradores")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
        const result = await searchAdminByDni(page, dniDefaultAdmin);
        expect(result).toBeTruthy();
        const viewButton = await page.getByTestId("view-admin-button");
        await viewButton.click();
        const resultDni = page.locator('div:has-text("DNI")').locator('p.text-lg');
        await expect(resultDni.first()).toHaveText(dniDefaultAdmin);
    });

    test('Verificar detalles del primer admin', async ({ page }) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        await page.getByRole('link', { name: 'Administradores' }).first().click();
        await page.waitForTimeout(10000);
      
        const firstPersonSelector = '.flex.flex-col.grow'; 
        const nameSelector = firstPersonSelector + ' h3.font-bold';
        const dniSelector = firstPersonSelector + ' p.text-sm.mt-2';

        const expectedName = (await page.locator(nameSelector).first().textContent()) || 'Nombre no encontrado';
        const expectedDNI = (await page.locator(dniSelector).first().textContent())?.replace('DNI: ', '').trim() || 'DNI no encontrado';
        const viewButton = page.getByTestId("view-admin-button").first().click();
        await page.waitForTimeout(1000);
      
        const resultNombre = await page.locator('div:has-text("Nombre") + p.text-lg').first().textContent();
        const resultApellido = await page.locator('div:has-text("Apellido") + p.text-lg').first().textContent();
        const resultDni = await page.locator('div:has-text("DNI") + p.text-lg').first().textContent();

        await expect( resultNombre + ' ' + resultApellido).toBe(expectedName);
        await expect(resultDni).toBe(expectedDNI);
    });
});
  