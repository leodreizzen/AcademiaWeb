import { expect, test } from "@playwright/test";
import { Faker, es } from '@faker-js/faker'
import { login } from '@/helpersTest/loginHelper';
import { searchStudentByDni, searchStudentByLastName } from '@/helpersTest/studentHelper';
import {getTestUser} from "../testdata";

const faker = new Faker({ locale: [es] })


test.beforeEach(async ({page}) => {
    await page.goto('/');
})

const studentToSearch = getTestUser("student")
const admin = getTestUser("administrator")

test.describe('Testing buscar estudiante', () => {
    
        test('Busqueda por DNI exitosa', async ({ page })=> {
            await login(page, admin.dni.toString(), admin.password);
            await page.waitForURL('/')
    
            const studentsLink = page.locator('a[href="/student"]');
            await studentsLink.click();
    
            const result = await searchStudentByDni(page, studentToSearch.dni.toString());
            expect(result).toBeTruthy();
        });
    
        test('Busqueda por Apellido exitosa', async ({ page })=> {
            await login(page, admin.dni.toString(), admin.password);
            await page.waitForURL('/')
    
    
            const studentsLink = page.locator('a[href="/student"]');
            await studentsLink.click();
    
            const result = await searchStudentByLastName(page, studentToSearch.lastName);
            expect(result).toBeTruthy();
        });
    
        test('Busqueda de apellido no existente', async ({ page })=> {
            await login(page, admin.dni.toString(), admin.password);
            await page.waitForURL('/')
    
            const lastName = 'ApellidoInexistente';
    
            const studentsLink = page.locator('a[href="/student"]');
            await studentsLink.click();
    
            const result = await searchStudentByLastName(page, lastName);
            expect(result).toBeFalsy();
        });

        test('Busqueda de DNI no existente', async ({ page })=> {
            await login(page, admin.dni.toString(), admin.password);
            await page.waitForURL('/')
    
            const dni = '9999999999';
    
            const studentsLink = page.locator('a[href="/student"]');
            await studentsLink.click();
    
            const result = await searchStudentByDni(page, dni);
            expect(result).toBeFalsy();
        });

        
    
    });