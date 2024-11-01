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
        const subjectWithYear = page.locator(".test-subject-item",{hasText:subjectAndYear});
        await subjectWithYear.locator("button").click();
        const openAccordion = subjectWithYear.locator('div[data-state="open"]');
        await expect(openAccordion).toBeVisible();
        await expect(openAccordion.locator(".test-exam-item").first()).toBeVisible();
    });
 
    test('Coincidencia de fecha de examen con la fecha del listado de alumnos', async ({ page }) => {
        await loginAsTestUser(page, 'parentTeacher');
        await page.waitForTimeout(100);
        
        const firstButton = page.locator('button:has-text("Profesor")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
  
        await page.getByRole('navigation').getByRole('link', { name: 'Notas de exámenes' }).first().click();

        await page.getByRole('navigation').getByRole('link', { name: 'Notas de exámenes' }).first().click();
        const subject = page.locator('.test-subject-item', {hasText: "Matemáticas - 1º año"});
        await expect(subject).toBeVisible();
        const accordionButton = subject.locator('button');
        await expect(accordionButton).toBeVisible();
        await accordionButton.click();
        const openAccordion = subject.locator('div[data-state="open"]');
        await expect(openAccordion).toBeVisible();
        const firstElement = openAccordion.locator('.test-exam-item').first();
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
        const subject = page.locator('.test-subject-item', {hasText: "Historia - 3º año"});
        await expect(subject).toBeVisible();
        const accordionButton = subject.locator('button');
        await expect(accordionButton).toBeVisible();
        await accordionButton.click();
        const openAccordion = subject.locator('div[data-state="open"]');
        await expect(openAccordion).toBeVisible();
        const firstElement = openAccordion.locator('div').first();
        await expect(firstElement).toContainText("No hay exámenes registrados");
    });

});
