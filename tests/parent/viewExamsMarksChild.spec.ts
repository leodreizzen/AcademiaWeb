import { expect, test } from "@playwright/test";
import {loginAsTestUser} from "../testutils";
test.beforeEach(async ({page}) => {
    await page.goto('/');
});


const childWithExams = "Axel Berge" ;
const childWithoutExams = "Toy Maggio";
test.describe('Ver notas de hijos', () => {

    test('Seleccionar hijo con notas.', async ({ page }) => {
        await loginAsTestUser(page, 'secondParent');
        await page.locator(`button:has-text("${childWithExams}")`).click();
        await page.waitForURL('/'); 
        await page.getByRole('navigation').getByRole('link', { name: 'Notas de exámenes' }).first().click();
     
        const firstElement = await page.locator('div.space-y-4 > div').first();
        const subjectNameBefore = await firstElement.locator('h2').innerText();
        const verNotasButton = firstElement.locator('button');
        await verNotasButton.click();
      
        const modal = await page.locator('div[role="dialog"]');
        await expect(modal).toBeVisible();
        const subjectNameAfter = await modal.locator('h2').innerText();
        expect(subjectNameAfter).toContain(subjectNameBefore);
    });

    test('Seleccionar hijo sin notas.', async ({ page }) => {
        await loginAsTestUser(page, 'secondParent');
        await page.locator(`button:has-text("${childWithoutExams}")`).click();
        await page.waitForURL('/'); 
        await page.getByRole('navigation').getByRole('link', { name: 'Notas de exámenes' }).first().click();
        await page.waitForTimeout(100);

        const firstElement = await page.locator('div.space-y-4 > div').first();
        const verNotasButton = firstElement.locator('button');
        await verNotasButton.click();
        await expect(page.locator('text=No hay exámenes registrados')).toBeVisible();
    });

});
