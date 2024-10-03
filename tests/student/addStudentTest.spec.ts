import { expect, test } from "@playwright/test";
import { Faker, es } from '@faker-js/faker'
import { login } from '@/helpersTest/loginHelper';
import { searchStudentByDni, searchStudentByLastName } from '@/helpersTest/studentHelper';
import { beforeEach } from "node:test";

const faker = new Faker({ locale: [es] })


test.beforeEach(async ({page}) => {
    await page.goto('/');
})


const randomDNI = () => {
    const MAX = 999999999
    const MIN = 10000000
    return (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString()
};


test('Datos validos alumno', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')    

    await page.goto('http://localhost:3000/student/add');

    await page.locator('input[id="dni"]').fill(randomDNI());
    await page.locator('input[id="telefono"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="nombre"]').fill(faker.person.firstName());
    await page.locator('input[id="apellido"]').fill(faker.person.lastName());
    await page.locator('input[id="direccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="correo"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await expect(page.getByLabel('Buscar por DNI')).toBeVisible();
    await expect(page.getByText('Buscar por apellido')).toBeVisible();
    await expect(page.getByText('Nuevo Responsable')).toBeVisible();



});

test('Datos vacios nombre y dni', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    await page.locator('input[id="dni"]').fill("");
    await page.locator('input[id="telefono"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="nombre"]').fill(faker.person.firstName());
    await page.locator('input[id="apellido"]').fill(faker.person.lastName());
    await page.locator('input[id="direccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="correo"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await expect(await page.locator('button[type="submit"]')).toBeDisabled();

});

test('Email invalido', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    await page.locator('input[id="dni"]').fill(randomDNI());
    await page.locator('input[id="telefono"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="nombre"]').fill(faker.person.firstName());
    await page.locator('input[id="apellido"]').fill(faker.person.lastName());
    await page.locator('input[id="direccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="correo"]').fill(" testgmail.com");
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());


    await expect(page).toHaveURL('http://localhost:3000/student/add');
    await expect(page.locator('text="Registrar Alumno"')).toBeVisible();
});

test('Año no seleccionado', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    await page.locator('input[id="dni"]').fill(randomDNI());
    await page.locator('input[id="telefono"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="nombre"]').fill(faker.person.firstName());
    await page.locator('input[id="apellido"]').fill(faker.person.lastName());
    await page.locator('input[id="direccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="correo"]').fill(faker.internet.email());

    await expect(page.locator('button[type="submit"]')).toBeDisabled();

});



test('Asignacion de padres con padres ya registrados', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')


    await page.goto('http://localhost:3000/student/add');

    var dni = randomDNI();

    await page.locator('input[id="dni"]').fill(dni);
    await page.locator('input[id="telefono"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="nombre"]').fill(faker.person.firstName());
    await page.locator('input[id="apellido"]').fill(faker.person.lastName());
    await page.locator('input[id="direccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="correo"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Seleccionar' }).last().click();

    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('http://localhost:3000/student/add');

    await expect(page.getByText("Nuevo Alumno")).toBeVisible();

    expect(await searchStudentByDni(page, dni.toString())).toBe(true);

});

test('Asignacion de padres con padre registrado y creado', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    var dni = randomDNI();

    await page.locator('input[id="dni"]').fill(dni);
    await page.locator('input[id="telefono"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="nombre"]').fill(faker.person.firstName());
    await page.locator('input[id="apellido"]').fill(faker.person.lastName());
    await page.locator('input[id="direccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="correo"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    await page.locator('input[id="newParentDni"]').fill(randomDNI());
    await page.locator('input[id="newParentTelefono"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="newParentNombre"]').fill(faker.person.firstName());
    await page.locator('input[id="newParentApellido"]').last().fill(faker.person.lastName());
    await page.locator('input[id="newParentDireccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="newParentCorreo"]').fill(faker.internet.email());

    await page.getByRole('button', { name: 'Agregar' }).click();

    await page.waitForTimeout(2000);


    await page.getByRole('button', { name: 'Seleccionar' }).last().click(); //como el creado es el ultimo, selecciono este para asignarle al alumno



    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('http://localhost:3000/student/add');
    await page.waitForTimeout(1000);
    expect(await page.locator('text="Registrar Alumno"')).toBeVisible();

    expect(await searchStudentByDni(page, dni.toString())).toBe(true);
});


