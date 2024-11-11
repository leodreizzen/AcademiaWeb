import {expect, test} from "@playwright/test";
import {loginAsRole} from "@/helpersTest/loginAsRolHelper";
import {getTestUser, getTestUserWithRole} from "../testdata";
import {randomBetween} from "@/lib/testing/testUtils";
import {faker} from "@faker-js/faker/locale/es";
import {format} from "date-fns";
import {fillDate} from "../dateUtils";
import {es} from "date-fns/locale/es";

test.beforeEach(async ({page}) => {
    await page.goto('/');
});

const teacher = getTestUserWithRole('teacher', "Teacher");
test.describe.configure({ mode: 'serial' });

test('Crear examen con datos válidos', async ({page}) => {
    await loginAsRole(page, teacher.dni.toString(), teacher.password, 'Profesor');

    await page.locator('html').click();
    await page.getByRole('button', {name: 'Notas de exámenes'}).click();
    await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();

    let subjects: [string, string][]
    if (teacher.subjects === undefined || teacher.subjects.length === 0)
        throw new Error('No hay materias asignadas al docente');
    else
        subjects = teacher.subjects;

    const grade = subjects[0][0]
    const subject = subjects[0][1]
    const subjectNameTab = page.locator('.test-subject-item', {hasText: `${subject} - ${grade}`});
    await subjectNameTab.click();
    let date: Date = new Date();
    let examLocator = subjectNameTab.locator(".test-exam-item", {hasText: format(date, "dd/MM/yyyy")});
    let ready = false;
    while (!ready) {
        date = faker.date.between({from: '2023-01-01', to: new Date()});
        examLocator = subjectNameTab.locator(".test-exam-item", {hasText: format(date, "dd/MM/yyyy")});
        if (!await subjectNameTab.getByText(format(date, "dd/MM/yyyy")).isVisible())
            ready = true;
    }

    await page.getByRole('button', {name: 'Agregar notas'}).click();
    await expect(page.getByRole('heading', {name: 'Seleccionar Materia'})).toBeVisible();
    await page.getByLabel('Año:').click();

    await page.getByLabel(grade).click();
    await page.getByLabel('Materia:').click();
    await page.getByLabel(subject).click();
    await page.getByRole('button', {name: 'Ir'}).click();
    await expect(page.getByRole('heading', {name: "Registrar Examen"})).toBeVisible();

    const studentsLocator = page.getByTestId("student-mark");
    await expect(studentsLocator.first()).toBeVisible(); // at least one student
    const students = await studentsLocator.all();
    const studentsMarks = new Map();

    await fillDate(page, format(date, "yyyy", {locale: es}), format(date, "MMMM", {locale: es}), format(date, "d", {locale: es}));

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const studentName = await student.locator('span').textContent();
        const studentMark = Math.floor(Math.random() * 10) + 1;
        studentsMarks.set(studentName, studentMark);
        await student.locator('input').fill(studentMark.toString());
    }
    let dialogShown = false;
    page.on('dialog', dialog => {
            expect(dialog.message()).toBe('Notas cargadas exitosamente');
            dialog.dismiss();
            dialogShown = true;
        }
    );
    await page.getByRole('button', {name: 'Cargar'}).click();

    await expect.poll(async () => {
        return dialogShown;
    }, {
        intervals: [250],
        timeout: 20000,
    }).toBe(true)

    await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();
    await subjectNameTab.click();
    await expect(examLocator).toBeVisible();
    await examLocator.locator('button').click();

    const modal = page.getByRole("dialog");
    await expect(modal.getByRole('heading', {name: `Notas - ${subject} - ${grade}`})).toBeVisible();
    const examMarks = await modal.locator('tbody').locator("tr").all();
    expect(examMarks.length).toBe(studentsMarks.size);
    for (let i = 0; i < examMarks.length; i++) {
        const examMark = examMarks[i];
        const studentName = await examMark.locator('td').first().textContent();
        const studentMark = await examMark.locator('td').nth(1).textContent();
        expect(studentsMarks.get(studentName).toString()).toBe(studentMark);
    }
})


