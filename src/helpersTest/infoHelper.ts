import { Page } from '@playwright/test';

export async function getFirstPersonDetails(page: Page) {
    const firstPersonSelector = '.rounded-xl';
    const nameSelector = firstPersonSelector + ' p.font-semibold';
    const dniSelector = firstPersonSelector + ' p.text-base';
    const expectedName = (await page.locator(nameSelector).first().textContent()) || 'Nombre no encontrado';
    const expectedDNI = (await page.locator(dniSelector).first().textContent())?.replace('DNI: ', '').trim() || 'DNI no encontrado';

    return {
        name: expectedName,
        dni: expectedDNI,
    };
}

export async function getPersonDetails(page: Page) {
    await page.waitForLoadState('domcontentloaded');
    const resultNombre = await page.locator('label:has-text("Nombre") + p.text-lg').first().textContent();
    const resultApellido = await page.locator('label:has-text("Apellido") + p.text-lg').first().textContent();
    const resultDni = await page.locator('label:has-text("DNI") + p.text-lg').first().textContent();

    return {
        fullName: resultNombre + ' ' + resultApellido,
        dni: resultDni,
    };
}