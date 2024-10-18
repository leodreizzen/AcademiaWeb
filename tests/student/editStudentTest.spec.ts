import { test, expect } from '@playwright/test';
import { login } from '@/helpersTest/loginHelper';
import { randomDNI, searchStudentByDni, createStudentWithDefaultParents } from '@/helpersTest/studentHelper';
import { getFirstPersonDetails, getPersonDetails } from '@/helpersTest/infoHelper';
import { getTestUser } from "../testdata";
import { loginAsTestUser } from "../testutils";
import { faker } from '@faker-js/faker/locale/es_MX';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

const dniDefaultStudent = getTestUser("student").dni.toString();

test.describe('Testing editar alumno', () => {

    test('Modificar alumno con todos los datos validos', async ({ page }) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        await page.getByRole('link', { name: 'Alumnos' }).first().click();
        await page.getByRole('button', { name: 'Nuevo Alumno' }).first().click();
        const dni = await createStudentWithDefaultParents(page);
        await page.waitForTimeout(1000);
        await searchStudentByDni(page, dni);
        await page.waitForTimeout(1000);
        await page.getByRole('button', { name: 'Editar' }).click();

        





        



    });

    test('Verificar detalles del primer alumno', async ({ page }) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        await page.getByRole('link', { name: 'Alumnos' }).first().click();
        await page.waitForTimeout(1000);

        const { name: expectedName, dni: expectedDNI } = await getFirstPersonDetails(page);
        await page.locator('.rounded-xl button:has-text("Ver")').first().click();
        const { fullName: resultFullName, dni: resultDni } = await getPersonDetails(page);
        await expect(resultFullName).toBe(expectedName);
        await expect(resultDni).toBe(expectedDNI);
    });
});