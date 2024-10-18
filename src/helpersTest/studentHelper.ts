import { faker } from "@faker-js/faker/locale/es_MX";
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

export async function createStudentWithDefaultParents(page: Page) {
    const dni = await randomDNI();

    await page.locator('input[id="input-dni"]').fill(dni);
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Seleccionar' }).last().click();

    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/student');

    return dni;

}