import { expect, test } from "@playwright/test";
import { Faker, es } from '@faker-js/faker'
import { login } from '@/helpersTest/loginHelper';
import { loginAsTestUser } from "../testutils";
import { getTestUser } from "../testdata";
import { createTeacher, searchTeacherByDni } from "@/helpersTest/teacherHelper";

const faker = new Faker({ locale: [es] })


test('Editar docente nuevo (Caso exito)', async ({ page }) => {
    await loginAsTestUser(page, 'administrator');

    const teacherDni = await createTeacher(page);

    await page.goto('/');
    await page.waitForURL('/')

    await page.getByRole('navigation').getByRole('link', { name: 'Docentes' }).first().click();

    await searchTeacherByDni(page, teacherDni);

    const editButton = await page.getByTestId('edit-teacher-button');
    await expect(editButton).toBeVisible();
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
    await page.locator('checkbox[id="subject-8"]').check();

    await expect(page.getByText("Las materias seleccionadas han cambiado.")).toBeVisible();
    
    
    
    await page.locator('button[type="submit"]').click();

    El docente se ha modificado correctamente












})