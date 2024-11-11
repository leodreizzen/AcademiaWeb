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

test('Editar examen con datos válidos', async ({page}) => {
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
    const studentsMarks = new Map<string, number>();
    const studentNames = new Set<string>();
    await fillDate(page, format(date, "yyyy", {locale: es}), format(date, "MMMM", {locale: es}), format(date, "d", {locale: es}));

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const studentName = await student.locator('span').textContent();
        if (!studentName) {
            expect(false, {message: "El nombre del alumno está vacío"}).toBe(true);
            return;
        }
        const studentMark = Math.floor(Math.random() * 10) + 1;
        studentsMarks.set(studentName, studentMark);
        await student.locator('input').fill(studentMark.toString());
        studentNames.add(studentName);
    }
    await page.getByRole('button', {name: 'Cargar'}).click();
    let dialogShown = false;
    page.on('dialog', dialog => {
            expect(dialog.message()).toBe('Notas cargadas exitosamente');
            dialog.dismiss();
            dialogShown = true;

        }
    );

    await expect.poll(async () => {
        return dialogShown;
    }, {
        intervals: [250],
        timeout: 20000,
    }).toBe(true)
    page.removeAllListeners('dialog');
    await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();
    await subjectNameTab.click();
    await expect(examLocator).toBeVisible();
    await examLocator.locator('button').click();

    const modal = page.getByRole("dialog");
    await expect(modal.getByRole('heading', {name: `Notas - ${subject} - ${grade}`})).toBeVisible();
    await modal.getByRole('button', {name: 'Editar'}).click();
    await expect(page.getByRole('heading', {name: 'Editar Examen'})).toBeVisible();

    const studentToChange = studentsMarks.entries().next().value;
    if(!studentToChange)
        throw new Error("No hay alumnos para modificar");

    for(const studentName of studentNames){
        const row = page.getByTestId("student-mark").filter({hasText: studentName})
        const input = await row.locator('input');
        const previousMark = studentsMarks.get(studentName)
        if(!previousMark) {
            expect(true, {message: "no se encontró la nota del alumno"}).toBe(false);
            return;
        }

        await expect(input).toHaveValue(previousMark.toString());
        if(studentName === studentToChange[0]){
            const newMark = previousMark + 1 > 10 ? 1 : previousMark + 1;
            await input.fill(newMark.toString());
            studentsMarks.set(studentName, newMark);
        }
    }
    await page.getByRole('button', {name: 'Guardar'}).click();

    let dialogShown2 = false;

    page.on('dialog', dialog => {
            expect(dialog.message()).toBe('Notas guardadas exitosamente');
            dialog.dismiss();
            dialogShown2 = true;
        }
    );

    await expect.poll(async () => {
        return dialogShown2;
    }, {
        intervals: [250],
        timeout: 20000,
    }).toBe(true)
    page.removeAllListeners('dialog');
    await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();
    await subjectNameTab.click();
    await expect(examLocator).toBeVisible();
    await examLocator.locator('button').click();

    await expect(modal.getByRole('heading', {name: `Notas - ${subject} - ${grade}`})).toBeVisible();
    const examMarks = await modal.locator('tbody').locator("tr").all();
    expect(examMarks.length).toBe(studentsMarks.size);
    for (let i = 0; i < examMarks.length; i++) {
        const examMark = examMarks[i];
        const studentName = await examMark.locator('td').first().textContent();
        const studentMark = await examMark.locator('td').nth(1).textContent();
        if(!studentName || !studentMark) {
            expect(true, {message: "no se encontró el nombre o la nota del alumno"}).toBe(false);
            return
        }

        const expectedMark = studentsMarks.get(studentName);
        if(expectedMark == undefined) {
            expect(true, {message: "no se encontró la nota del alumno"}).toBe(false);
            return
        }

        expect(expectedMark.toString()).toBe(studentMark);
    }
})


