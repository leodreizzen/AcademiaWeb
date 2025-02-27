import { expect, test } from "@playwright/test";
import { Faker, es } from '@faker-js/faker'
import { login } from '@/helpersTest/loginHelper';
import { searchStudentByDni, searchStudentByLastName, newBirthDate, removeStudent, removeStudentAndParent } from '@/helpersTest/studentHelper';
import { newBirthDateOverEighteen, searchParentByDni } from '@/helpersTest/parentHelper';
import { getTestUserWithRole } from "../testdata";
import {randomPhoneNumber} from "../testutils";


const faker = new Faker({ locale: [es] })


test.beforeEach(async ({ page }) => {
    await page.goto('/');
})


const randomDNI = () => {
    const MAX = 999999999
    const MIN = 10000000
    return (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString()
};

const adminToLogIn = getTestUserWithRole('administrator', "Administrator")

test('Datos validos alumno', async ({ page }) => {


    await login(page, adminToLogIn.dni.toString(), adminToLogIn.password);
    await page.waitForURL('/')

    await page.getByRole('navigation').getByRole('link', { name: 'Alumnos' }).click();
    await page.getByTestId("create-button").click();


    await page.locator('input[id="input-dni"]').fill(randomDNI());
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());
    await page.getByRole('button', { name: 'Elija una fecha' }).click();

    await newBirthDate(page);

    await page.locator('button[type="submit"]').click();

    await expect(page.getByPlaceholder('Buscar por DNI')).toBeVisible();
    await expect(page.getByPlaceholder('Buscar por apellido')).toBeVisible();
    await expect(page.getByText('Nuevo Responsable')).toBeVisible();





});

test('Datos vacios nombre y dni', async ({ page }) => {
    await login(page, adminToLogIn.dni.toString(), adminToLogIn.password);
    await page.waitForURL('/')
    await page.goto('/student/add');

    await page.locator('input[id="input-dni"]').fill("");
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());

    await newBirthDate(page);
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await expect(await page.locator('button[type="submit"]')).toBeDisabled();

});

test('Email invalido', async ({ page }) => {
    await login(page, adminToLogIn.dni.toString(), adminToLogIn.password);
    await page.waitForURL('/')
    await page.goto('/student/add');

    await page.locator('input[id="input-dni"]').fill(randomDNI());
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(" testgmail.com");
    await newBirthDate(page);
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());


    await expect(page).toHaveURL('/student/add');
    await expect(page.locator('text="Registrar Alumno"')).toBeVisible();
});

test('Año no seleccionado', async ({ page }) => {
    await login(page, adminToLogIn.dni.toString(), adminToLogIn.password);
    await page.waitForURL('/')
    await page.goto('/student/add');

    await page.locator('input[id="input-dni"]').fill(randomDNI());
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDate(page);

    await expect(page.locator('button[type="submit"]')).toBeDisabled();

});



test('Asignacion de padres con padres ya registrados', async ({ page }) => {
    await login(page, adminToLogIn.dni.toString(), adminToLogIn.password);
    await page.waitForURL('/')


    await page.goto('/student/add');

    var dni = randomDNI();

    await page.locator('input[id="input-dni"]').fill(dni);
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDate(page);
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Seleccionar' }).last().click();

    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/student');

    await expect(page).toHaveURL('/student');


    expect(await searchStudentByDni(page, dni.toString())).toBe(true);

    await removeStudent(page, dni);

});

test('Asignacion de padres con padre registrado y creado', async ({ page }) => {
    await login(page, adminToLogIn.dni.toString(), adminToLogIn.password);
    await page.waitForURL('/')
    await page.goto('/student/add');

    const dni = randomDNI();

    await page.locator('input[id="input-dni"]').fill(dni);
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());
    await newBirthDate(page);
    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    const parentDni = await randomDNI();

    await page.locator('input[id="input-dni"]').fill(parentDni);
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').last().fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDateOverEighteen(page);

    await page.getByRole('button', { name: 'Agregar' }).click();

    await page.waitForTimeout(2000);


    await page.getByRole('button', { name: 'Seleccionar' }).last().click(); //como el creado es el ultimo, selecciono este para asignarle al alumno

    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/student');

    await expect(page).toHaveURL('/student');

    expect(await searchStudentByDni(page, dni.toString())).toBe(true);

    await removeStudentAndParent(page, dni, parentDni);

});


