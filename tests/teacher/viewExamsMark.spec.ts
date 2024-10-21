import { expect, test } from "@playwright/test";
import {loginAsTestUser} from "../testutils";
test.beforeEach(async ({page}) => {
    await page.goto('/');
});

const subjectAndYear = "Matemáticas - 1º año"

test.describe('Ver notas de alumnos', () => {

    test('Profesor que tomo un examen, figura examen en la lista', async ({ page }) => {
        await loginAsTestUser(page, 'parentTeacher');
        await page.waitForTimeout(100);
        const firstButton = await page.locator('button:has-text("Profesor")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
        await page.waitForURL('/'); 
        await page.getByRole('navigation').getByRole('link', { name: 'Notas de exámenes' }).first().click();
        await page.waitForTimeout(100);
        const subjectWithYear = await page.locator(`span:has-text("${subjectAndYear}")`);
        await expect(subjectWithYear).toBeVisible();
    });
 
    test('Coincidencia de fecha de examen con la fecha del listado de alumnos', async ({ page }) => {
        await loginAsTestUser(page, 'parentTeacher');
        await page.waitForTimeout(100);
        
        const firstButton = page.locator('button:has-text("Profesor")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
  
        await page.getByRole('navigation').getByRole('link', { name: 'Notas de exámenes' }).first().click();
        await page.waitForTimeout(1000);
        const firstAccordionButton = page.locator('h3[data-orientation="vertical"] > button').first();
        await expect(firstAccordionButton).toBeVisible();
        await firstAccordionButton.click();
        const firstOpenAccordion = page.locator('div[data-orientation="vertical"] > div[data-state="open"]').first();
        await expect(firstOpenAccordion).toBeVisible();
        const firstElement = firstOpenAccordion.locator('div.space-y-2 > div').first();
        await expect(firstElement).toBeVisible(); 
        const examDateBefore = await firstElement.locator('span').innerText(); 
        const verNotasButton = firstElement.locator('button:has-text("Ver Notas")');
        await expect(verNotasButton).toBeVisible(); 
        await verNotasButton.click();
        const modal = page.locator('div[role="dialog"]');
        await expect(modal).toBeVisible(); 
        const examDateAfter = await modal.locator('h2').nth(1).innerText(); 

        expect(examDateAfter).toBe(examDateBefore);
    });

    test('Profesor sin examenes tomados, no figura nada en la lista', async ({ page }) => {

        await loginAsTestUser(page, 'parentTeacherAdmin');
        await page.waitForTimeout(100);
        
        const firstButton = page.locator('button:has-text("Profesor")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
        await page.getByRole('navigation').getByRole('link', { name: 'Notas de exámenes' }).first().click();
        await page.waitForTimeout(1000);
        await expect(page.locator('text=No hay notas de materias registradas')).toBeVisible();
    });

});
