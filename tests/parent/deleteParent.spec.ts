import {test, expect} from '@playwright/test';
import {searchParentByDni} from '@/helpersTest/parentHelper';
import { createParentWithOnlyOneChild,createChildrenWithTwoParents,createParentWithoutChildren } from '@/helpersTest/parentHelper';

import {loginAsTestUser} from "../testutils";
import {getTestUser} from "../testdata";

test.beforeEach(async ({page}) => {
    await page.goto('/');
});

const dniDefaultParent = getTestUser('parent').dni.toString();

test.describe('Testing delete parent', () => {

    test('Borrar padre con 0 hijos (Caso de exito)', async ({page}) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        const parentDni = await createParentWithoutChildren(page);
        await page.waitForTimeout(1000);

        await page.goto('/');
        await page.waitForURL('/');
        await page.getByRole('link', {name: 'Responsables'}).first().click();

        await page.waitForTimeout(1000);
        expect(await searchParentByDni(page, parentDni)).toBeTruthy();

        const deleteButton = page.locator('button:has-text("Borrar")');

        await deleteButton.click();

        await page.waitForTimeout(10000);

        expect(await searchParentByDni(page, parentDni)).toBeFalsy();

        const menuButton = page.locator('button[aria-haspopup="menu"]');
        await menuButton.click();

        await page.waitForTimeout(300);

        const logoutButton = page.locator('text=Cerrar sesión');
        await logoutButton.click();

        await page.waitForTimeout(300);

        await page.waitForURL('/login');

        await page.fill('input[name="dni"]', parentDni);
        await page.fill('input[name="password"]', parentDni);
        await page.click('button[type="submit"]');

        await expect(page.locator('body')).toContainText('El usuario no existe');

    });

    test('Borrar padre con 1 hijo donde el hijo tiene 2 padres (Caso de exito)', async ({page}) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        const parentDni = await createChildrenWithTwoParents(page);
        await page.waitForTimeout(1000);

        await page.goto('/');
        await page.waitForURL('/');

        await page.getByRole('link', {name: 'Responsables'}).first().click();
        await page.waitForTimeout(1000);
        expect(await searchParentByDni(page, parentDni)).toBeTruthy();

        const deleteButton = page.locator('button:has-text("Borrar")');

        await deleteButton.click();

        await page.waitForTimeout(10000);

        expect(await searchParentByDni(page, parentDni)).toBeFalsy();
    
        const menuButton = page.locator('button[aria-haspopup="menu"]');
        await menuButton.click();

        await page.waitForTimeout(300);

        const logoutButton = page.locator('text=Cerrar sesión');
        await logoutButton.click();

        await page.waitForTimeout(300);

        await page.waitForURL('/login');

        await page.fill('input[name="dni"]', parentDni);
        await page.fill('input[name="password"]', parentDni);
        await page.click('button[type="submit"]');

        await expect(page.locator('body')).toContainText('El usuario no existe');

    });

    test('Borrar padre con 1 hijo donde el hijo tiene 1 solo padre y es el padre a eliminar (Caso Negativo)', async ({page}) => {
        await loginAsTestUser(page, 'administrator');
        await page.waitForURL('/');
        const parentDni = await createParentWithOnlyOneChild(page);
        await page.waitForTimeout(1000);

        await page.goto('/');
        await page.waitForURL('/');

        await page.getByRole('link', {name: 'Responsables'}).first().click();
        await page.waitForTimeout(1000);
        expect(await searchParentByDni(page, parentDni)).toBeTruthy();

        console.log("Parent DNI: " + parentDni);

        const deleteButton = page.locator('button:has-text("Borrar")');

        page.once('dialog', async dialog => {
            expect(dialog.message()).toBe('No se puede eliminar, hay estudiantes con un solo padre');
            await dialog.accept();
        });

        await deleteButton.click();

        await page.waitForTimeout(10000);

        expect(await searchParentByDni(page, parentDni)).toBeTruthy();


    });


    
});