test('Editar examen y agregar nota', async ({page}) => {
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
    const studentsMarks = new Map<string, number|null>();
    const studentNames = new Set<string>();
    await fillDate(page, format(date, "yyyy", {locale: es}), format(date, "MMMM", {locale: es}), format(date, "d", {locale: es}));
    let nullStudentName;
    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const studentName = await student.locator('span').textContent();
        if (!studentName) {
            expect(false, {message: "El nombre del alumno está vacío"}).toBe(true);
            return;
        }
        if (i == 0) {
            nullStudentName = studentName;
            studentsMarks.set(studentName, null);
        }
        else {
            const studentMark = Math.floor(Math.random() * 10) + 1;
            studentsMarks.set(studentName, studentMark);
            await student.locator('input').fill(studentMark.toString());
        }
        studentNames.add(studentName);
    }
    await page.getByRole('button', {name: 'Cargar'}).click();
    let dialogShown = false;
    page.on('dialog', dialog => {
            expect(dialog.message()).toBe('Notas cargadas exitosamente');
            dialog.dismiss();
            dialogShown = true;

        }
    );

    await expect.poll(async () => {
        return dialogShown;
    }, {
        intervals: [250],
        timeout: 20000,
    }).toBe(true)
    page.removeAllListeners('dialog');
    await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();
    await subjectNameTab.click();
    await expect(examLocator).toBeVisible();
    await examLocator.locator('button').click();

    const modal = page.getByRole("dialog");
    await expect(modal.getByRole('heading', {name: `Notas - ${subject} - ${grade}`})).toBeVisible();
    await modal.getByRole('button', {name: 'Editar'}).click();
    await expect(page.getByRole('heading', {name: 'Editar Examen'})).toBeVisible();

    const studentToChange = studentsMarks.entries().next().value;
    if(!studentToChange)
        throw new Error("No hay alumnos para modificar");

    for(const studentName of studentNames){
        const row = page.getByTestId("student-mark").filter({hasText: studentName})
        const input = await row.locator('input');
        const previousMark = studentsMarks.get(studentName)
        if(previousMark === undefined) {
            expect(true, {message: `no se encontró la nota del alumno ${studentName}`}).toBe(false);
            return
        }

        await expect(input).toHaveValue(previousMark?.toString() ?? "");
        if(studentName === nullStudentName){
            const newMark = Math.floor(Math.random() * 10) + 1;
            await input.fill(newMark.toString());
            studentsMarks.set(studentName, newMark);
        }
    }

    let dialogShown2 = false;

    page.on('dialog', dialog => {
            expect(dialog.message()).toBe('Notas guardadas exitosamente');
            dialog.dismiss();
            dialogShown2 = true;
        }
    );
    await page.getByRole('button', {name: 'Guardar'}).click();

    await expect.poll(async () => {
        return dialogShown2;
    }, {
        intervals: [250],
        timeout: 20000,
    }).toBe(true)
    page.removeAllListeners('dialog');
    await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();
    await subjectNameTab.click();
    await expect(examLocator).toBeVisible();
    await examLocator.locator('button').click();

    await expect(modal.getByRole('heading', {name: `Notas - ${subject} - ${grade}`})).toBeVisible();
    const examMarks = await modal.locator('tbody').locator("tr").all();
    expect(examMarks.length).toBe(studentsMarks.size);
    for (let i = 0; i < examMarks.length; i++) {
        const examMark = examMarks[i];
        const studentName = await examMark.locator('td').first().textContent();
        const studentMark = await examMark.locator('td').nth(1).textContent();
        if(!studentName || !studentMark) {
            expect(true, {message: "no se encontró el nombre o la nota del alumno"}).toBe(false);
            return
        }
        const expectedMark = studentsMarks.get(studentName);
        if(expectedMark == undefined) {
            expect(true, {message: "no se encontró la nota del alumno"}).toBe(false);
            return
        }

        expect(expectedMark.toString()).toBe(studentMark);
    }
})



