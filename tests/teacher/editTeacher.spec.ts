import { expect, test } from "@playwright/test";
import { Faker, es } from '@faker-js/faker'
import { login } from '@/helpersTest/loginHelper';
import { loginAsTestUser } from "../testutils";
import { getTestUser } from "../testdata";
import { createTeacher, searchTeacherByDni } from "@/helpersTest/teacherHelper";

const faker = new Faker({ locale: [es] })
test.beforeEach(async ({page}) => {
    await page.goto('/');
})

test('Editar docente nuevo (Caso exito)', async ({ page }) => {
    await loginAsTestUser(page, 'administrator');

    const teacherDni = await createTeacher(page);

    await page.goto('/');
    await page.waitForURL('/')

    await page.getByRole('navigation').getByRole('link', { name: 'Docentes' }).first().click();

    await searchTeacherByDni(page, teacherDni);

    const editButton = await page.getByTestId('edit-teacher-button');
    await editButton.click();

    const newFirstName = faker.person.firstName();
    const newLastName = faker.person.lastName();
    const newPhoneNumber = faker.phone.number({ style: 'international' });
    const newAddress = faker.location.streetAddress({ useFullAddress: true });
    const newEmail = faker.internet.email();

    await page.locator('input[id="input-name"]').fill(newFirstName);
    await page.locator('input[id="input-lastName"]').fill(newLastName);
    await page.locator('input[id="input-phoneNumber"]').fill(newPhoneNumber);
    await page.locator('input[id="input-address"]').fill(newAddress);
    await page.locator('input[id="input-email"]').fill(newEmail);

    await page.getByText("1º año").click();

    await page.getByLabel('Educación Física').check();

    await expect(page.getByText("Las materias seleccionadas han cambiado.")).toBeVisible();

    let dialogShown = false;

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('El docente se ha modificado correctamente');
        dialog.accept();
        dialogShown = true;
    }
    );
    await page.getByRole('button', { name: 'Editar' }).click();

    await expect.poll(async () => {
        return dialogShown;
    }, {
        intervals: [250],
        timeout: 20000,
    }).toBe(true)


    await expect(page.locator('label:has-text("Nombre") + p.text-lg').first()).toHaveText(newFirstName);
    await expect(page.locator('label:has-text("Apellido") + p.text-lg').first()).toHaveText(newLastName);
    await expect(page.locator('label:has-text("Teléfono") + p.text-lg').first()).toHaveText(newPhoneNumber.replace('+',''));	
    await expect(page.locator('label:has-text("Dirección") + p.text-lg').first()).toHaveText(newAddress);
    await expect(page.locator('label:has-text("Correo Electrónico") + p.text-lg').first()).toHaveText(newEmail);
    await expect(page.locator('label:has-text("DNI") + p.text-lg').first()).toHaveText(teacherDni);

    await expect(page.getByText('1º año')).toBeVisible();
    await expect(page.getByText("Educación Física")).toBeVisible();

})

test('Editar docente con campos vacios (Caso fallo)', async ({ page }) => {
    await loginAsTestUser(page, 'administrator');

    const teacherDni = '55555555'


    await page.getByRole('navigation').getByRole('link', { name: 'Docentes' }).first().click();

    await searchTeacherByDni(page, teacherDni);

    const editButton = await page.getByTestId('edit-teacher-button');
    await expect(editButton).toBeVisible();
    await editButton.click();

    await page.locator('input[id="input-name"]').fill(' ');
    await page.locator('input[id="input-lastName"]').fill(' ');
    await page.locator('input[id="input-phoneNumber"]').fill(' ');
    await page.locator('input[id="input-address"]').fill(' ');
    await page.locator('input[id="input-email"]').fill(' ');




   

    await expect(page.getByText("Ingrese un nombre válido.")).toBeVisible();
    await expect(page.getByText("Ingrese un apellido válido.")).toBeVisible();
    
    await expect(page.getByText("Ingrese un teléfono válido.")).toBeVisible();
    
    await expect(page.getByText("Ingrese un email válido.")).toBeVisible();
    
    await expect(page.getByText("Ingrese una dirección válida.")).toBeVisible();
    
    await expect(page.getByRole('button', { name: 'Editar' })).toBeDisabled();
})