import { test, expect } from '@playwright/test';
import { Faker, es } from '@faker-js/faker'
import { newBirthDate, searchStudentByDni } from '@/helpersTest/studentHelper';
import { getFirstPersonDetails } from '@/helpersTest/infoHelper';
import {loginAsTestUser} from "../testutils";
import {searchParentByDni} from '@/helpersTest/parentHelper';


const faker = new Faker({ locale: [es] })

test.beforeEach(async ({page}) => {
    await page.goto('/');
});

const randomDNI = () => {
    const MAX = 999999999
    const MIN = 10000000
    return (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString()
};

test.describe('Testing borrar alumno', () => {

    test('Borrar un alumno determinado. Luego volver a buscarlo y no deberia aparecer.', async ({ page })=> {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        await page.getByRole('link', { name: 'Alumnos' }).first().click();
        await page.locator('text="Nuevo Alumno"').click();

        const dniStudent = randomDNI();

        await page.locator('input[id="input-dni"]').fill(dniStudent);
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
        await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill(faker.internet.email());
        await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());
        await newBirthDate(page);
        await page.locator('button[type="submit"]').click();
        await page.getByRole('button', { name: 'Seleccionar' }).first().click();
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(1000);
        await expect(page).toHaveURL('http://localhost:3000/student');

        const resultBeforeDelete = await searchStudentByDni(page, dniStudent);
        expect(resultBeforeDelete).toBeTruthy();

        const viewButton = page.locator('button:has-text("Borrar")');
        await viewButton.click();
        await page.waitForTimeout(10000);

        await page.getByRole('link', { name: 'Alumnos' }).first().click();
        await page.waitForTimeout(1000);
        const resultAfterDelete = await searchStudentByDni(page,dniStudent);
        expect(resultAfterDelete).toBeFalsy();
    });

    test('Eliminar un alumno y verificar que no pueda volver a ingresar al sistema', async ({ page }) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        await page.getByRole('link', { name: 'Alumnos' }).first().click();
        await page.locator('text="Nuevo Alumno"').click();

        const dniStudent = randomDNI();
        await page.locator('input[id="input-dni"]').fill(dniStudent);
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
        await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill(faker.internet.email());
        await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());
        await newBirthDate(page);
        await page.locator('button[type="submit"]').click();
        await page.getByRole('button', { name: 'Seleccionar' }).first().click();
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(1000);
        await expect(page).toHaveURL('http://localhost:3000/student');

        const resultBeforeDelete = await searchStudentByDni(page, dniStudent);
        expect(resultBeforeDelete).toBeTruthy();

        const deleteButton = page.locator('button:has-text("Borrar")');
        await deleteButton.click();
        await page.waitForTimeout(10000);

        const menuButton = page.locator('button[aria-haspopup="menu"]');
        await menuButton.click();
        await page.waitForTimeout(300);
        const logoutButton = page.locator('text=Cerrar sesión');
        await logoutButton.click();

        await page.waitForURL('/login');
        await page.waitForTimeout(1000);
        await page.fill('input[name="dni"]',dniStudent);
        await page.fill('input[name="password"]', dniStudent.toString());
        await page.click('button[type="submit"]');

        await expect(page.locator('text=El usuario no existe')).toBeVisible();
    });
   
    test('Eliminar un alumno y verificar que no figure como hijo de', async ({ page }) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        await page.getByRole('link', { name: 'Alumnos' }).first().click();
        await page.locator('text="Nuevo Alumno"').click();

        const dniStudent = randomDNI();

        await page.locator('input[id="input-dni"]').fill(dniStudent);
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 'international' }));
        await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill(faker.internet.email());
        await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());
        await newBirthDate(page);
        await page.locator('button[type="submit"]').click();

        const { name: nombrePadre, dni: dniPadre } = await getFirstPersonDetails(page);
        await page.getByRole('button', { name: 'Seleccionar' }).first().click();
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(1000);

        await expect(page).toHaveURL('http://localhost:3000/student');

        const resultBeforeDelete = await searchStudentByDni(page, dniStudent);
        expect(resultBeforeDelete).toBeTruthy();
        const deleteButton = page.locator('button:has-text("Borrar")');
        await deleteButton.click();
        await page.waitForTimeout(10000);

        await page.getByRole('link', { name: 'Responsables' }).first().click();
        await page.waitForTimeout(10000);
        const result = await searchParentByDni(page, dniPadre);
        expect(result).toBeTruthy();

        const viewButton = page.locator('button:has-text("Ver")');
        await viewButton.click();
        await page.waitForTimeout(10000);

        const studentElements = await page.locator('.space-y-3 > a > div');
        const studentCount = await studentElements.count();
        for (let i = 0; i < studentCount; i++) {
            const dni = await studentElements.nth(i).locator('p:text("DNI: ")').textContent();
            expect(dni).not.toContain(dniStudent);
        }
    });

});