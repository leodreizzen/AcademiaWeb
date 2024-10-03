import { Page,expect } from "@playwright/test";

export async function searchAdminByDni(page: Page, Dni: string) {
    await page.fill('input[placeholder="DNI"]', Dni);
    await page.locator('button:has-text("Buscar")').click();

    const expectedUrlPattern = new RegExp(`/admin`);
    await page.waitForURL(expectedUrlPattern);

    if (await page.isVisible(`text=${'Dni: '+Dni}`)) {
        return true;
    }
    else {
        return false;
    }

}

export async function searchAdminByLastName(page: Page, LastName: string) {
    await page.fill('input[placeholder="Apellido"]', LastName);
    await page.locator('button:has-text("Buscar")').click();

    const expectedUrlPattern = new RegExp(`/admin`);
    await page.waitForURL(expectedUrlPattern);

    

    if (await page.isVisible(`h3:has-text("${LastName}")`)) {
        return true;
    }
    else {
        return false;
    }
}