import { expect, test } from "@playwright/test";
import { loginAsTestUser } from "../testutils";
import removeTodayAttendance from "../attendanceUtils";
test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await removeTodayAttendance();
});

const todayDate = new Date();
const isWeekend = todayDate.getDay() === 0 || todayDate.getDay() === 6;

test.describe('Registrar asistencia', () => {
    test('Profesor registra asistencia', async ({ page }) => {
        await loginAsTestUser(page, 'parentTeacher');
        await page.waitForTimeout(100);
        const firstButton = await page.locator('button:has-text("Profesor")');
        await expect(firstButton).toBeVisible();
        await firstButton.click();
        await page.waitForURL('/');
        await page.getByRole('navigation').getByRole('link', { name: 'Asistencia' }).first().click();
        await page.getByText('Siguiente').click();
        await page.waitForURL('/attendance/1/add');
        await page.locator('button[id="present-8"]').click();
        await page.locator('button[id="present-9"]').click();
        let dialogShown = false;
        page.on('dialog', dialog => {
            if (isWeekend) {
                expect(dialog.message()).toBe('No se puede registrar asistencia en fin de semana');
                dialog.accept();
            } else {
                expect(dialog.message()).toBe('Asistencia registrada correctamente');
                dialog.accept();
            }
            dialog.dismiss();
            dialogShown = true;
        }
        );


        await page.getByText('Cargar').click();

        await expect.poll(async () => {
            return dialogShown;
        }, {
            intervals: [250],
            timeout: 20000,
        }).toBe(true)

            




    });
});