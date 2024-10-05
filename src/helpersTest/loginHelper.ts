import { Page } from '@playwright/test';

export async function login(page: Page, dni: string, password: string) {
    await page.fill('input[name="dni"]', dni);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
}