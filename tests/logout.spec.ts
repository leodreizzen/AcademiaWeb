import { test, expect } from '@playwright/test';
import { login } from '../src/helpersTest/loginHelper';
import {getTestUser} from "./testdata";

test.beforeEach(async ({page}) => {
    await page.goto('/');
  })

  test.describe('Testing logout', () => {

    test('Logout exitoso admin', async ({ page })=> {
        const administrator = getTestUser("administrator")
        await login(page, administrator.dni.toString(), administrator.password);
        await page.waitForURL('/');

        const viewportSize = await page.viewportSize();
  
        if (viewportSize && viewportSize.width > 768) {
            const menuButton = page.locator('button[aria-haspopup="menu"]');
            await menuButton.click();

            await page.waitForTimeout(300);

            const logoutButton = page.locator('text=Cerrar sesión');
            await logoutButton.click();

            await page.waitForURL('/login');
            await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();
        }
        else{
            const menuButton = page.locator('button[data-testid="abrir-menu"]');
            await menuButton.click(); 

            const logoutButton = page.locator('text=Cerrar sesión');
            await logoutButton.click();

            await page.waitForURL('/login');
            await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();
            }
    });
    
    test('Logout exitoso alumno', async ({ page })=> {
        const student = getTestUser("student")
        await login(page, student.dni.toString(), student.password);
        await page.waitForURL('/');

        const viewportSize = await page.viewportSize();
  
        if (viewportSize && viewportSize.width > 768) {
            const menuButton = page.locator('button[aria-haspopup="menu"]');
            await menuButton.click();

            await page.waitForTimeout(300);

            const logoutButton = page.locator('text=Cerrar sesión');
            await logoutButton.click();

            await page.waitForURL('/login');
            await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();
        }
        else{
            const menuButton = page.locator('button[data-testid="abrir-menu"]');
            await menuButton.click(); 

            const logoutButton = page.locator('text=Cerrar sesión');
            await logoutButton.click();

            await page.waitForURL('/login');
            await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();
            }
    });

    test('Logout exitoso padre', async ({ page })=> {
        const parent = getTestUser("parent")
        await login(page, parent.dni.toString(), parent.password);
        await page.waitForURL('/');

        const viewportSize = await page.viewportSize();
  
        if (viewportSize && viewportSize.width > 768) {
            const menuButton = page.locator('button[aria-haspopup="menu"]');
            await menuButton.click();
    
            await page.waitForTimeout(300);
    
            const logoutButton = page.locator('text=Cerrar sesión');
            await logoutButton.click();
    
            await page.waitForURL('/login');
            await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();
        }
        else{
            const menuButton = page.locator('button[data-testid="abrir-menu"]');
            await menuButton.click(); 

            const logoutButton = page.locator('text=Cerrar sesión');
            await logoutButton.click();

            await page.waitForURL('/login');
            await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();
        }
    });

    test('Logout exitoso profesor', async ({ page })=> {
        const teacher = getTestUser("teacher")
        await login(page, teacher.dni.toString(), teacher.password.toString());
        await page.waitForURL('/');

        const viewportSize = await page.viewportSize();
  
        if (viewportSize && viewportSize.width > 768) {
            const menuButton = page.locator('button[aria-haspopup="menu"]');
            await menuButton.click();

            await page.waitForTimeout(300);

            const logoutButton = page.locator('text=Cerrar sesión');
            await logoutButton.click();

            await page.waitForURL('/login');
            await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();
        }
        else{
            const menuButton = page.locator('button[data-testid="abrir-menu"]');
            await menuButton.click(); 

            const logoutButton = page.locator('text=Cerrar sesión');
            await logoutButton.click();

            await page.waitForURL('/login');
            await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();
        }
    });
    
    ////////////////////////////

    test('Después de cerrar sesión, navegar hacia adelante mantiene al usuario en la página de inicio de sesión', async ({ page }) => {

        const administrator = getTestUser("administrator")
        await login(page, administrator.dni.toString(), administrator.password);
        await page.waitForURL('/');

        const viewportSize = await page.viewportSize();
  
        if (viewportSize && viewportSize.width > 768) {
            const menuButton = page.locator('button[aria-haspopup="menu"]'); 
            await menuButton.click(); 
        
            const logoutButton = page.locator('text=Cerrar sesión');
            await logoutButton.click(); 
        
            await expect(page).toHaveURL('/login'); 
            await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();
        
            await page.goForward();
            await expect(page).toHaveURL('/login');
        }
        else{
            const menuButton = page.locator('button[data-testid="abrir-menu"]');
            await menuButton.click(); 

            const logoutButton = page.locator('text=Cerrar sesión');
            await logoutButton.click();

            await page.waitForURL('/login');
            await expect(page.locator('h3:has-text("Iniciar sesión")')).toBeVisible();
            await page.goForward();
            await expect(page).toHaveURL('/login');
        }
      });

  });