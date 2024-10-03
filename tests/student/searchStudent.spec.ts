import { expect, test } from "@playwright/test";
import { Faker, es } from '@faker-js/faker'
import { login } from '@/helpersTest/loginHelper';
import { searchStudentByDni, searchStudentByLastName } from '@/helpersTest/studentHelper';

const faker = new Faker({ locale: [es] })


test.beforeEach(async ({page}) => {
    await page.goto('/');
})

const dniSeedeado = '11111111';

const lastNameSeed = 'Dreizzen';

test.describe('Testing buscar estudiante', () => {
    
        test('Busqueda por DNI exitosa', async ({ page })=> {
            await login(page, '33333333', 'admin');
            await page.waitForURL('/')
    
            const studentsLink = page.locator('a[href="/student"]');
            await studentsLink.click();
    
            const result = await searchStudentByDni(page, dniSeedeado);
            expect(result).toBeTruthy();
        });
    
        test('Busqueda por Apellido exitosa', async ({ page })=> {
            await login(page, '33333333', 'admin');
            await page.waitForURL('/')
    
    
            const studentsLink = page.locator('a[href="/student"]');
            await studentsLink.click();
    
            const result = await searchStudentByLastName(page,lastNameSeed);
            expect(result).toBeTruthy();
        });
    
        test('Busqueda de apellido no existente', async ({ page })=> {
            await login(page, '33333333', 'admin');
            await page.waitForURL('/')
    
            const lastName = 'ApellidoInexistente';
    
            const studentsLink = page.locator('a[href="/student"]');
            await studentsLink.click();
    
            const result = await searchStudentByLastName(page, lastName);
            expect(result).toBeFalsy();
        });

        test('Busqueda de DNI no existente', async ({ page })=> {
            await login(page, '33333333', 'admin');
            await page.waitForURL('/')
    
            const dni = '999999999';
    
            const studentsLink = page.locator('a[href="/student"]');
            await studentsLink.click();
    
            const result = await searchStudentByDni(page, dni);
            expect(result).toBeFalsy();
        });

        
    
    });