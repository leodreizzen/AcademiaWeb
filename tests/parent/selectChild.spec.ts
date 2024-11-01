import {test, expect} from '@playwright/test';
import {loginAsTestUser} from "../testutils";

test.beforeEach(async ({page}) => {
    await page.goto('/');
});

test.describe('Testing seleccion hijo', () => {

    test('Padre con un unico hijo.', async ({page}) => {
        await loginAsTestUser(page, 'parent');
        await page.waitForURL('/');

        const welcomeMessage = await page.locator('h1:has-text("Bienvenido a AcademiaWeb")');
        await expect(welcomeMessage).toBeVisible();
        await expect(page.locator('button:has-text("Padre")')).toBeVisible();
        await expect(page.locator('button:has-text("Alumno:")')).toBeVisible();
    });

    test('Padre con un unico hijo no debe tener disponible el boton de cambiar de hijo.', async ({page}) => {
        await loginAsTestUser(page, 'parent');
        await page.waitForURL('/');
        await expect(page.locator('button:has-text("Padre")')).toBeVisible();
        await expect(page.locator('button:has-text("Alumno:")')).toBeVisible();
        await page.click('button[aria-haspopup="menu"]');
        const cambiarAlumnoLocator = page.locator('text=Cambiar alumno');
        await expect(cambiarAlumnoLocator).not.toBeVisible();
    });

    test('Padre con mas de un hijo, selecciono el primero.', async ({page}) => {
        await loginAsTestUser(page, 'secondParent');
        await page.waitForURL(/\/selectstudent(\?.*)?$/); 
        const firstStudentButton = await page.locator('.space-y-3 button').first(); 
        const studentName = (await firstStudentButton.locator('span.text-lg').textContent())?.trim() || 'Nombre desconocido'; 
        await firstStudentButton.click();
        await page.waitForURL('/');

        await expect(page.locator(`button:has-text("Alumno: ${studentName.trim()}")`)).toBeVisible();
    });

    test('Padre con mas de un hijo, selecciono alguno vuelvo atras y selecciono otro.', async ({page}) => {
        await loginAsTestUser(page, 'secondParent');
        await page.waitForURL(/\/selectstudent(\?.*)?$/); 
        const firstStudentButton = await page.locator('.space-y-3 button').first(); 
        const firstStudentName = (await firstStudentButton.locator('span.text-lg').textContent())?.trim() || 'Nombre desconocido'; 
        await firstStudentButton.click();
        await page.waitForURL('/');
        await expect(page.locator(`button:has-text("Alumno: ${firstStudentName.trim()}")`)).toBeVisible();

        await page.goBack();
        await page.waitForURL(/\/selectstudent(\?.*)?$/); 

        const lastStudentButton = await page.locator('.space-y-3 button').last();
        const lastStudentName = (await lastStudentButton.locator('span.text-lg').textContent())?.trim() || 'Nombre desconocido'; 
        await lastStudentButton.click();
        await page.waitForURL('/');
        await expect(page.locator(`button:has-text("Alumno: ${ lastStudentName.trim()}")`)).toBeVisible();
    });

    test('Padre con mas de un hijo, selecciono alguno y con la opcion Cambiar alumno elijo otro.', async ({page}) => {
        await loginAsTestUser(page, 'secondParent');
        await page.waitForURL(/\/selectstudent(\?.*)?$/); 
        const firstStudentButton = await page.locator('.space-y-3 button').first(); 
        const firstStudentName = (await firstStudentButton.locator('span.text-lg').textContent())?.trim() || 'Nombre desconocido'; 
        await firstStudentButton.click();
        await page.waitForURL('/');
        await expect(page.locator(`button:has-text("Alumno: ${firstStudentName.trim()}")`)).toBeVisible();

        await page.click('button[aria-haspopup="menu"]');
        const cambiarAlumnoLocator = page.locator('text=Cambiar alumno');
        await expect(cambiarAlumnoLocator).toBeVisible();
        await cambiarAlumnoLocator.click(); 

        await page.waitForURL('/selectstudent');

        const lastStudentButton = await page.locator('.space-y-3 button').last();
        const lastStudentName = (await lastStudentButton.locator('span.text-lg').textContent())?.trim() || 'Nombre desconocido'; 
        await lastStudentButton.click();
        await page.waitForURL('/');
        await expect(page.locator(`button:has-text("Alumno: ${ lastStudentName.trim()}")`)).toBeVisible();
    });

    test('Inicio sesion , elijo rol de padre sin hijos. Muestra mensaje de error', async ({page}) => {
        await loginAsTestUser(page, 'parentTeacherAdmin');
        await page.waitForURL(/\/selectrole(\?.*)?$/); 
        
        const parentButton = page.locator('button:has-text("Padre")');
        await  parentButton.click();

        const errorMessage = page.locator('h1:has-text("No tienes alumnos asignados")');
        const logoutButton = page.locator('button:has-text("Cerrar sesión")');
    
        await expect(errorMessage).toBeVisible();
        await expect(logoutButton).toBeVisible();
    });

    test('Inicio sesion, elijo rol de padre sin hijos. No es posible ir a homepage cambiando la url', async ({page}) => {
        await loginAsTestUser(page, 'parentTeacherAdmin');
        await page.waitForURL(/\/selectrole(\?.*)?$/); 
        
        const parentButton = page.locator('button:has-text("Padre")');
        await  parentButton.click();

        const errorMessage = page.locator('h1:has-text("No tienes alumnos asignados")');
        await expect(errorMessage).toBeVisible();
        await page.goto('/');
        await expect(errorMessage).toBeVisible();
    });
});