import { Page } from "@playwright/test";


export async function randomDNI() {
    const MAX = 999999999
    const MIN = 10000000
    return (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString()
};

export async function searchStudentByDni(page: Page, Dni: string) {
    await page.fill('input[placeholder="Buscar por DNI"]', Dni);
    await page.click('svg.lucide-search');

    const expectedUrlPattern = new RegExp(`/student\\?dni=${Dni}&lastName=`);
    await page.waitForURL(expectedUrlPattern);

    if (await page.isVisible(`text=${Dni}`)) {
        return true;
    }
    else {
        return false;
    }

}

export async function searchStudentByLastName(page: Page, LastName: string) {
    await page.fill('input[placeholder="Buscar por Apellido"]', LastName);
    await page.click('svg.lucide-search');

    const expectedUrlPattern = new RegExp(`/student\\?dni=&lastName=${LastName}`);
    await page.waitForURL(expectedUrlPattern);

    if (await page.isVisible(`text=${LastName}`)) {
        return true;
    }
    else {
        return false;
    }
}