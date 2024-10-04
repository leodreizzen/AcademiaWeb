import { Page, expect } from "@playwright/test";

export async function searchAdminByDni(page: Page, Dni: string) {
    await page.getByPlaceholder('DNI').click();
    await page.getByPlaceholder('DNI').fill(Dni);
    await page.getByRole('button', { name: 'Buscar' }).click();

    const expectedUrlPattern = new RegExp(`/admin\\?dni=${Dni}&lastName=`);
    await page.waitForURL(expectedUrlPattern,{waitUntil: 'domcontentloaded'});

    var bool = page.isVisible(`text=${'Dni: ' + Dni}`,{timeout:1000}).then((value) => {
        return value;
    });

    return bool;

}

export async function searchAdminByLastName(page: Page, LastName: string) {
    await page.fill('input[name="lastName"]', LastName);
    await page.locator('button:has-text("Buscar")').click();

    const expectedUrlPattern = new RegExp(`/admin\\?dni=&lastName=${LastName}`);
    await page.waitForURL(expectedUrlPattern,{waitUntil: 'domcontentloaded'});



    var bool = page.isVisible(`h3:has-text("${LastName}")`,{timeout:1000}).then((value) => {
        return value;
    });
    return bool;
}