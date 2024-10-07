import { expect, test } from "@playwright/test";
import { Faker, es } from '@faker-js/faker'
import { login } from '@/helpersTest/loginHelper';

const faker = new Faker({ locale: [es] })

const randomDNI = () => {
    const MAX = 999999999
    const MIN = 10000000
    return (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString()
};

test.beforeEach(async ({page}) => {
    await page.goto('/');
})

test.describe('Testing alta docente', () => {

	test('Agregar docente con datos validos sin asignacion de cursos', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')    

        await page.getByRole('navigation').getByRole('link', { name: 'Docentes' }).first().click();
        await page.waitForSelector('button:has-text(" Nuevo docente")', { state: 'visible' });
        await page.locator('button:has-text("Nuevo Docente")').click();

        await page.locator('input[id="input-dni"]').fill(randomDNI());
        await page.locator('input[id="input-name"]').fill(faker.person.firstName());
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 	'international' }));
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill(faker.internet.email());
        await page.locator('button[type="submit"]').click();
        
        page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Docente creado exitosamente');
        dialog.dismiss();
        })
	});

    
    test('Agregar docente con datos validos conasignacion de cursos', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')    

        await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
        await page.locator('button:has-text("Nuevo Docente")').click();

        await page.locator('input[id="input-dni"]').fill(randomDNI());
        await page.locator('input[id="input-name"]').fill(faker.person.firstName());
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 	'international' })); 
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill(faker.internet.email());

        const assignCoursesButton = await page.locator('button:has-text("Asignar Cursos y Materias")');
        await expect(assignCoursesButton).toBeVisible();
        await assignCoursesButton.click();
    
        await page.waitForSelector('div[role="dialog"]', { state: 'visible' });
        const comboboxCursos = await  page.waitForSelector('button[role="combobox"]', { state: 'visible' });
        
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
        await expect( añoElegido).toBeVisible(); 
        const materiaElegida = await page.locator('ul > li:has-text("Matemática")');
        await expect(materiaElegida).toBeVisible(); 
        const closeButton = await page.locator('button:has-text("Close")');
        await expect(closeButton).toBeVisible();
        await closeButton.click();
        await page.locator('button[type="submit"]').click();
      
        page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Docente creado exitosamente');
        dialog.dismiss();
        })
	});

    test('Agregar docente con datos validos con asignacion de cursos pero sin seleccionar ni año ni materia.', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')    

        await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
        await page.locator('button:has-text("Nuevo Docente")').click();

        await page.locator('input[id="input-dni"]').fill(randomDNI());
        await page.locator('input[id="input-name"]').fill(faker.person.firstName());
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 	'international' })); 
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill(faker.internet.email());

        const assignCoursesButton = await page.locator('button:has-text("Asignar Cursos y Materias")');
        await expect(assignCoursesButton).toBeVisible();
        await assignCoursesButton.click();
        
        const assignMateriaButton = await page.locator('button:has-text("Asignar Materia")');
        await expect(assignMateriaButton).toBeDisabled();
	});


    // CAMPOS VACIOS.
    test('Agregar docente con campo dni vacio y sin asignacion de curso', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')    
        await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
        await page.locator('button:has-text("Nuevo Docente")').click();

        await page.locator('input[id="input-dni"]').fill('');
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-name"]').fill(faker.person.firstName());
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 	'international' }));
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill(faker.internet.email());

        await page.locator('button[type="submit"]').click();

        const errorMessage = page.locator('span.text-red-400', { hasText: 'Ingrese un DNI válido.' });
        await expect(errorMessage).toBeVisible({ timeout: 15000 });
	});

    test('Agregar docente con campo apellido vacio y sin asignacion de curso', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')    
        await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
        await page.locator('button:has-text("Nuevo Docente")').click();

        await page.locator('input[id="input-dni"]').fill(randomDNI());
        await page.locator('input[id="input-name"]').fill(faker.person.firstName());
        await page.locator('input[id="input-lastName"]').fill('');
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 	'international' }));
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill(faker.internet.email());

        await page.locator('button[type="submit"]').click();

        const errorMessage = page.locator('span.text-red-400', { hasText: 'Ingrese un apellido válido.' });
        await expect(errorMessage).toBeVisible({ timeout: 15000 });
	});

    test('Agregar docente con campo nombre vacio y sin asignacion de curso', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')    
        await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
        await page.locator('button:has-text("Nuevo Docente")').click();

        await page.locator('input[id="input-dni"]').fill(randomDNI());
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-name"]').fill('');
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 	'international' }));
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill(faker.internet.email());

        await page.locator('button[type="submit"]').click();

        const errorMessage = page.locator('span.text-red-400', { hasText: 'Ingrese un nombre válido.' });
        await expect(errorMessage).toBeVisible({ timeout: 15000 });
	});

    test('Agregar docente con campo direccion vacio y sin asignacion de curso', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')    
        await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
        await page.locator('button:has-text("Nuevo Docente")').click();

        await page.locator('input[id="input-dni"]').fill(randomDNI());
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-name"]').fill(faker.person.firstName());
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 	'international' }));
        await page.locator('input[id="input-address"]').fill('');
        await page.locator('input[id="input-email"]').fill(faker.internet.email());

        await page.locator('button[type="submit"]').click();

        const errorMessage = page.locator('span.text-red-400', { hasText: 'Ingrese una dirección válida.' });
        await expect(errorMessage).toBeVisible({ timeout: 15000 });
	});

    test('Agregar docente con campo numero de telefono vacio', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')    
        await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
        await page.locator('button:has-text("Nuevo Docente")').click();

        await page.locator('input[id="input-dni"]').fill(randomDNI());
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-name"]').fill(faker.person.firstName());
        await page.locator('input[id="input-phoneNumber"]').fill('');
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill(faker.internet.email());
        await page.locator('button[type="submit"]').click();

        const errorMessage = page.locator('span.text-red-400', { hasText: 'Ingrese un teléfono válido.' });
        await expect(errorMessage).toBeVisible({ timeout: 15000 });
	});

    test('Agregar docente con campo email vacio', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')    
        await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
        await page.locator('button:has-text("Nuevo Docente")').click();

        await page.locator('input[id="input-dni"]').fill(randomDNI());
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-name"]').fill(faker.person.firstName());
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 	'international' }));
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill('');
        await page.locator('button[type="submit"]').click();

        const errorMessage = page.locator('span.text-red-400', { hasText: 'Ingrese un email válido.' });
        await expect(errorMessage).toBeVisible({ timeout: 15000 });
	});

    /////////////////// Datos invalidos

    test('Email invalido', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');

        await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
        await page.locator('button:has-text("Nuevo Docente")').click();

        await page.locator('input[id="input-dni"]').fill(randomDNI());
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-name"]').fill(faker.person.firstName());
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 	'international' }));
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill('academiagmail.com');
        await page.locator('button[type="submit"]').click();

        const errorMessage = page.locator('span.text-red-400', { hasText: 'Ingrese un email válido.' });
        await expect(errorMessage).toBeVisible({ timeout: 15000 });
    });

    test('Ingreso no valido de numero de telefono menor a 8 ', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');

        await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
        await page.locator('button:has-text("Nuevo Docente")').click();

        await page.locator('input[id="input-dni"]').fill(randomDNI());
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-name"]').fill(faker.person.firstName());
        await page.locator('input[id="input-phoneNumber"]').fill('1234567');
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill('academiagmail.com');
        await page.locator('button[type="submit"]').click();

        const errorMessage = page.locator('span.text-red-400', { hasText: 'Ingrese un teléfono válido.' });
        await expect(errorMessage).toBeVisible({ timeout: 15000 });
    });

    test('Ingreso no valido de dni menor a 7 ', async ({ page }) => {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/');

        await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
        await page.locator('button:has-text("Nuevo Docente")').click();

        await page.locator('input[id="input-dni"]').fill('123456');
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-name"]').fill(faker.person.firstName());
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 	'international' }));
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill('academiagmail.com');
        await page.locator('button[type="submit"]').click();

        const errorMessage = page.locator('span.text-red-400', { hasText: 'Ingrese un DNI válido.' });
        await expect(errorMessage).toBeVisible({ timeout: 15000 });
    });

	test('Alta de un dni ya existente ', async ({ page }) => {
  	    await login(page, '33333333', 'admin');
        await page.waitForURL('/');

        await page.getByRole('navigation').getByRole('link', { name: 'Docente' }).first().click();
        await page.locator('button:has-text("Nuevo Docente")').click();

 	    await page.locator('input[id="input-dni"]').fill('22222222');
        await page.locator('input[id="input-lastName"]').fill(faker.person.lastName());
        await page.locator('input[id="input-name"]').fill(faker.person.firstName());
        await page.locator('input[id="input-phoneNumber"]').fill(faker.phone.number({ style: 	'international' }));
        await page.locator('input[id="input-address"]').fill(faker.location.streetAddress({ useFullAddress: true }));
        await page.locator('input[id="input-email"]').fill('academiagmail.com');
        await page.locator('button[type="submit"]').click();

        page.on('dialog', dialog => {
            expect(dialog.message()).toBe('Ya existe un docente con ese dni');
            dialog.dismiss();
        }
        );
	 });

});

