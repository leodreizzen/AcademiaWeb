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

    await page.getByLabel("Dni").fill(randomDNI());
    await page.getByLabel("Número de teléfono").fill(faker.phone.number({ style: 'international' }));
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await expect(page.getByLabel('Buscar por DNI')).toBeVisible();
    await expect(page.getByText('Buscar por apellido')).toBeVisible();
    await expect(page.getByText('Nuevo Responsable')).toBeVisible();



});

test('Datos vacios nombre y dni', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill("");
    await page.getByLabel("Número de teléfono").fill(faker.phone.number({ style: 'international' }));
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await expect(page.getByText("Siguiente")).toBeDisabled();

});

test('Email invalido', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill(randomDNI());
    await page.getByLabel("Número de teléfono").fill(faker.phone.number({ style: 'international' }));
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(" testgmail.com");
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());


    await expect(page).toHaveURL('http://localhost:3000/student/add');
    await expect(page.getByText("Registrar Alumno")).toBeVisible();
});

test('Año no seleccionado', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill(randomDNI());
    await page.getByLabel("Número de teléfono").fill(faker.phone.number({ style: 'international' }));
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());

    await expect(page.getByText("Siguiente")).toBeDisabled();

});



test('Asignacion de padres con padres ya registrados', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')


    await page.goto('http://localhost:3000/student/add');

    var dni = randomDNI();

    await page.getByLabel("Dni").fill(dni);
    await page.getByLabel("Número de teléfono").fill(faker.phone.number({ style: 'international' }));
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Seleccionar' }).last().click();

    await page.getByRole('button', { name: 'Registrar' }).click();

    await expect(page).toHaveURL('http://localhost:3000/student/add');
    await page.waitForTimeout(1000);
    await expect(page.getByText("Registrar Alumno")).toBeVisible();

    expect(await searchStudentByDni(page, dni.toString())).toBe(true);

});

test('Asignacion de padres con padre registrado y creado', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    var dni = randomDNI();

    await page.getByLabel("Dni").fill(dni);
    await page.getByLabel("Número de teléfono").fill(faker.phone.number({ style: 'international' }));
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    await page.getByLabel("Dni").last().fill(randomDNI());
    await page.getByLabel("Número de teléfono").fill(faker.phone.number({ style: 'international' }));
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").last().fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());

    await page.getByRole('button', { name: 'Agregar' }).click();

    await page.waitForTimeout(2000);


    await page.getByRole('button', { name: 'Seleccionar' }).last().click(); //como el creado es el ultimo, selecciono este para asignarle al alumno



    await page.getByRole('button', { name: 'Registrar' }).click();

    await expect(page).toHaveURL('http://localhost:3000/student/add');
    await page.waitForTimeout(1000);
    await expect(page.getByText("Registrar Alumno")).toBeVisible();

    expect(await searchStudentByDni(page, dni.toString())).toBe(true);
});


test('Asignacion de padres con un solo padre', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')

    await page.goto('http://localhost:3000/student/add');

    var dni = randomDNI();

    await page.getByLabel("Dni").fill(dni);
    await page.getByLabel("Número de teléfono").fill(faker.phone.number({ style: 'international' }));
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Registrar' }).click();

    await expect(page).toHaveURL('http://localhost:3000/student/add');
    await page.waitForTimeout(1000);
    await expect(page.getByText("Registrar Alumno")).toBeVisible();

    expect(await searchStudentByDni(page, dni.toString())).toBe(true);

});


test('Chequeo de alertas por numero de telefono incorrecto (menor de 8 digitos) estudiante', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill(randomDNI());
    await page.getByLabel("Número de teléfono").fill("291522");
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Ingrese un número de teléfono válido para el estudiante');
        dialog.dismiss();
    }
    );

    await page.getByRole('button', { name: 'Registrar' }).click();
    await expect(page.getByText("Asociar Responsable")).toBeVisible();



});

test('Chequeo de alertas por dni menor de 8 digitos estudiante', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill("4488180");
    await page.getByLabel("Número de teléfono").fill(faker.phone.number({ style: 'international' }));
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Ingrese un dni válido para el estudiante');
        dialog.dismiss();
    }
    );

    await page.getByRole('button', { name: 'Registrar' }).click();
    await expect(page.getByText("Asociar Responsable")).toBeVisible();



});

test('Chequeo de alertas por dni menor de 8 digitos responsable', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/')
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill(randomDNI());
    await page.getByLabel("Número de teléfono").fill(faker.phone.number({ style: 'international' }));
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    await page.getByLabel("Dni").last().fill("3288180"); //Como me detecta dos dni, elijo el ultimo que es el del padre
    await page.getByLabel("Número de teléfono").fill(faker.phone.number({ style: 'international' }));
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").last().fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());
    await page.getByLabel("Correo electrónico").fill("test2@gmail.com");

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

    await page.getByLabel("Dni").fill(randomDNI());
    await page.getByLabel("Número de teléfono").fill(faker.phone.number({ style: 'international' }));
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").last().fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();


    await page.getByLabel("Dni").last().fill(randomDNI()); //Como me detecta dos dni, elijo el ultimo que es el del padre
    await page.getByLabel("Número de teléfono").fill("291522");
    await page.getByLabel("Nombre").fill(faker.person.firstName());
    await page.getByLabel("Apellido").last().fill(faker.person.lastName());
    await page.getByLabel("Dirección").fill(faker.location.streetAddress({ useFullAddress: true }));
    await page.getByLabel("Correo electrónico").fill(faker.internet.email());

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Ingrese un número de teléfono válido para el responsable');
        dialog.dismiss();
    }
    );

    await page.getByRole('button', { name: 'Agregar' }).click();

});