test('Asignacion de padres con un solo padre', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')

    await page.goto('http://localhost:3000/student/add');

    var dni = randomDNI();

    await page.locator('input[id="dni"]').fill(dni);
    await page.locator('input[id="telefono"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="nombre"]').fill(faker.person.firstName());
    await page.locator('input[id="apellido"]').fill(faker.person.lastName());
    await page.locator('input[id="direccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="correo"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('http://localhost:3000/student/add');

    expect(await page.locator('text="Registrar Alumno"')).toBeVisible();
    expect(await searchStudentByDni(page, dni.toString())).toBe(true);

});


test('Chequeo de alertas por numero de telefono incorrecto (menor de 8 digitos) estudiante', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    await page.locator('input[id="dni"]').fill(randomDNI());
    await page.locator('input[id="telefono"]').fill("291522");
    await page.locator('input[id="nombre"]').fill(faker.person.firstName());
    await page.locator('input[id="apellido"]').fill(faker.person.lastName());
    await page.locator('input[id="direccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="correo"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Ingrese un número de teléfono válido para el estudiante');
        dialog.dismiss();
    }
    );

    await page.locator('button[type="submit"]').click();
    expect(await page.getByText("Asociar Responsable")).toBeVisible();



});

test('Chequeo de alertas por dni menor de 8 digitos estudiante', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    await page.locator('input[id="dni"]').fill("4488180");
    await page.locator('input[id="telefono"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="nombre"]').fill(faker.person.firstName());
    await page.locator('input[id="apellido"]').fill(faker.person.lastName());
    await page.locator('input[id="direccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="correo"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Ingrese un dni válido para el estudiante');
        dialog.dismiss();
    }
    );

    await page.getByRole('button', { name: 'Registrar' }).click();
    expect(await page.getByText("Asociar Responsable")).toBeVisible();



});

test('Chequeo de alertas por dni menor de 8 digitos responsable', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    await page.locator('input[id="dni"]').fill(randomDNI());
    await page.locator('input[id="telefono"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="nombre"]').fill(faker.person.firstName());
    await page.locator('input[id="apellido"]').fill(faker.person.lastName());
    await page.locator('input[id="direccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="correo"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    await page.locator('input[id="newParentDni"]').fill("3288180"); //Como me detecta dos dni, elijo el ultimo que es el del padre
    await page.locator('input[id="newParentTelefono"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="newParentNombre"]').fill(faker.person.firstName());
    await page.locator('input[id="newParentApellido"]').last().fill(faker.person.lastName());
    await page.locator('input[id="newParentDireccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="newParentCorreo"]').fill(faker.internet.email());

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Ingrese un dni válido para el responsable');
        dialog.dismiss();
    }
    );

    await page.getByRole('button', { name: 'Agregar' }).click();

});

test('Chequeo de alertas por telefono menor de 8 digitos responsable', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')    
    await page.goto('http://localhost:3000/student/add');

    await page.locator('input[id="dni"]').fill(randomDNI());
    await page.locator('input[id="telefono"]').fill(faker.phone.number({ style: 'international' }));
    await page.locator('input[id="nombre"]').fill(faker.person.firstName());
    await page.locator('input[id="apellido"]').last().fill(faker.person.lastName());
    await page.locator('input[id="direccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="correo"]').fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.locator('button[type="submit"]').click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();


    await page.locator('input[id="newParentDni"]').fill(randomDNI()); //Como me detecta dos dni, elijo el ultimo que es el del padre
    await page.locator('input[id="newParentTelefono"]').fill("291522");
    await page.locator('input[id="newParentNombre"]').fill(faker.person.firstName());
    await page.locator('input[id="newParentApellido"]').last().fill(faker.person.lastName());
    await page.locator('input[id="newParentDireccion"]').fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.locator('input[id="newParentCorreo"]').fill(faker.internet.email());

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Ingrese un número de teléfono válido para el responsable');
        dialog.dismiss();
    }
    );

    await page.getByRole('button', { name: 'Agregar' }).click();

});
