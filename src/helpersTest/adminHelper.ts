import { Page, expect } from "@playwright/test";

export async function searchAdminByDni(page: Page, Dni: string) {
    await page.getByPlaceholder('DNI').click();
    await page.getByPlaceholder('DNI').fill(Dni);
    await page.locator('.p-8 > div:nth-child(3) > .inline-flex').click();

    const expectedUrlPattern = new RegExp(`/admin\\?page=1&dni=${Dni}&lastName=`);
    await page.waitForURL(expectedUrlPattern);

    const bool = page.isVisible(`text=${'Dni: ' + Dni}`,{timeout:1000}).then((value) => {
        return value;
    });

    return bool;

}

export async function searchAdminByLastName(page: Page, LastName: string) {
    await page.getByPlaceholder("Buscar por Apellido").fill(LastName);
    await page.locator('.p-8 > div:nth-child(3) > .inline-flex').click();

    const expectedUrlPattern = new RegExp(`/admin\\?page=1&dni=&lastName=${LastName}`);
    await page.waitForURL(expectedUrlPattern,{waitUntil: 'domcontentloaded'});



    const bool = page.isVisible(`h3:has-text("${LastName}")`,{timeout:1000}).then((value) => {
        return value;
    });
    return bool;
}