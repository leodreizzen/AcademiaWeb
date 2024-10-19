import { test, expect, request, APIRequest, APIResponse, Browser } from '@playwright/test';
import { loginAsTestUser } from '../testutils';
import { login } from '@/helpersTest/loginHelper';
import { getTestUser } from '../testdata';
import { time } from 'console';
import { TestEmailsAPIResponse } from '@/app/api/internal/test-emails/types';
import exp from 'constants';
import { browser } from 'process';


test.beforeEach(async ({ page,browserName }) => {
    await page.goto('/');
})

const teacher = getTestUser("teacher");
const date = new Date();
const todayDate = date.getDate().toString().padStart(2, '0') + (date.getMonth() + 1).toString().padStart(2, '0') + date.getFullYear().toString();
const futureDate = '01092099'
test.describe('Testing new reprimand', () => {
    test('Nueva amonestacion individual', async ({ page,browserName }) => {
        await login(page, teacher.dni.toString(), teacher.password);
        (await request.newContext()).post('/api/internal/test-emails').then((response: APIResponse) => response.json());
        await page.waitForURL('/');
        page.getByRole('navigation').getByRole('link', { name: 'Amonestaciones' }).click();
        await page.getByRole('button', { name: 'Agregar Amonestación' }).click();
        await page.getByText('Seleccionar el año').click();
        await page.getByText('1º año').click();
        await page.waitForTimeout(5000);
        if ( browserName === 'webkit') {
            await page.locator('div').filter({ hasText: /^Buscar alumnos$/ }).nth(2).click();
        }
        else {    

        await page.locator('#input-students').click();
        }
        await page.getByRole('option', { name: 'Axel Berge (14141414)' }).click();
        await page.waitForTimeout(2000);


        await expect(page.getByText('A. Berge')).toBeVisible();
        const message = "Le pego a un compañero (Caso de prueba)"
        await page.locator('textarea').fill(message);
        page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Amonestación creada con éxito');
            await dialog.accept();
        });
        await page.locator('button[type="submit"]').click();

        await page.waitForTimeout(1000);

        page.getByRole('navigation').getByRole('link', { name: 'Amonestaciones' }).click();

        /**
         * 
         * await page.locator('#initDate').type(todayDate);
        await page.locator('#endDate').type(todayDate);
        await page.locator('#initDate').type(todayDate);


        await page.getByRole('button', { name: 'Buscar' }).click();

        await page.waitForTimeout(5000);

         * 
         * 
         */

        await page.waitForTimeout(5000);
        
        await page.getByText('Ver Detalle').first().click();

        await expect(page.getByText(message)).toBeVisible();

        const mails: TestEmailsAPIResponse = await (await request.newContext()).post('/api/internal/test-emails').then((response: APIResponse) => response.json());

        mails.forEach((mail) => {
            expect(mail.subject).toBe('Notificación de amonestación');
            expect(mail.props.sanctionReason).toBe(message);
            expect(mail.from).toBe('AcedemiaWeb <amonestaciones@academiaweb.tech>');
        });



    });

    test('Nueva amonestacion grupal', async ({ page,browserName }) => {
        await login(page, teacher.dni.toString(), teacher.password);
        (await request.newContext()).post('/api/internal/test-emails').then((response: APIResponse) => response.json());
        
        await page.waitForURL('/');
        page.getByRole('navigation').getByRole('link', { name: 'Amonestaciones' }).click();
        await page.getByRole('button', { name: 'Agregar Amonestación' }).click();
        await page.getByText('Seleccionar el año').click();
        await page.getByText('5º año').click();
        if ( browserName === 'webkit') {
            await page.locator('div').filter({ hasText: /^Buscar alumnos$/ }).nth(2).click();
        }
        else {    

        await page.locator('#input-students').click();
        }
        await page.getByText('Seleccionar todos').click();
        await page.waitForTimeout(2000);

        const message = "Le pego a un compañero (Caso de prueba)"
        await page.locator('textarea').fill(message);
        page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('Amonestación creada con éxito');
            await dialog.accept();
        });
        await page.locator('button[type="submit"]').click();

        await page.waitForTimeout(5000);
        await page.goto('/reprimand');
        await page.waitForURL('/reprimand');
        /**
         *
         * await page.locator('#initDate').type(todayDate);
        await page.locator('#endDate').type(todayDate);
        await page.locator('#initDate').type(todayDate);


        await page.getByRole('button', { name: 'Buscar' }).click();

        await page.waitForTimeout(5000);
 
         */
        
        await page.getByText('Ver Detalle').first().click();
        
        await expect(page.getByText(message)).toBeVisible();

        const mails: TestEmailsAPIResponse = await (await request.newContext()).post('/api/internal/test-emails').then((response: APIResponse) => response.json());

        mails.forEach((mail) => {
            expect(mail.subject).toBe('Notificación de amonestación');
            expect(mail.props.sanctionReason).toBe(message);
            expect(mail.from).toBe('AcedemiaWeb <amonestaciones@academiaweb.tech>');
        });



    });

    test('Amonestacion vacia (Caso Negativo)', async ({ page,browserName }) => {
        await login(page, teacher.dni.toString(), teacher.password);
        (await request.newContext()).post('/api/internal/test-emails').then((response: APIResponse) => response.json());
        
        await page.waitForURL('/');
        page.getByRole('navigation').getByRole('link', { name: 'Amonestaciones' }).click();
        await page.getByRole('button', { name: 'Agregar Amonestación' }).click();
        await page.getByText('Seleccionar el año').click();
        await page.getByText('5º año').click();
        if ( browserName === 'webkit') {
            await page.locator('div').filter({ hasText: /^Buscar alumnos$/ }).nth(2).click();
        }
        else {    

        await page.locator('#input-students').click();
        }
        
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(5000);
        expect(page.getByText('Selecciona al menos un estudiante')).toBeVisible();
        expect(page.getByText('Escribe un mensaje')).toBeVisible();



    });

    test('Amonestacion sin texto (Caso Negativo)', async ({ page,browserName }) => {
        await login(page, teacher.dni.toString(), teacher.password);
        (await request.newContext()).post('/api/internal/test-emails').then((response: APIResponse) => response.json());
        
        await page.waitForURL('/');
        page.getByRole('navigation').getByRole('link', { name: 'Amonestaciones' }).click();
        await page.getByRole('button', { name: 'Agregar Amonestación' }).click();
        await page.getByText('Seleccionar el año').click();
        await page.getByText('5º año').click();
        if ( browserName === 'webkit') {
            await page.locator('div').filter({ hasText: /^Buscar alumnos$/ }).nth(2).click();
        
        }
        else {    

        await page.locator('#input-students').click();
        await page.locator('#input-students').fill('');
            
    }
        await page.waitForTimeout(5000);

        await page.getByText('Seleccionar todos').click();
        
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(5000);
        expect(page.getByText('Escribe un mensaje')).toBeVisible();



    });

    test('Amonestacion sin curso y año pero con mensaje (Caso Negativo)', async ({ page,browserName }) => {
        await login(page, teacher.dni.toString(), teacher.password);
        (await request.newContext()).post('/api/internal/test-emails').then((response: APIResponse) => response.json());
        await page.waitForURL('/');
        page.getByRole('navigation').getByRole('link', { name: 'Amonestaciones' }).click();
        await page.getByRole('button', { name: 'Agregar Amonestación' }).click();
        
        
        const message = "No pasa"
        await page.locator('textarea').fill(message);
        
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(5000);
        expect(page.getByText('Selecciona al menos un estudiante')).toBeVisible();
        expect(page.getByText('Selecciona un curso')).toBeVisible();



    });

    test('Amonestacion sin alumnos (Caso Negativo)', async ({ page,browserName }) => {
        await login(page, teacher.dni.toString(), teacher.password);
        (await request.newContext()).post('/api/internal/test-emails').then((response: APIResponse) => response.json());
        
        await page.waitForURL('/');
        page.getByRole('navigation').getByRole('link', { name: 'Amonestaciones' }).click();
        await page.getByRole('button', { name: 'Agregar Amonestación' }).click();
        await page.getByText('Seleccionar el año').click();
        await page.getByText('5º año').click();
        if ( browserName === 'webkit') {
            await page.locator('div').filter({ hasText: /^Buscar alumnos$/ }).nth(2).click();
        
        }
        else {    

        await page.locator('#input-students').click();
        await page.locator('#input-students').fill('');
            
    }
       
        const message = "No pasa"
        await page.locator('textarea').fill(message);
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(5000);

        expect(page.getByText('Selecciona al menos un estudiante')).toBeVisible();



    });


/**
 *  test('Busqueda donde no haya amonestaciones', async ({ page,browserName }) => {

        await login(page, teacher.dni.toString(), teacher.password);
        (await request.newContext()).post('/api/internal/test-emails').then((response: APIResponse) => response.json());
        
        await page.waitForURL('/');
        page.getByRole('navigation').getByRole('link', { name: 'Amonestaciones' }).click();
        
        await page.locator('#initDate').type(futureDate);
        await page.locator('#endDate').type(futureDate);
        await page.locator('#initDate').type(futureDate);

        await page.getByRole('button', { name: 'Buscar' }).click();

        await page.waitForTimeout(5000);

        expect(page.getByText('No se encontraron sanciones para la fecha seleccionada.')).toBeVisible();






        


    });
 */
   


    


});
