import { test, expect } from '@playwright/test';
import { login } from '../src/helpersTest/loginHelper';

test.beforeEach(async ({page}) => {
    await page.goto('/');
   // await page.waitForURL('http://localhost:3000/teacher');
})
  

test.describe('Testing buscar docente', () => {

    test('Busqueda por DNI exitosa', async ({ page })=> {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')
        const dni = '22222222';
        const viewportSize = await page.viewportSize();

        const docentesLink = page.locator('a[href="/teacher"]');
        await docentesLink.click();

        const inputDni = page.locator('input[placeholder="Buscar por DNI"]');
        await inputDni.fill(dni);
        
        const searchButton = page.locator('svg.lucide-search');
        await searchButton.click();
        
        const expectedUrlPattern = new RegExp(`/teacher\\?dni=${dni}&lastName=`);
        await page.waitForURL(expectedUrlPattern);

        expect(page.url()).toContain(`dni=${dni}`);

        const resultDni = page.locator(`text=DNI: ${dni}`);
        await expect(resultDni).toBeVisible();
    });

    test('Busqueda por Apellido exitosa', async ({ page })=> {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')

        const apellido = 'Pepita';

        const docentesLink = page.locator('a[href="/teacher"]');
        await docentesLink.click();

        const inputApellido = page.locator('input[placeholder="Buscar por Apellido"]');
        await inputApellido.fill(apellido);
        
        const searchButton = page.locator('svg.lucide-search');
        await searchButton.click();
        
        const expectedUrlPattern = new RegExp(`/teacher\\?dni=&lastName=${apellido}`);
        await page.waitForURL(expectedUrlPattern);

        const resultApellido = page.locator(`text=${apellido}`);
        await expect(resultApellido).toBeVisible();
    });

    test('Busqueda de apellido no existente', async ({ page })=> {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')

        const apellido = 'asdf';
        //Test para desktop
        const docentesLink = page.locator('a[href="/teacher"]');
        await docentesLink.click();

        const inputApellido = page.locator('input[placeholder="Buscar por Apellido"]');
        await inputApellido.fill(apellido);

        const searchButton = page.locator('svg.lucide-search');
        await searchButton.click();

        const expectedUrlPattern = new RegExp(`/teacher\\?dni=&lastName=${apellido}`);
        await page.waitForURL(expectedUrlPattern);

        const resultApellido = page.locator(`text=${apellido}`);
        await expect(resultApellido).not.toBeVisible();
    });

    test('Busqueda de dni no existente', async ({ page })=> {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')

        const dni = '01111111';
        //Test para desktop
        const docentesLink = page.locator('a[href="/teacher"]');
        await docentesLink.click();

        const inputDni = page.locator('input[placeholder="Buscar por DNI"]');
        await inputDni.fill(dni);

        const searchButton = page.locator('svg.lucide-search');
        await searchButton.click();

        const expectedUrlPattern = new RegExp(`/teacher\\?dni=${dni}&lastName=`);
        await page.waitForURL(expectedUrlPattern);
    
        const resultDni = page.locator(`text=DNI: ${dni}`);
        await expect(resultDni).not.toBeVisible();
    });
    
    test('Busqueda unica por apellido apesar de escribir en dni ', async ({ page })=> {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')

        const dni = '77777777';
        //Test para desktop
        const docentesLink = page.locator('a[href="/teacher"]');
        await docentesLink.click();

        const inputDni = page.locator('input[placeholder="Buscar por DNI"]');
        await inputDni.fill(dni);

        const inputApellido = page.locator('input[placeholder="Buscar por Apellido"]');
        await inputApellido.click();
       
        const apellido = 'Pepito';
        await inputApellido.fill(apellido);
        await expect(inputDni).toHaveValue('');

        const searchButton = page.locator('svg.lucide-search');
        await searchButton.click();
      
        const expectedUrlPattern = new RegExp(`/teacher\\?dni=&lastName=${apellido}`);
        await page.waitForURL(expectedUrlPattern);

        const resultApellido = page.locator(`text=${apellido}`);
        await expect(resultApellido).toBeVisible();
    });

    test('Busqueda unica por dni apesar de escribir en apellido ', async ({ page })=> {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')

        const apellido = 'Pepito';

        const docentesLink = page.locator('a[href="/teacher"]');
        await docentesLink.click();

        const inputApellido = page.locator('input[placeholder="Buscar por Apellido"]');
        await inputApellido.click();
        await inputApellido.fill(apellido);
      
        const dni = '77777777';
        const inputDni = page.locator('input[placeholder="Buscar por DNI"]');
        await inputDni.click();
        await inputDni.fill(dni);
       
        await expect(inputApellido).toHaveValue('');

        const searchButton = page.locator('svg.lucide-search');
        await searchButton.click();

        const expectedUrlPattern = new RegExp(`/teacher\\?dni=${dni}&lastName=`);
        await page.waitForURL(expectedUrlPattern);

        expect(page.url()).toContain(`dni=${dni}`);

        const resultDni = page.locator(`text=DNI: ${dni}`);
        await expect(resultDni).toBeVisible();
    });

    test('Luego de busqueda valida por dni volver a buscar otro dni ', async ({ page })=> {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')

        const dni = '22222222';
        const viewportSize = await page.viewportSize();

        const docentesLink = page.locator('a[href="/teacher"]');
        await docentesLink.click();

        var inputDni = page.locator('input[placeholder="Buscar por DNI"]');
        await inputDni.fill(dni);
        
        var searchButton = page.locator('svg.lucide-search');
        await searchButton.click();
        
        var expectedUrlPattern = new RegExp(`/teacher\\?dni=${dni}&lastName=`);
        await page.waitForURL(expectedUrlPattern);

        const otroDni = '77777777';
        inputDni = page.locator('input[placeholder="Buscar por DNI"]');
        await inputDni.fill(otroDni);

        searchButton = page.locator('svg.lucide-search');
        await searchButton.click();
        
        expectedUrlPattern = new RegExp(`/teacher\\?dni=${otroDni}&lastName=`);
        await page.waitForURL(expectedUrlPattern);

        expect(page.url()).toContain(`dni=${otroDni}`);

        const resultDni = page.locator(`text=DNI: ${otroDni}`);
        await expect(resultDni).toBeVisible();
    });

    test('Luego de busqueda valida por apellido volver a buscar otro apellido', async ({ page })=> {
        await login(page, '33333333', 'admin');
        await page.waitForURL('/')

        const apellido = 'Pepito';

        const docentesLink = page.locator('a[href="/teacher"]');
        await docentesLink.click();

        var inputApellido = page.locator('input[placeholder="Buscar por Apellido"]');
        await inputApellido.fill(apellido);
        
        var searchButton = page.locator('svg.lucide-search');
        await searchButton.click();
        
        var expectedUrlPattern = new RegExp(`/teacher\\?dni=&lastName=${apellido}`);
        await page.waitForURL(expectedUrlPattern);

        const otroApellido = 'Delarosa';
        inputApellido = page.locator('input[placeholder="Buscar por Apellido"]');
        await inputApellido.fill( otroApellido);

        searchButton = page.locator('svg.lucide-search');
        await searchButton.click();
        
        var expectedUrlPattern = new RegExp(`/teacher\\?dni=&lastName=${otroApellido}`);
        await page.waitForURL(expectedUrlPattern);

        const resultApellido = page.locator(`text=${otroApellido}`);
        await expect(resultApellido).toBeVisible();
    });
});