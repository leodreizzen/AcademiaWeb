import {test, expect} from '@playwright/test';
import {login} from '@/helpersTest/loginHelper';
import {searchParentByDni, searchParentByLastName} from '@/helpersTest/parentHelper';
import {loginAsTestUser} from "../testutils";
import {getTestUser} from "../testdata";


test.beforeEach(async ({page}) => {
        await page.goto('/');
    }
);

const parent = getTestUser('parent');
const DNISeeded = parent.dni.toString();
const LastNameSeeded = parent.lastName;
const FullNameSeeded = parent.firstName + ' ' + parent.lastName;


test.describe('Testing listado parent', () => {


    test('Listado parent buscado por DNI (CASO POSITIVO) ', async ({page}) => {
            await loginAsTestUser(page, 'administrator');
            await page.waitForURL('/');
            await page.getByRole('navigation').getByRole('link', {name: 'Responsables'}).click();
            await page.waitForURL('/parent', {waitUntil: 'domcontentloaded'});
            await expect(await searchParentByDni(page, DNISeeded)).toBeTruthy();
        }
    );

    test('Listado parent buscado por DNI (CASO NEGATIVO) ', async ({page}) => {
            await loginAsTestUser(page, 'administrator');
            await page.waitForURL('/');
            await page.getByRole('navigation').getByRole('link', {name: 'Responsables'}).click();
            await page.waitForURL('/parent', {waitUntil: 'domcontentloaded'});
            await expect(await searchParentByDni(page, '123456789')).toBeFalsy();
            expect (await page.isVisible(`text=${'No se encontraron responsables con esos filtros'}`,{timeout:1000})).toBeTruthy();
        }
    );

    test('Listado parent buscado por Apellido (CASO POSITIVO) ', async ({page}) => {
            await loginAsTestUser(page, 'administrator');
            await page.waitForURL('/');
            await page.getByRole('navigation').getByRole('link', {name: 'Responsables'}).click();
            await expect(await searchParentByLastName(page, LastNameSeeded)).toBeTruthy();
        }
    );

    test('Listado parent buscado por Apellido (CASO NEGATIVO) ', async ({page}) => {
            await loginAsTestUser(page, 'administrator');
            await page.waitForURL('/');
            await page.getByRole('navigation').getByRole('link', {name: 'Responsables'}).click();
            await expect(await searchParentByLastName(page, 'asdasdasdasdasdasd')).toBeFalsy();
            expect (await page.isVisible(`text=${'No se encontraron responsables con esos filtros'}`,{timeout:1000})).toBeTruthy();
        }
    );

    test('Busqueda de padre por DNI todo 0', async ({page}) => {
            await loginAsTestUser(page, 'administrator');
            await page.waitForURL('/');
            await page.getByRole('navigation').getByRole('link', {name: 'Responsables'}).click();
            await expect(await searchParentByDni(page, '000000000')).toBeFalsy();
            expect (await page.isVisible(`text=${'No se encontraron responsables con esos filtros'}`,{timeout:1000})).toBeTruthy();
        });

});