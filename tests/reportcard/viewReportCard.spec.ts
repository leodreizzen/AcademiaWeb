import {expect, test} from "@playwright/test";
import {
    getTestReportCard,
    getTestStudentWithoutReportCards,
    getTestUserByDni,
    getTestUserByDniWithRole,
} from "../testdata";
import {login} from "@/helpersTest/loginHelper";

test.beforeEach(async ({ page }) => {
    await page.goto('/');
})


test('Ver boletin solo primer cuatrimestre alumno', async ({page}) => {
    const reportCard = getTestReportCard(true, false);
    const student = getTestUserByDni(reportCard.firstSemesterMarks[0].marks[0].studentDni);
    await login(page, student.dni.toString(), student.password);
    await expect(page.getByRole('heading')).toContainText('Bienvenido a AcademiaWeb');

    await page.locator("main").getByText("Boletín").click();
    await expect(page.getByRole('heading')).toContainText('Boletín');
    await expect(page.getByText(`Estudiante: ${student.firstName} ${student.lastName}`)).toBeVisible();

    const header = page.locator("thead tr");
    await expect(header.locator("th").nth(0)).toContainText("Materia");
    await expect(header.locator("th").nth(1)).toContainText("1° Semestre");
    await expect(header.locator("th").nth(2)).toContainText("2° Semestre");
    await expect(header.locator("th").nth(3)).toContainText("Nota Final");

    for(const subjectMark of reportCard.firstSemesterMarks){
        const row = page.locator("tr", {has: page.locator(`:text-is("${subjectMark.subject}")`)});
        await expect(row).toBeVisible();
        const mark = subjectMark.marks.find(m => m.studentDni === student.dni)?.mark;
        if(!mark)
            throw new Error(`mark not found for student ${student.dni} in subject ${subjectMark.subject}`)
        await expect(row.locator("td").nth(1)).toContainText(mark);
        await expect(row.locator("td").nth(2)).toContainText("-");
        await expect(row.locator("td").nth(3)).toContainText("-");
    }
})


test('Ver boletin ambos cuatrimestres alumno', async ({page}) => {
    const reportCard = getTestReportCard(true, true);
    const student = getTestUserByDni(reportCard.firstSemesterMarks[0].marks[0].studentDni);
    await login(page, student.dni.toString(), student.password);
    await expect(page.getByRole('heading')).toContainText('Bienvenido a AcademiaWeb');

    await page.locator("main").getByText("Boletín").click();
    await expect(page.getByRole('heading')).toContainText('Boletín');
    await expect(page.getByText(`Estudiante: ${student.firstName} ${student.lastName}`)).toBeVisible();

    const header = page.locator("thead tr");
    await expect(header.locator("th").nth(0)).toContainText("Materia");
    await expect(header.locator("th").nth(1)).toContainText("1° Semestre");
    await expect(header.locator("th").nth(2)).toContainText("2° Semestre");
    await expect(header.locator("th").nth(3)).toContainText("Nota Final");

    for(let i = 0; i < reportCard.firstSemesterMarks.length; i++){
        const subjectFirstSemesterMark = reportCard.firstSemesterMarks[i];
        const subjectSecondSemesterMark = reportCard.secondSemesterMarks.find(m => m.subject === subjectFirstSemesterMark.subject);
        const subjectFinalMark = reportCard.finalMarks.find(m => m.subject === subjectFirstSemesterMark.subject);

        if(!subjectSecondSemesterMark)
            throw new Error(`second semester mark not found for subject ${subjectFirstSemesterMark.subject}`)
        if(!subjectFinalMark)
            throw new Error(`final mark not found for subject ${subjectFirstSemesterMark.subject}`)

        const row = page.locator("tr", {has: page.locator(`:text-is("${subjectFirstSemesterMark.subject}")`)});
        await expect(row).toBeVisible();
        const firstSemesterMark = subjectFirstSemesterMark.marks.find(m => m.studentDni === student.dni)?.mark;
        const secondSemesterMark = subjectSecondSemesterMark.marks.find(m => m.studentDni === student.dni)?.mark;
        const finalMark = subjectFinalMark.marks.find(m => m.studentDni === student.dni)?.mark;
        if(!firstSemesterMark)
            throw new Error(`mark not found for student ${student.dni} in subject ${subjectFirstSemesterMark.subject}`)
        if(!secondSemesterMark)
            throw new Error(`mark not found for student ${student.dni} in subject ${subjectSecondSemesterMark.subject}`)
        if(!finalMark)
            throw new Error(`mark not found for student ${student.dni} in subject ${subjectFinalMark.subject}`)

        await expect(row.locator("td").nth(1)).toContainText(firstSemesterMark);
        await expect(row.locator("td").nth(2)).toContainText(secondSemesterMark);
        await expect(row.locator("td").nth(3)).toContainText(finalMark.toString());
    }
})


test('Ver boletin solo primer cuatrimestre padre', async ({page}) => {
    const reportCard = getTestReportCard(true, false);
    const student = getTestUserByDniWithRole(reportCard.firstSemesterMarks[0].marks[0].studentDni, "Student");
    const parent = getTestUserByDniWithRole(student.parentDnis[0], "Parent");

    await login(page, parent.dni.toString(), parent.password);
    const homeTitle = page.getByRole('heading', {name: 'Bienvenido a AcademiaWeb'});
    const selectChildren = page.getByText("Selecciona un alumno");
    await expect(homeTitle.or(selectChildren)).toBeVisible();
    if(await selectChildren.isVisible()) {
        await page.getByText(`${student.firstName} ${student.lastName}`).click();
        await expect(homeTitle).toBeVisible();
    }

    await page.locator("main").getByText("Boletín").click();
    await expect(page.getByRole('heading')).toContainText('Boletín');
    await expect(page.getByText(`Estudiante: ${student.firstName} ${student.lastName}`)).toBeVisible();

    const header = page.locator("thead tr");
    await expect(header.locator("th").nth(0)).toContainText("Materia");
    await expect(header.locator("th").nth(1)).toContainText("1° Semestre");
    await expect(header.locator("th").nth(2)).toContainText("2° Semestre");
    await expect(header.locator("th").nth(3)).toContainText("Nota Final");

    for(const subjectMark of reportCard.firstSemesterMarks){
        const row = page.locator("tr", {has: page.locator(`:text-is("${subjectMark.subject}")`)});
        await expect(row).toBeVisible();
        const mark = subjectMark.marks.find(m => m.studentDni === student.dni)?.mark;
        if(!mark)
            throw new Error(`mark not found for student ${student.dni} in subject ${subjectMark.subject}`)
        await expect(row.locator("td").nth(1)).toContainText(mark);
        await expect(row.locator("td").nth(2)).toContainText("-");
        await expect(row.locator("td").nth(3)).toContainText("-");
    }
})

test('Ver boletin sin boletines cargados', async ({page}) => {
    const student = getTestStudentWithoutReportCards();
    await login(page, student.dni.toString(), student.password);
    await expect(page.getByRole('heading')).toContainText('Bienvenido a AcademiaWeb');

    await page.locator("main").getByText("Boletín").click();
    await expect(page.getByText("Los datos de este boletín aún no están disponibles")).toBeVisible();
})