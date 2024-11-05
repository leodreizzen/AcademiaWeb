import {Locator, Page} from "@playwright/test";
import {monthToNumber} from "@/helpersTest/studentHelper";
import {faker} from "@faker-js/faker/locale/es";

export async function fillDate(page: Page, year: string, month: string, day: string) {
    await page.waitForTimeout(500);
    await page.locator('#dob').click();
    await page.waitForTimeout(500);

    while (await page.getByRole('dialog').isVisible() === false) {
        await page.locator('#dob').click();
        await page.waitForTimeout(500);
    }


    await page.getByRole('dialog').focus();
    await page.waitForTimeout(1000);


    await page.getByTestId('ArrowDropDownIcon').click();
    await page.getByRole('radio', { exact: true, name: year }).click();

    while (await page.isVisible(`.MuiPickersCalendarHeader-label:has-text("${month}")`) === false) {
        await page.getByTestId('ArrowLeftIcon').click();
        await page.waitForTimeout(500);
    }

    if (await page.isVisible(`.MuiPickersCalendarHeader-label:has-text("${year}")`) === false) {
        await page.getByTestId('ArrowRightIcon').click();
        await page.waitForTimeout(500);
        while (await page.isVisible(`.MuiPickersCalendarHeader-label:has-text("${month}")`) === false) {
            await page.getByTestId('ArrowRightIcon').click();
            await page.waitForTimeout(500);
        }
    }

    await page.getByRole('gridcell', { exact: true, name: day }).first().click();
}