test('Crear examen sin algunas notas (CASO DE EXITO)', async ({page}) => {
    await loginAsRole(page, teacher.dni.toString(), teacher.password, 'Profesor');

    await page.locator('html').click();
    await page.getByRole('button', {name: 'Notas de exámenes'}).click();
    await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();

    let subjects: [string, string][]
    if (teacher.subjects === undefined || teacher.subjects.length === 0)
        throw new Error('No hay materias asignadas al docente');
    else
        subjects = teacher.subjects;

    const grade = subjects[0][0]
    const subject = subjects[0][1]
    const subjectNameTab = page.locator('.test-subject-item', {hasText: `${subject} - ${grade}`});
    await subjectNameTab.click();
    let date: Date = new Date();
    let examLocator = subjectNameTab.locator(".test-exam-item", {hasText: format(date, "dd/MM/yyyy")});
    let ready = false;
    while (!ready) {
        date = faker.date.between({from: '2023-01-01', to: new Date()});
        examLocator = subjectNameTab.locator(".test-exam-item", {hasText: format(date, "dd/MM/yyyy")});
        if (!await subjectNameTab.getByText(format(date, "dd/MM/yyyy")).isVisible())
            ready = true;
    }

    await page.getByRole('button', {name: 'Agregar notas'}).click();
    await expect(page.getByRole('heading', {name: 'Seleccionar Materia'})).toBeVisible();
    await page.getByLabel('Año:').click();

    await page.getByLabel(grade).click();
    await page.getByLabel('Materia:').click();
    await page.getByLabel(subject).click();
    await page.getByRole('button', {name: 'Ir'}).click();
    await expect(page.getByRole('heading', {name: "Registrar Examen"})).toBeVisible();

    const studentsLocator = page.getByTestId("student-mark");
    await expect(studentsLocator.first()).toBeVisible();
    expect(await studentsLocator.count()).toBeGreaterThan(1); // More than one student
    const students = await studentsLocator.all();
    const studentsMarks = new Map<string, number | null>();

    await fillDate(page, format(date, "yyyy", {locale: es}), format(date, "MMMM", {locale: es}), format(date, "d", {locale: es}));

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const studentName = await student.locator('span').textContent();
        if(!studentName) {
            expect(false, {message: "El nombre del alumno está vacío"}).toBe(true);
            throw new Error("El nombre del alumno está vacío");
        }
        const studentMark = Math.floor(Math.random() * 10) + 1;
        if (i == 0)
            studentsMarks.set(studentName, null);
        else {
            studentsMarks.set(studentName, studentMark);
            await student.locator('input').fill(studentMark.toString());
        }
    }
    let dialogShown = false;
    page.on('dialog', dialog => {
            expect(dialog.message()).toBe('Notas cargadas exitosamente');
            dialog.dismiss();
            dialogShown = true;
        }
    );
    await page.getByRole('button', {name: 'Cargar'}).click();

    await expect.poll(async () => {
        return dialogShown;
    }, {
        intervals: [250],
        timeout: 20000,
    }).toBe(true)

    await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();
    await subjectNameTab.click();
    await expect(examLocator).toBeVisible();
    await examLocator.locator('button').click();

    const modal = page.getByRole("dialog");
    await expect(modal.getByRole('heading', {name: `Notas - ${subject} - ${grade}`})).toBeVisible();
    const examMarks = await modal.locator('tbody').locator("tr").all();
    expect(examMarks.length).toBe(studentsMarks.size - 1);

    const markArray = Array.from(studentsMarks.entries());
    for (let i = 0; i < markArray.length; i++) {
        const examMark = markArray[i];
        const row = page.locator("tbody").locator("tr", {hasText: examMark[0]});
        if(examMark[1] === null)
            await expect(row).not.toBeVisible();
        else{
            const studentName = await row.locator('td').first().textContent();
            const studentMark = await row.locator('td').nth(1).textContent();
            const mark = studentsMarks.get(studentName?? "");
            expect(mark?.toString()).toBe(studentMark);
        }
    }
})