test('Asignacion de padres con un solo padre', async ({ page }) => {
    await login(page, adminToLogIn.dni.toString(), adminToLogIn.password);
    await page.waitForURL('/')

    await page.goto('/student/add');

    var dni = randomDNI();

    await page.locator('input[id="input-dni"]').fill(dni);
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDate(page);
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.locator('button[type="submit"]').click();

    await page.waitForURL('/student');

    await expect(page).toHaveURL('/student');

    expect(await searchStudentByDni(page, dni.toString())).toBe(true);

    await removeStudent(page, dni);

});


test('Chequeo de alertas por numero de telefono incorrecto (menor de 8 digitos) estudiante', async ({ page }) => {
    await login(page, adminToLogIn.dni.toString(), adminToLogIn.password);
    await page.waitForURL('/')
    await page.goto('/student/add');

    await page.locator('input[id="input-dni"]').fill(randomDNI());
    await page.locator('input[id="input-phoneNumber"]').fill("291522");
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDate(page);
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());
    await expect(page.locator('form')).toContainText('Ingrese un número de teléfono válido');





});

test('Chequeo de alertas por dni menor de 8 digitos estudiante', async ({ page }) => {
    await login(page, adminToLogIn.dni.toString(), adminToLogIn.password);
    await page.waitForURL('/')
    await page.goto('/student/add');

    await page.locator('input[id="input-dni"]').fill("448818");
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDate(page);
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await expect(page.locator('form')).toContainText('Ingrese un dni válido');



});

test('Chequeo de alertas por dni menor de 8 digitos responsable', async ({ page }) => {
    await login(page, adminToLogIn.dni.toString(), adminToLogIn.password);
    await page.waitForURL('/')
    await page.goto('/student/add');

    await page.locator('input[id="input-dni"]').fill(randomDNI());
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDate(page);
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    await page.locator('input[id="input-dni"]').fill("328818"); //Como me detecta dos dni, elijo el ultimo que es el del padre
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').last().fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDateOverEighteen(page);
    await expect(page.getByLabel('Nuevo Responsable')).toContainText('Ingrese un dni válido');

});

test('Chequeo de alertas por telefono menor de 8 digitos responsable', async ({ page }) => {
    await login(page, adminToLogIn.dni.toString(), adminToLogIn.password);
    await page.waitForURL('/')
    await page.goto('/student/add');

    await page.locator('input[id="input-dni"]').fill(randomDNI());
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').last().fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());
    await newBirthDate(page);

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();


    await page.locator('input[id="input-dni"]').fill(randomDNI()); //Como me detecta dos dni, elijo el ultimo que es el del padre
    await page.locator('input[id="input-phoneNumber"]').fill("291522");
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').last().fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDateOverEighteen(page);

    await expect(page.getByLabel('Nuevo Responsable')).toContainText('Ingrese un número de teléfono válido');

});

test('Caso de falla DNI DUPLICADO', async ({ page }) => {


    await login(page, adminToLogIn.dni.toString(), adminToLogIn.password);
    await page.waitForURL('/')


    await page.goto('/student/add');

    var dni = '11111111'

    await page.locator('input[id="input-dni"]').fill(dni);
    await page.locator('input[id="input-phoneNumber"]').fill(randomPhoneNumber());
    await page.locator('input[id="input-firstName"]').fill(faker.person.firstName());
    await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
    await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="input-email"]').fill(faker.internet.email());
    await newBirthDate(page);
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Seleccionar' }).last().click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Ya existe un alumno con ese dni');
        dialog.dismiss();
    }
    );

    await page.locator('button[type="submit"]').click();

});

