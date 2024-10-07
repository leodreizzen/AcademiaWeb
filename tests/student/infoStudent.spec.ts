import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchStudentByDni } from '@/helpersTest/studentHelper';
import { getFirstPersonDetails, getPersonDetails } from '@/helpersTest/infoHelper';

test.beforeEach(async ({page}) => {
    await page.goto('/');
});

const dniDefaultStudent = '11111111';

test.describe('Testing info alumno', () => {

    test('info correspondiente a un alumno desde rol administrador', async ({ page })=> {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        await page.getByRole('link', { name: 'Alumnos' }).first().click();
        const result = await searchStudentByDni(page, dniDefaultStudent);
        expect(result).toBeTruthy();

        const viewButton = page.locator('button:has-text("Ver")');
        await viewButton.click();
    
        await page.waitForSelector('div:has-text("DNI")');
        const resultDni = page.locator('div:has-text("DNI")').locator('p.text-lg');
        await expect(resultDni.first()).toHaveText(dniDefaultStudent);
    });

    test('Verificar detalles del primer alumno', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        await page.getByRole('link', { name: 'Alumnos' }).first().click();
        await page.waitForTimeout(1000);

        const { name: expectedName, dni: expectedDNI } = await getFirstPersonDetails(page);
        await page.locator('.rounded-xl button:has-text("Ver")').first().click();
        const { fullName: resultFullName, dni: resultDni } = await getPersonDetails(page);
        await expect(resultFullName).toBe(expectedName);
        await expect(resultDni).toBe(expectedDNI);
    });
});