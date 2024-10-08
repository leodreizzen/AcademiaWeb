import {test, expect} from '@playwright/test';
import {login} from '@/helpersTest/loginHelper';
import {searchParentByDni} from '@/helpersTest/parentHelper';
import {getFirstPersonDetails, getPersonDetails} from '@/helpersTest/infoHelper';
import {loginAsTestUser} from "../testutils";
import {getTestUser} from "../testdata";

test.beforeEach(async ({page}) => {
    await page.goto('/');
});

const dniDefaultParent = getTestUser('parent').dni.toString();

test.describe('Testing info padre', () => {

    test('info correspondiente a un padre desde rol administrador', async ({page}) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        await page.getByRole('link', {name: 'Padres'}).first().click();
        const result = await searchParentByDni(page, dniDefaultParent);
        expect(result).toBeTruthy();

        const viewButton = page.locator('button:has-text("Ver")');
        await viewButton.click();

        await page.waitForSelector('div:has-text("DNI")');
        const resultDni = page.locator('div:has-text("DNI")').locator('p.text-lg');
        await expect(resultDni.first()).toHaveText(dniDefaultParent);
    });

    test('Verificar detalles del primer padre', async ({page}) => {

        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        await page.getByRole('link', {name: 'Padres'}).first().click();
        await page.waitForTimeout(1000);
        const {name: expectedName, dni: expectedDNI} = await getFirstPersonDetails(page);
        await page.locator('.rounded-xl button:has-text("Ver")').first().click();
        const {fullName: resultFullName, dni: resultDni} = await getPersonDetails(page);
        await expect(resultFullName).toBe(expectedName);
        await expect(resultDni).toBe(expectedDNI);
    });
});

