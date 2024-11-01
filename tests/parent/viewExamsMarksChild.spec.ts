import { expect, test } from "@playwright/test";
import {loginAsTestUser} from "../testutils";
import {getTestUser} from "../testdata";
test.beforeEach(async ({page}) => {
    await page.goto('/');
});


const child = getTestUser("secondStudent") ;
const subjectWithExams = "Química";
const subjectWithoutExams = "Computación";
test.describe('Ver notas de hijos', () => {

    test('Seleccionar hijo con notas.', async ({ page }) => {
        await loginAsTestUser(page, 'secondParent');
        await page.locator(`button:has-text("${child.firstName} ${child.lastName}")`).click();
        await page.waitForURL('/'); 
        await page.getByRole('navigation').getByRole('link', { name: 'Notas de exámenes' }).first().click();
     
        const firstElement = await page.locator('div.space-y-4 > div', {hasText: subjectWithExams});
        const verNotasButton = firstElement.locator('button');
        await verNotasButton.click();
      
        const modal = await page.locator('div[role="dialog"]');
        await expect(modal).toBeVisible();
        const subjectNameAfter = await modal.locator('h2').innerText();
        expect(subjectNameAfter).toContain(subjectWithExams);
        await expect (modal.locator('text=Exámen del día').first()).toBeVisible();
    });

    test('Seleccionar hijo sin notas.', async ({ page }) => {
        await loginAsTestUser(page, 'secondParent');
        await page.locator(`button:has-text("${child.firstName} ${child.lastName}")`).click();
        await page.waitForURL('/'); 
        await page.getByRole('navigation').getByRole('link', { name: 'Notas de exámenes' }).first().click();
        await page.waitForTimeout(100);

        const firstElement = await page.locator('div.space-y-4 > div', {hasText: subjectWithoutExams});
        const verNotasButton = firstElement.locator('button');
        await verNotasButton.click();
        await expect(page.locator('text=No hay exámenes registrados')).toBeVisible();
    });

});
