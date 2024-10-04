import { Page, expect } from "@playwright/test";

export async function searchParentByDni(page: Page, Dni: string) {
    await page.getByPlaceholder('DNI').click();
    await page.getByPlaceholder('DNI').fill(Dni);
    await page.click('svg.lucide-search');

    const expectedUrlPattern = new RegExp(`/parent\\?dni=${Dni}&lastName=`);
    await page.waitForURL(expectedUrlPattern,{waitUntil: 'domcontentloaded'});

    let bool = page.isVisible(`text=${'Dni: ' + Dni}`,{timeout:1000}).then((value) => {
        return value;
    });

    return bool;

}

export async function searchParentByLastName(page: Page, LastName: string) {
    await page.getByPlaceholder('Apellido').click();
    await page.getByPlaceholder('Apellido').fill(LastName);
    await page.click('svg.lucide-search');

    const expectedUrlPattern = new RegExp(`/parent\\?dni=&lastName=${LastName}`);
    await page.waitForURL(expectedUrlPattern,{waitUntil: 'domcontentloaded'});



    let bool = page.isVisible(`p:has-text("${LastName}")`,{timeout:1000}).then((value) => {
        return value;
    });
    return bool;
}