test('Editar examen y eliminar nota', async ({page}) => {
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
    const studentsMarks = new Map<string, number|null>();
    const studentNames = new Set<string>();
    await fillDate(page, format(date, "yyyy", {locale: es}), format(date, "MMMM", {locale: es}), format(date, "d", {locale: es}));

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const studentName = await student.locator('span').textContent();
        if (!studentName) {
            expect(false, {message: "El nombre del alumno está vacío"}).toBe(true);
            return;
        }
        const studentMark = Math.floor(Math.random() * 10) + 1;
        studentsMarks.set(studentName, studentMark);
        await student.locator('input').fill(studentMark.toString());
        studentNames.add(studentName);
    }
    await page.getByRole('button', {name: 'Cargar'}).click();
    let dialogShown = false;
    page.on('dialog', dialog => {
            expect(dialog.message()).toBe('Notas cargadas exitosamente');
            dialog.dismiss();
            dialogShown = true;

        }
    );

    await expect.poll(async () => {
        return dialogShown;
    }, {
        intervals: [250],
        timeout: 20000,
    }).toBe(true)
    page.removeAllListeners('dialog');
    await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();
    await subjectNameTab.click();
    await expect(examLocator).toBeVisible();
    await examLocator.locator('button').click();

    const modal = page.getByRole("dialog");
    await expect(modal.getByRole('heading', {name: `Notas - ${subject} - ${grade}`})).toBeVisible();
    await modal.getByRole('button', {name: 'Editar'}).click();
    await expect(page.getByRole('heading', {name: 'Editar Examen'})).toBeVisible();

    const studentToChange = studentsMarks.entries().next().value;
    if(!studentToChange)
        throw new Error("No hay alumnos para modificar");

    for(const studentName of studentNames){
        const row = page.getByTestId("student-mark").filter({hasText: studentName})
        const input = await row.locator('input');
        const previousMark = studentsMarks.get(studentName)
        if(!previousMark) {
            expect(true, {message: "no se encontró la nota del alumno"}).toBe(false);
            return;
        }

        await expect(input).toHaveValue(previousMark.toString());
        if(studentName === studentToChange[0]){
            await input.fill("");
            studentsMarks.set(studentName, null);
        }
    }

    let dialogShown2 = false;

    page.on('dialog', dialog => {
            expect(dialog.message()).toBe('Notas guardadas exitosamente');
            dialog.dismiss();
            dialogShown2 = true;
        }
    );
    await page.getByRole('button', {name: 'Guardar'}).click();

    await expect.poll(async () => {
        return dialogShown2;
    }, {
        intervals: [250],
        timeout: 20000,
    }).toBe(true)
    page.removeAllListeners('dialog');
    await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();
    await subjectNameTab.click();
    await expect(examLocator).toBeVisible();
    await examLocator.locator('button').click();

    await expect(modal.getByRole('heading', {name: `Notas - ${subject} - ${grade}`})).toBeVisible();
    const examMarks = await modal.locator('tbody').locator("tr").all();
    expect(examMarks.length).toBe(studentsMarks.size - 1);
    for (let i = 0; i < examMarks.length; i++) {
        const examMark = examMarks[i];
        const studentName = await examMark.locator('td').first().textContent();
        const studentMark = await examMark.locator('td').nth(1).textContent();
        if(!studentName || !studentMark) {
            expect(true, {message: "no se encontró el nombre o la nota del alumno"}).toBe(false);
            return
        }

        const expectedMark = studentsMarks.get(studentName);
        if(expectedMark == undefined) {
            expect(true, {message: "no se encontró la nota del alumno"}).toBe(false);
            return
        }

        expect(expectedMark.toString()).toBe(studentMark);
    }
})


test('Editar examen sin notas', async ({page}) => {
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
    const studentsMarks = new Map<string, number|null>();
    const studentNames = new Set<string>();
    await fillDate(page, format(date, "yyyy", {locale: es}), format(date, "MMMM", {locale: es}), format(date, "d", {locale: es}));

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const studentName = await student.locator('span').textContent();
        if (!studentName) {
            expect(false, {message: "El nombre del alumno está vacío"}).toBe(true);
            return;
        }
        const studentMark = Math.floor(Math.random() * 10) + 1;
        studentsMarks.set(studentName, studentMark);
        await student.locator('input').fill(studentMark.toString());
        studentNames.add(studentName);
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
    page.removeAllListeners('dialog');
    await expect(page.getByRole("heading", {name: "Notas de Alumnos"})).toBeVisible();
    await subjectNameTab.click();
    await expect(examLocator).toBeVisible();
    await examLocator.locator('button').click();

    const modal = page.getByRole("dialog");
    await expect(modal.getByRole('heading', {name: `Notas - ${subject} - ${grade}`})).toBeVisible();
    await modal.getByRole('button', {name: 'Editar'}).click();
    await expect(page.getByRole('heading', {name: 'Editar Examen'})).toBeVisible();

    const studentToChange = studentsMarks.entries().next().value;
    if(!studentToChange)
        throw new Error("No hay alumnos para modificar");

    for(const studentName of studentNames){
        const row = page.getByTestId("student-mark").filter({hasText: studentName})
        const input = await row.locator('input');
        await input.fill("");
    }

    let dialogShown2 = false;

    page.on('dialog', dialog => {
            expect(dialog.message()).toBe('Debes ingresar al menos una nota');
            dialog.dismiss();
            dialogShown2 = true;
        }
    );
    await page.getByRole('button', {name: 'Guardar'}).click();


    await expect.poll(async () => {
        return dialogShown2;
    }, {
        intervals: [250],
        timeout: 20000,
    }).toBe(true)
})