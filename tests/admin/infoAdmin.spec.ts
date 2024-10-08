import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchAdminByDni} from '@/helpersTest/adminHelper';

test.beforeEach(async ({page}) => {
    await page.goto('/');
});

const dniDefaultAdmin = '33333333';

test.describe('Testing info admin', () => {

    test('info correspondiente al administrador desde rol administrador', async ({ page })=> {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        const firstButton = await page.locator('button:has-text("Administradores")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
        const result = await searchAdminByDni(page, dniDefaultAdmin);
        expect(result).toBeTruthy();
        const viewButton = page.locator('button:has-text("Ver")');
        await viewButton.click();
        const resultDni = page.locator('div:has-text("DNI")').locator('p.text-lg');
        await expect(resultDni.first()).toHaveText(dniDefaultAdmin);
    });

    test('Verificar detalles del primer admin', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        await page.getByRole('link', { name: 'Administradores' }).first().click();
        await page.waitForTimeout(10000);
      
        const firstPersonSelector = '.flex.flex-col.grow'; 
        const nameSelector = firstPersonSelector + ' h3.font-bold';
        const dniSelector = firstPersonSelector + ' p.text-sm.mt-2';

        const expectedName = (await page.locator(nameSelector).first().textContent()) || 'Nombre no encontrado';
        const expectedDNI = (await page.locator(dniSelector).first().textContent())?.replace('DNI: ', '').trim() || 'DNI no encontrado';
        const viewButton = page.locator('button:has-text(" Ver")').first().click();
        await page.waitForTimeout(1000);
      
        const resultNombre = await page.locator('div:has-text("Nombre") + p.text-lg').first().textContent();
        const resultApellido = await page.locator('div:has-text("Apellido") + p.text-lg').first().textContent();
        const resultDni = await page.locator('div:has-text("DNI") + p.text-lg').first().textContent();

        await expect( resultNombre + ' ' + resultApellido).toBe(expectedName);
        await expect(resultDni).toBe(expectedDNI);
    });
});
  