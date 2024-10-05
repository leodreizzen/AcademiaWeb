import { Page } from '@playwright/test';

export async function loginAsRole(page: Page, dni: string, password: string, role: string) {
    await page.fill('input[name="dni"]', dni);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
 
    await page.click(`text=${role}`);

    await page.waitForURL('/');
}