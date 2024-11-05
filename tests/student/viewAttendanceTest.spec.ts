import { expect, test } from "@playwright/test";
import {loginAsTestUser} from "../testutils";
test.beforeEach(async ({page}) => {
    await page.goto('/');
});


async function contarDíasEnRojo(page) {
    let totalDíasEnRojoCount = 0;

    const meses = 12; 
    for (let i = 0; i < meses; i++) {
        const monthLabel = page.locator('.MuiPickersCalendarHeader-label');

        await expect(monthLabel).toBeVisible();

        const diasDelCalendario = await page.locator('button[role="gridcell"]');

        for (let j = 0; j < await diasDelCalendario.count(); j++) {
            const dia = diasDelCalendario.nth(j);
            const backgroundColor = await dia.evaluate((element) => window.getComputedStyle(element).backgroundColor);
            
            if (backgroundColor === 'rgb(255, 0, 0)') {
                totalDíasEnRojoCount++;
            }
        }
        if (i < meses - 1) {
            const previousMonthButton = page.locator('button[aria-label="Mes anterior"]');
            await previousMonthButton.click();
        }
    }

    return totalDíasEnRojoCount;
}

test.describe('Ver asistencia de hijos', () => {

    test('Perfil con rol de padre tiene acceso a Asistencia', async ({ page }) => {
        await loginAsTestUser(page, 'secondParent');
        await page.waitForTimeout(100);
        const childButton = await page.locator('button:has-text("Axel Berge")'); 
        await expect(childButton).toBeVisible();
        await childButton.click();
        await page.waitForURL('/'); 
        await expect(page.locator('button:has-text("Padre")')).toBeVisible();
        await expect(page.locator('button:has-text("Axel Berge")')).toBeVisible();
        await expect(page.getByRole('navigation').getByRole('link', { name: 'Asistencia' })).toBeVisible();
    });

    test('Presente esta marcado con verde', async ({ page }) => {
        await loginAsTestUser(page, 'secondParent');
        await page.waitForTimeout(100);
        const childButton = await page.locator('button:has-text("Axel berge")'); 
        await expect(childButton).toBeVisible();
        await childButton.click();
        await page.waitForURL('/'); 
        await page.getByRole('navigation').getByRole('link', { name: 'Asistencia' }).first().click();
        const dia4 = page.locator('button[role="gridcell"][data-timestamp="1730689200000"]');
        await page.waitForSelector('button[role="gridcell"][data-timestamp="1730689200000"]');
        await expect(dia4).toBeVisible();
        const backgroundColor = await dia4.evaluate((element) => window.getComputedStyle(element).backgroundColor);
        expect(backgroundColor).toBe('rgb(0, 128, 0)');
    });

    test('Ausente esta marcado con rojo', async ({ page }) => {
        await loginAsTestUser(page, 'secondParent');
        await page.waitForTimeout(100);
        const childButton = await page.locator('button:has-text("Toy maggio")'); 
        await expect(childButton).toBeVisible();
        await childButton.click();
        await page.waitForURL('/'); 
        await page.getByRole('navigation').getByRole('link', { name: 'Asistencia' }).first().click();

        const monthLabel = page.locator('.MuiPickersCalendarHeader-label');
        await expect(monthLabel).toHaveText('noviembre 2024');
 
        const previousMonthButton = page.locator('button[aria-label="Mes anterior"]');
        await previousMonthButton.click();
        await expect(monthLabel).toHaveText('octubre 2024');

        const dia4 = page.locator('button[role="gridcell"][data-timestamp="1730084400000"]');
        await page.waitForSelector('button[role="gridcell"][data-timestamp="1730084400000"]');
        await expect(dia4).toBeVisible();
       
        const backgroundColor = await dia4.evaluate((element) => window.getComputedStyle(element).backgroundColor);
        expect(backgroundColor).toBe('rgb(255, 0, 0)');
    });

    test('Dia sin asistencia no tiene color', async ({ page }) => {
        await loginAsTestUser(page, 'secondParent');
        await page.waitForTimeout(100);
        const childButton = await page.locator('button:has-text("Toy maggio")'); 
        await expect(childButton).toBeVisible();
        await childButton.click();
        await page.waitForURL('/'); 
        await page.getByRole('navigation').getByRole('link', { name: 'Asistencia' }).first().click();

        const monthLabel = page.locator('.MuiPickersCalendarHeader-label');
        await expect(monthLabel).toHaveText('noviembre 2024');
 
        const previousMonthButton = page.locator('button[aria-label="Mes anterior"]');
        await previousMonthButton.click();
        await expect(monthLabel).toHaveText('octubre 2024');

        const dia30 = page.locator('button[role="gridcell"][data-timestamp="1730257200000"]');
        await page.waitForSelector('button[role="gridcell"][data-timestamp="1730257200000"]');
        await expect(dia30).toBeVisible();
       
        const backgroundColor = await dia30.evaluate((element) => window.getComputedStyle(element).backgroundColor);
        expect(backgroundColor).toBe('rgba(0, 0, 0, 0)');

    });

    test('Contar días marcados con rojo en meses anteriores', async ({ page }) => {
        await loginAsTestUser(page, 'secondParent');
        await page.waitForTimeout(100);
        const childButton = await page.locator('button:has-text("Toy maggio")'); 
        await expect(childButton).toBeVisible();
        await childButton.click();
        await page.waitForURL('/'); 
        await page.getByRole('navigation').getByRole('link', { name: 'Asistencia' }).first().click();
    
        const totalDíasAusentesCount = await contarDíasEnRojo(page);
        const totalFaltas = await page.locator('h6:has-text("Total de faltas:")');
        const textoTotalFaltas = await totalFaltas.innerText();
        const faltasCount = parseInt(textoTotalFaltas.match(/\d+/)[0]);
        expect(totalDíasAusentesCount).toBe(faltasCount);
    });
});