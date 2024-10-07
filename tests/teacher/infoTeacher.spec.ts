import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { searchTeacherByDni} from '@/helpersTest/teacherHelper';
import { getFirstPersonDetails, getPersonDetails } from '@/helpersTest/infoHelper';

test.beforeEach(async ({page}) => {
    await page.goto('/');
});
  
const dniDefaultTeacher = '22222222';

test.describe('Testing info teacher', () => {

    test('info correspondiente al docente buscado desde rol administrador', async ({ page })=> {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        const firstButton = await page.locator('button:has-text("Docentes")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
        const result = await searchTeacherByDni(page, dniDefaultTeacher);
        expect(result).toBeTruthy();
        const viewButton = page.locator('button:has-text("Ver")');
        await viewButton.click();
        const resultDni = page.locator('div:has(label:text("DNI")) p.text-lg');
        await expect(resultDni.first()).toHaveText(dniDefaultTeacher);
    });

    test('Verificar detalles del primer docente', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');
        await page.getByRole('link', { name: 'Docentes' }).first().click();
        const { name: expectedName, dni: expectedDNI } = await getFirstPersonDetails(page);
        await page.locator('.rounded-xl button:has-text("Ver")').first().click();
        const { fullName: resultFullName, dni: resultDni } = await getPersonDetails(page);
        await expect(resultFullName).toBe(expectedName);
        await expect(resultDni).toBe(expectedDNI);
    });
});