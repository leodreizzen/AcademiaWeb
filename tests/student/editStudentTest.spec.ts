import { searchStudentByDni, createStudentWithOneParent, newBirthDate, randomDNI, newBirthDateCustom } from '@/helpersTest/studentHelper';
import { getFirstPersonDetails, getPersonDetails } from '@/helpersTest/infoHelper';
import { getTestUser } from "../testdata";
import { loginAsTestUser } from "../testutils";
import { faker } from '@faker-js/faker/locale/es_MX';
import test, { expect } from '@playwright/test';
import { searchParentByDni } from '@/helpersTest/parentHelper';
import exp from 'constants';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

const dniDefaultStudent = getTestUser("student").dni.toString();

const parentTestUser = getTestUser("secondParent");




test('Modificar alumno con todos los datos validos', async ({ page }) => {
    await loginAsTestUser(page, 'administrator');
    await page.waitForURL('/');
    await page.getByRole('link', { name: 'Alumnos' }).first().click();
    await page.getByTestId("create-button").first().click();
    const dni = await createStudentWithOneParent(page);
    await page.waitForTimeout(1000);
    await searchStudentByDni(page, dni);
    await page.waitForTimeout(1000);
    await page.getByTestId("edit-button").click();
    const newPhoneNumber = faker.phone.number({ style: 'international' }).toString().replace('+','');
    const newFirstName = faker.person.firstName();
    const newLastName = faker.person.lastName();
    const newAddress = faker.location.streetAddress({ useFullAddress: true });
    const newEmail = faker.internet.email();
    await page.locator('input[id="input-phoneNumber"]').fill(newPhoneNumber);
    await page.locator('input[id="input-firstName"]').fill(newFirstName);
    await page.locator('input[id="input-lastName"]').fill(newLastName);
    await page.locator('input[id="input-address"]').fill(newAddress);
    await page.locator('input[id="input-email"]').fill(newEmail);
    const newDate = await newBirthDate(page);

    await page.getByRole('button', { name: 'Editar Responsables' }).click();
    
    await page.getByPlaceholder('DNI').click();
    await page.getByPlaceholder('DNI').fill(parentTestUser.dni.toString());
    await page.click('svg.lucide-search');

    await page.waitForTimeout(5000);


    expect(await page.getByText('Dni: ' + parentTestUser.dni.toString())).toBeVisible();
    await page.getByRole('button', { name: 'Seleccionar' }).click();
    await page.getByRole('button', { name: 'Volver' }).last().click();
    await page.waitForTimeout(1000);

    page.once('dialog', async dialog => {
        await expect(dialog.message()).toBe('El alumno se ha modificado correctamente');
        await dialog.accept();
        

    });
    await page.getByRole('button', { name: 'Editar' }).last().click();
    await page.waitForEvent('dialog');
    await expect( page.locator('text="Información del Alumno"') ).toBeVisible();

    
    
    
    expect (await page.locator(`text=${newPhoneNumber}`).isVisible()).toBe(true);
    expect (await page.locator(`text=${newFirstName}`).isVisible()).toBe(true);
    expect (await page.locator(`text=${newLastName}`).isVisible()).toBe(true);
    expect (await page.locator(`text=${newAddress}`).isVisible()).toBe(true);
    expect (await page.locator(`text=${newEmail}`).isVisible()).toBe(true);
    expect (await page.locator(`text=${newDate}`).isVisible()).toBe(true);
    expect (await page.locator(`text=${parentTestUser.dni.toString()}`).isVisible()).toBe(true);

    await page.goto('/student');

    

    await page.waitForTimeout(1000);

    await searchStudentByDni(page, dni);

    await page.waitForTimeout(1000);

    await page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Alumno eliminado correctamente');
        await dialog.dismiss();
    });

    await page.getByTestId("remove-button").click();

});


test('Modificar alumno con datos invalidos', async ({ page }) => {
    await loginAsTestUser(page, 'administrator');
    await page.waitForURL('/');
    await page.getByRole('link', { name: 'Alumnos' }).first().click();
    await page.getByTestId("create-button").first().click();
    const dni = await createStudentWithOneParent(page);
    await page.waitForTimeout(1000);
    await searchStudentByDni(page, dni);
    await page.waitForTimeout(1000);
    await page.getByTestId("edit-button").click();
    
    await page.locator('input[id="input-phoneNumber"]').fill('');
    await page.locator('input[id="input-firstName"]').fill("");
    await page.locator('input[id="input-lastName"]').fill("");
    await page.locator('input[id="input-address"]').fill("");
    await page.locator('input[id="input-email"]').fill("");
    const newDate = await newBirthDateCustom(page, "2022", "Enero", "1");

    
    await expect( page.getByRole('button', { name: 'Editar' }).last()).toBeDisabled();
    expect (await page.locator(`text=Ingrese un nombre válido para el estudiante`).isVisible()).toBe(true);
    expect (await page.locator(`text=Ingrese un apellido válido para el estudiante`).isVisible()).toBe(true);
    expect (await page.locator(`text=Ingrese un número de teléfono válido para el estudiante`).isVisible()).toBe(true);
    expect (await page.locator(`text=Ingrese un email válido para el estudiante`).isVisible()).toBe(true);
    expect (await page.locator(`text=Ingrese una dirección válida para el estudiante`).isVisible()).toBe(true);
    expect (await page.locator(`text=El estudiante debe ser mayor de 4 años`).isVisible()).toBe(true);

    await page.goBack();

    await page.waitForTimeout(1000);

    await searchStudentByDni(page, dni);
    await page.waitForTimeout(1000);
    await page.getByTestId("edit-button").click();


    await page.getByRole('button', { name: 'Editar Responsables' }).click();

    await page.getByRole('button', { name: 'Seleccionado' }).first().click();

    expect(page.getByRole('button', { name: 'Volver' }).last()).toBeDisabled();

    await page.goto('/student');

    await page.waitForTimeout(1000);

    await searchStudentByDni(page, dni);

    await page.waitForTimeout(1000);

    await page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Alumno eliminado correctamente');
        await dialog.dismiss();
    });

    await page.getByTestId("remove-button").click();

});


