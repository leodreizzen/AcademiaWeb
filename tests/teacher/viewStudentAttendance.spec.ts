import {expect, Page, test} from "@playwright/test";
import {loginAsTestUser} from "../testutils";
test.beforeEach(async ({page}) => {
    await page.goto('/');
});

const year = "1º año"; 

test.describe('Ver asistencia de alumnos', () => {

    test('Perfil con rol de profesor tiene acceso a Asistencia', async ({ page }) => {
        await loginAsTestUser(page, 'parentTeacher');
        const firstButton = await page.locator('button:has-text("Profesor")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
        await page.waitForURL('/'); 
 
        await page.getByRole('navigation').getByRole('link', { name: 'Asistencia' }).first().click();
        await expect(page.locator('text=Selecciona el año para el cual quiere visualizar la asistencia')).toBeVisible();
    });

    test('Perfil con rol de padre no tiene acceso a Asistencia de alumnos de determinado año', async ({ page }) => {
        await loginAsTestUser(page, 'secondParent');
        const childButton = await page.locator('button:has-text("Axel Berge")'); 
        await expect(childButton).toBeVisible();
        await childButton.click();
        await page.waitForURL('/'); 
        await expect(page.locator('button:has-text("Padre")')).toBeVisible();
        await expect(page.locator('button:has-text("Axel Berge")')).toBeVisible();
        await expect(page.getByRole('navigation').getByRole('link', { name: 'Asistencia' })).toBeVisible();
        await expect(page.locator('text=Selecciona el año para el cual quiere visualizar la asistencia')).not.toBeVisible();
    });

    test('Verificacion que la asistencia corresponde al año seleccionado', async ({ page }) => {
        await loginAsTestUser(page, 'parentTeacher');
        const firstButton = await page.locator('button:has-text("Profesor")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
        await page.waitForURL('/');
        await page.getByRole('navigation').getByRole('link', { name: 'Asistencia' }).first().click();
 
        await page.locator('button[role="combobox"]').click();
        
        await page.waitForSelector('[data-radix-select-viewport]', { state: 'visible' });
        await page.locator(`[role="option"]:has-text("${year}")`).click();
        const nextButton = page.locator('button:has-text("Siguiente")');
        await nextButton.click();
        await expect(page.locator('h5')).toContainText(`Asistencia de la clase de ${year}`);
    });

    
    test('Verificacion que dia que tiene registrada asistencias PRESENTE no tiene ausencias.', async ({ page }) => {
        await loginAsTestUser(page, 'parentTeacher');
        const firstButton = await page.locator('button:has-text("Profesor")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
        await page.waitForURL('/');
        await page.getByRole('navigation').getByRole('link', { name: 'Asistencia' }).first().click();
 
        await page.locator('button[role="combobox"]').click();
        await page.waitForSelector('[data-radix-select-viewport]', { state: 'visible' });
        await page.locator(`[role="option"]:has-text("${year}")`).click();
        await page.locator('button:has-text("Siguiente")').click();

        const dia2 = page.locator('button[role="gridcell"]:not([disabled])', {hasText: new RegExp("^2$")});
        await expect(dia2).toBeVisible();
        await dia2.click();

        const attendanceDialog = await page.locator('.MuiDialog-paper');
        await attendanceDialog.waitFor({ state: 'visible', timeout: 100 });
        await expect(attendanceDialog).toBeVisible();
        await expect(attendanceDialog.locator('h6:has-text("Total de ausencias: 0")')).toBeVisible();
    });

    test('Verificacion que dia que tiene registrada asistencias ausentes, el total corresponde con el notificado.', async ({ page }) => {
        await loginAsTestUser(page, 'parentTeacher');
        const firstButton = await page.locator('button:has-text("Profesor")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
        await page.waitForURL('/');
        await page.getByRole('navigation').getByRole('link', { name: 'Asistencia' }).first().click();
 
        await page.locator('button[role="combobox"]').click();
        await page.waitForSelector('[data-radix-select-viewport]', { state: 'visible' });
        await page.locator(`[role="option"]:has-text("${year}")`).click();
        await page.locator('button:has-text("Siguiente")').click();

        const dia4 = page.locator('button[role="gridcell"]:not([disabled])', {hasText: new RegExp("^4$")});
        await expect(dia4).toBeVisible();
        await dia4.click();

        const attendanceDialog = await page.locator('.MuiDialog-paper');
        await attendanceDialog.waitFor({ state: 'visible', timeout: 100 });
        await expect(attendanceDialog).toBeVisible();
        await expect(attendanceDialog.locator('h6:has-text("Total de ausencias: 1")')).toBeVisible();
    });

    test('Verificacion que dia que NO tiene registrada asistencias, debe aparecer un alert notificando que no tiene asistencia ese dia', async ({ page }) => {
        await loginAsTestUser(page, 'parentTeacher');
        const firstButton = await page.locator('button:has-text("Profesor")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
        await page.waitForURL('/');
        await page.getByRole('navigation').getByRole('link', { name: 'Asistencia' }).first().click();
 
        await page.locator('button[role="combobox"]').click();
        await page.waitForSelector('[data-radix-select-viewport]', { state: 'visible' });
        await page.locator(`[role="option"]:has-text("${year}")`).click();
        await page.locator('button:has-text("Siguiente")').click();

        const dia10 = page.locator('button[role="gridcell"]:not([disabled])', {hasText: new RegExp("^10$")});
        await expect(dia10).toBeVisible();
        let dialogShown = false;
        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toBe('No hay datos de asistencia para este día');
            await dialog.accept(); 
            dialogShown = true;
            }
        );

        await dia10.click();

        await expect.poll(async () => {
            return dialogShown;
        }, {
            intervals: [250],
            timeout: 20000,
        }).toBe(true)
    
    });

    test('Verificación que un dia con asistencia registra, NO debe mostrar un alert de no asistencia.', async ({ page }) => {
        await loginAsTestUser(page, 'parentTeacher');
        const firstButton = await page.locator('button:has-text("Profesor")');  
        await expect(firstButton).toBeVisible();
        await firstButton.click();
        await page.waitForURL('/');
        await page.getByRole('navigation').getByRole('link', { name: 'Asistencia' }).first().click();
    
        await page.locator('button[role="combobox"]').click();
        await page.waitForSelector('[data-radix-select-viewport]', { state: 'visible' });
        await page.locator(`[role="option"]:has-text("${year}")`).click();
        await page.locator('button:has-text("Siguiente")').click();
    
        const dia4 = page.locator('button[role="gridcell"]:not([disabled])', {hasText: new RegExp("^4$")});
        await expect(dia4).toBeVisible();
    
        let dialogShown = false;
    
        page.on('dialog', async (dialog) => {
            dialogShown = true;
            await dialog.dismiss();
        });
    
        await dia4.click();
  
        await expect.poll(async () => {
            return dialogShown;
        }, {
            intervals: [250],
            timeout: 5000,  
        }).toBe(false);
    });
  });