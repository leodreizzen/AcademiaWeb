import { Page } from '@playwright/test';

export async function searchTeacherByDni(page: Page, dni: string) {
    const inputDni = page.locator('input[placeholder="Buscar por DNI"]');
    await inputDni.fill(dni);
    const searchButton = page.locator('svg.lucide-search');
    await searchButton.click();
    const expectedUrlPattern = new RegExp(`/teacher\\?dni=${dni}&lastName=`);
    await page.waitForURL(expectedUrlPattern);

    if (await page.isVisible(`text=${dni}`)) {
        return true;
    }
    else {
        return false;
    }

}

export async function searchTeacherByLastName(page: Page, lastName: string) {
    const inputApellido = page.locator('input[placeholder="Buscar por Apellido"]');
    await inputApellido.fill(lastName);
    const searchButton = page.locator('svg.lucide-search');
    await searchButton.click();
    const expectedUrlPattern = new RegExp(`/teacher\\?dni=&lastName=${lastName}`);
    await page.waitForURL(expectedUrlPattern);

    if (await page.isVisible(`text=${lastName}`)) {
        return true;
    }
    else {
        return false;
    }
}


