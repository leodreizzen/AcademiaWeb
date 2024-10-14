import { Page } from '@playwright/test';

export async function loginAsRole(page: Page, dni: string, password: string, role: string, studentName?:string) {
    await page.fill('input[name="dni"]', dni);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
 
    await page.click(`text=${role}`);

    if (studentName){
        const firstStudentButton = await page.locator('.space-y-3 button', {hasText: studentName}).first();
        await firstStudentButton.click();
    }
    await page.waitForURL('/');
}