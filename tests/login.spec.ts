import { test, expect } from '@playwright/test';
import { loginAsRole } from '../src/helpersTest/loginAsRolHelper';
import { login } from '../src/helpersTest/loginHelper';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test.describe('Testing login', () => {

  test('Login exitoso admin', async ({ page }) => {
    await login(page, '33333333', 'admin');
    await page.waitForURL('/');
    const viewportSize = await page.viewportSize();

    if (viewportSize && viewportSize.width > 768) {
      // Test para desktop
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Alumnos' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Docentes' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Administradores' })).toBeVisible();
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Padres' })).toBeVisible();
      

      await expect(page.getByRole('button', { name: 'Alumnos' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Docentes' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Padres' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Administradores' })).toBeVisible();
    } else {
      // Test para mobile
      const menuButton = page.locator('button[data-testid="abrir-menu"]');
      await menuButton.click();

      const alumnos = page.locator('[data-testid="menu"] *:not(:has(*))', { hasText: 'Alumnos' });
      await expect(alumnos).toBeVisible();

      const docentes = page.locator('[data-testid="menu"] *:not(:has(*))', { hasText: 'Docentes' });
      await expect(docentes).toBeVisible();

      const administradores = page.locator('[data-testid="menu"] *:not(:has(*))', { hasText: 'Administradores' });
      await expect(administradores).toBeVisible();
    }
  });

  test('Login admin dni vacio', async ({ page }) => {
    await login(page, '', 'admin');
    await expect(page.locator('text=Ingresa un DNI válido')).toBeVisible();
  });

  test('Login admin password vacio', async ({ page }) => {
    await login(page, '33333333', '');
    await expect(page.locator('text=Ingresa tu contraseña')).toBeVisible();
  });

  test('Login admin dni incorrecto', async ({ page }) => {
    await login(page, '44665468', 'admin');
    await expect(page.locator('text=El usuario no existe')).toBeVisible();
  });

  test('Login admin contraseña incorrecta', async ({ page }) => {
    await login(page, '33333333', 'aaaa');
    await expect(page.locator('text=Contraseña ingresada es incorrecta')).toBeVisible();
  });

  //////////////////////////////////////////////////////

  test('Login exitoso alumno', async ({ page }) => {
    await login(page, '11111111', 'alumno');
    await page.waitForURL('/');


    const viewportSize = await page.viewportSize();

    if (viewportSize && viewportSize.width > 768) {

      await expect(page.getByRole('navigation').getByRole('link', { name: 'Trabajos prácticos' })).toBeVisible();


      await expect(page.getByRole('button', { name: 'Trabajos prácticos' })).toBeVisible();
    }
    else {
      const menuButton = page.locator('button[data-testid="abrir-menu"]');
      await menuButton.click();

      const trabajosPracticos = page.locator('[data-testid="menu"] *:not(:has(*))', { hasText: 'Trabajos prácticos' });
      await expect(trabajosPracticos).toBeVisible();

      const alumno = page.locator('[data-testid="menu"] *:not(:has(*))', { hasText: 'Alumno' });
      await expect(alumno).toBeVisible();
    }
  });

  test('Login exitoso profesor', async ({ page }) => {
    await login(page, '22222222', 'profesor');
    await page.waitForURL('/');
    const viewportSize = await page.viewportSize();

    if (viewportSize && viewportSize.width > 768) {
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Trabajos prácticos' })).toBeVisible();


      await expect(page.getByRole('button', { name: 'Trabajos prácticos' })).toBeVisible();
      await expect(page.locator('button:has-text("Profesor")')).toBeVisible();
    }
    else {
      const menuButton = page.locator('button[data-testid="abrir-menu"]');
      await menuButton.click();

      const trabajosPracticos = page.locator('[data-testid="menu"] *:not(:has(*))', { hasText: 'Trabajos prácticos' });
      await expect(trabajosPracticos).toBeVisible();

      const profesor = page.locator('[data-testid="menu"] *:not(:has(*))', { hasText: 'Profesor' });
      await expect(profesor).toBeVisible();
    }
  });

  test('Login exitoso padre', async ({ page }) => {
    await login(page, '44444444', 'padre');
    await page.waitForURL('/');
    const viewportSize = await page.viewportSize();

    if (viewportSize && viewportSize.width > 768) {
      await expect(page.getByRole('navigation').getByRole('link', { name: 'Trabajos prácticos' })).toBeVisible();


      await expect(page.getByRole('button', { name: 'Trabajos prácticos' })).toBeVisible();
      await expect(page.locator('button:has-text("Padre")')).toBeVisible();
    }
    else {
      const menuButton = page.locator('button[data-testid="abrir-menu"]');
      await menuButton.click();

      const trabajosPracticos = page.locator('[data-testid="menu"] *:not(:has(*))', { hasText: 'Trabajos prácticos' });
      await expect(trabajosPracticos).toBeVisible();

      const padre = page.locator('[data-testid="menu"] *:not(:has(*))', { hasText: 'Padre' });
      await expect(padre).toBeVisible();
    }
  });

  ///////////////////////////////////////////////

  test('Login padre con rol padre', async ({ page }) => {

    await loginAsRole(page, '66666666', 'padre', 'Padre');
    await page.waitForURL('/');
    const viewportSize = await page.viewportSize();

    if (viewportSize && viewportSize.width > 768) {
      await expect(page.locator('button:has-text("Padre")')).toBeVisible();
    }
    else {
      const menuButton = page.locator('button[data-testid="abrir-menu"]');
      await menuButton.click();

      const padre = page.locator('[data-testid="menu"] *:not(:has(*))', { hasText: 'Padre' });
      await expect(padre).toBeVisible();
    }
  });

  test('Login padre con rol profesor', async ({ page }) => {
    await loginAsRole(page, '66666666', 'padre', 'Profesor');
    await page.waitForURL('/');
    const viewportSize = await page.viewportSize();

    if (viewportSize && viewportSize.width > 768) {
      await expect(page.locator('button:has-text("Profesor")')).toBeVisible();
    }
    else {
      const menuButton = page.locator('button[data-testid="abrir-menu"]');
      await menuButton.click();

      const profesor = page.locator('[data-testid="menu"] *:not(:has(*))', { hasText: 'Profesor' });
      await expect(profesor).toBeVisible();
    }
  });

  test('No es posible cambio de rol volviendo atras', async ({ page }) => {
    await loginAsRole(page, '66666666', 'padre', 'Profesor');
    await page.waitForURL('/');

    const viewportSize = await page.viewportSize();

    if (viewportSize && viewportSize.width > 768) {
      await expect(page.locator('button:has-text("Profesor")')).toBeVisible();
      await page.goBack();
      await expect(page).toHaveURL('/');
      await expect(page.locator('button:has-text("Profesor")')).toBeVisible();
    }
    else {
      const menuButton = page.locator('button[data-testid="abrir-menu"]');
      await menuButton.click();

      const profesor = page.locator('[data-testid="menu"] *:not(:has(*))', { hasText: 'Profesor' });
      await expect(profesor).toBeVisible();

      await page.goBack();
      await expect(page).toHaveURL('/');
      await menuButton.click();
      await expect(profesor).toBeVisible();
    }
  });
});