test('Crear examen sin fecha', async ({page}) => {

        await loginAsRole(page, teacher.dni.toString(), teacher.password, 'Profesor');

        await page.locator('html').click();
        await page.getByRole('button', {name: 'Notas de exámenes'}).click();
        await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();

        let subjects: [string, string][]
        if (teacher.subjects === undefined || teacher.subjects.length === 0)
            throw new Error('No hay materias asignadas al docente');
        else
            subjects = teacher.subjects;

        const grade = subjects[0][0]
        const subject = subjects[0][1]
        const subjectNameTab = page.locator('.test-subject-item', {hasText: `${subject} - ${grade}`});
        await subjectNameTab.click();
        let date: Date = new Date();
        let examLocator = subjectNameTab.locator(".test-exam-item", {hasText: format(date, "dd/MM/yyyy")});
        let ready = false;
        while (!ready) {
            date = faker.date.between({from: '2023-01-01', to: new Date()});
            examLocator = subjectNameTab.locator(".test-exam-item", {hasText: format(date, "dd/MM/yyyy")});
            if (!await subjectNameTab.getByText(format(date, "dd/MM/yyyy")).isVisible())
                ready = true;
        }


        await page.getByRole('button', {name: 'Agregar notas'}).click();
        await expect(page.getByRole('heading', {name: 'Seleccionar Materia'})).toBeVisible();
        await page.getByLabel('Año:').click();

        await page.getByLabel(grade).click();
        await page.getByLabel('Materia:').click();
        await page.getByLabel(subject).click();
        await page.getByRole('button', {name: 'Ir'}).click();
        await expect(page.getByRole('heading', {name: "Registrar Examen"})).toBeVisible();

        const studentsLocator = page.getByTestId("student-mark");
        await expect(studentsLocator.first()).toBeVisible(); // at least one student
        const students = await studentsLocator.all();
        const studentsMarks = new Map();

        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            const studentName = await student.locator('span').textContent();
            const studentMark = Math.floor(Math.random() * 10) + 1;
            studentsMarks.set(studentName, studentMark);
            await student.locator('input').fill(studentMark.toString());
        }
        await page.getByRole('button', {name: 'Cargar'}).click();

        await expect(page.getByText("Ingresa una fecha")).toBeVisible();
});


test('Crear examen sin notas', async ({page}) => {
    await loginAsRole(page, teacher.dni.toString(), teacher.password, 'Profesor');

    await page.locator('html').click();
    await page.getByRole('button', {name: 'Notas de exámenes'}).click();
    await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();

    let subjects: [string, string][]
    if (teacher.subjects === undefined || teacher.subjects.length === 0)
        throw new Error('No hay materias asignadas al docente');
    else
        subjects = teacher.subjects;

    const grade = subjects[0][0]
    const subject = subjects[0][1]
    const subjectNameTab = page.locator('.test-subject-item', {hasText: `${subject} - ${grade}`});
    await subjectNameTab.click();
    let date: Date = new Date();
    let examLocator = subjectNameTab.locator(".test-exam-item", {hasText: format(date, "dd/MM/yyyy")});
    let ready = false;
    while (!ready) {
        date = faker.date.between({from: '2023-01-01', to: new Date()});
        examLocator = subjectNameTab.locator(".test-exam-item", {hasText: format(date, "dd/MM/yyyy")});
        if (!await subjectNameTab.getByText(format(date, "dd/MM/yyyy")).isVisible())
            ready = true;
    }

    await page.getByRole('button', {name: 'Agregar notas'}).click();
    await expect(page.getByRole('heading', {name: 'Seleccionar Materia'})).toBeVisible();
    await page.getByLabel('Año:').click();

    await page.getByLabel(grade).click();
    await page.getByLabel('Materia:').click();
    await page.getByLabel(subject).click();
    await page.getByRole('button', {name: 'Ir'}).click();
    await expect(page.getByRole('heading', {name: "Registrar Examen"})).toBeVisible();

    const studentsLocator = page.getByTestId("student-mark");
    await expect(studentsLocator.first()).toBeVisible(); // at least one student
    await fillDate(page, format(date, "yyyy", {locale: es}), format(date, "MMMM", {locale: es}), format(date, "d", {locale: es}));

    await page.keyboard.press("Escape");

    let dialogShown = false;
    page.on('dialog', dialog => {
            expect(dialog.message()).toBe('Debes ingresar al menos una nota');
            dialog.dismiss();
            dialogShown = true;
        }
    );
    await page.getByRole('button', {name: 'Cargar'}).click();

    await expect.poll(async () => {
        return dialogShown;
    }, {
        intervals: [250],
        timeout: 20000,
    }).toBe(true)
})


