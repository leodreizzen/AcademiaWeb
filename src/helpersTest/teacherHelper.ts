import { expect, Page } from '@playwright/test';
import { loginAsTestUser } from '../../tests/testutils';
import { randomDNI } from './studentHelper';
import { faker } from '@faker-js/faker/locale/es';

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

export async function createTeacher(page: Page) {
    
    await page.waitForURL('/')

    await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
    await page.getByTestId("add-teacher-button").click();
    const teacherDni = await randomDNI();
    await page.locator('input[id="input-dni"]').fill(teacherDni);
    await page.locator('input[id="input-name"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }).replace('+',''));
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());

    const assignCoursesButton = await page.locator('button:has-text("Asignar Cursos y Materias")');
    await expect(assignCoursesButton).toBeVisible();
    await assignCoursesButton.click();

    await page.waitForSelector('div[role="dialog"]', { state: 'visible' });
    const comboboxCursos = await page.waitForSelector('button[role="combobox"]', { state: 'visible' });

    if (await comboboxCursos.getAttribute('aria-expanded') === 'false') {
        await comboboxCursos.click();
    }

    await page.locator('div[role="option"]:has-text("1º año")').click();
    const comboboxMaterias = await page.locator('label[for="materia"] + button[role="combobox"]');

    if (await comboboxMaterias.getAttribute('aria-expanded') === 'false') {
        await comboboxMaterias.click();
    }

    await page.waitForSelector('div[role="option"]:has-text("Matemática")', { state: 'visible' });
    await page.locator('div[role="option"]:has-text("Matemática")').click();
    await page.click('button:has-text("Asignar Materia")');

    const añoElegido = await page.locator('h5:has-text("1º año:")');
    await expect(añoElegido).toBeVisible();
    const materiaElegida = await page.locator('ul > li:has-text("Matemática")');
    await expect(materiaElegida).toBeVisible();
    const closeButton = await page.locator('button:has-text("Close")');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    

    let dialogShown = false;
    
    page.on('dialog',async dialog => {
        expect(dialog.message()).toBe('Docente creado exitosamente');
        dialog.accept();
        dialogShown = true;
    }
    );
    await page.locator('button[type="submit"]').click();

    await expect.poll(async () => {
        return dialogShown;
    }, {
        intervals: [250],
        timeout: 20000,
    }).toBe(true)

    page.removeAllListeners('dialog');

    
    
    
    return teacherDni;
}


