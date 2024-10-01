import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


test('Datos validos alumno', async ({ page }) => {
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill("44881807");
    await page.getByLabel("Número de teléfono").fill("2915222332");
    await page.getByLabel("Nombre").fill("Leo");
    await page.getByLabel("Apellido").fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill(" test@gmail.com");
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await expect(page.getByLabel('Buscar por DNI')).toBeVisible();
    await expect(page.getByText('Buscar por apellido')).toBeVisible();
    await expect(page.getByText('Nuevo Responsable')).toBeVisible();


});

test('Datos vacios nombre y dni', async ({ page }) => {
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill("");
    await page.getByLabel("Número de teléfono").fill("");
    await page.getByLabel("Nombre").fill("Leo");
    await page.getByLabel("Apellido").fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill(" test@gmail.com");
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await expect(page.getByText("Siguiente")).toBeDisabled();

});

test('Email invalido', async ({ page }) => {
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill("44881807");
    await page.getByLabel("Número de teléfono").fill("2915222332");
    await page.getByLabel("Nombre").fill("Leo");
    await page.getByLabel("Apellido").fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill(" testgmail.com");
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());


    await expect(page).toHaveURL('http://localhost:3000/student/add');
    await expect(page.getByText("Registrar Alumno")).toBeVisible();
});

test('Año no seleccionado', async ({ page }) => {
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill("44881807");
    await page.getByLabel("Número de teléfono").fill("2915222332");
    await page.getByLabel("Nombre").fill("Leo");
    await page.getByLabel("Apellido").fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill(" testgmail.com");

    await expect(page.getByText("Siguiente")).toBeDisabled();

});



test('Asignacion de padres con padres ya registrados', async ({ page }) => {
    
    prisma.user.delete({
        where: {
            dni: 99999999
        }
    });
    
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill("99999999");
    await page.getByLabel("Número de teléfono").fill("2915222332");
    await page.getByLabel("Nombre").fill("Leo");
    await page.getByLabel("Apellido").fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill(" test@gmail.com");
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Seleccionar' }).last().click();

    await page.getByRole('button', { name: 'Registrar' }).click();

    await expect(page).toHaveURL('http://localhost:3000/student/add');
    await page.waitForTimeout(1000);
    await expect(page.getByText("Registrar Alumno")).toBeVisible();

    const newStudent = await prisma.user.findMany({
        where: {
            dni: 99999999
           
            
        },
        select: {
            profiles: {
                select: {
                    delegate_aux_student: true,
                }
            },
        }

    });

    expect(newStudent[0].profiles[0].delegate_aux_student?.phoneNumber).toBe("2915222332");

    prisma.user.delete({
        where: {
            dni: 99999999
        }
    });

    expect(prisma.user.findMany({
        where: {
            dni: 99999999
        }
    })).resolves.toBeUndefined();





    


});

test('Asignacion de padres con padre registrado y creado', async ({ page }) => {
    await page.goto('http://localhost:3000/student/add');

    prisma.user.delete({
        where: {
            dni: 99999999
        },
        include: {
            profiles: {
                select: {
                    delegate_aux_student: true,
                }
            }
        }
    });




    prisma.user.delete({
        where: {
            dni: 32999999

        },
        include: {
            profiles: {
                select: {
                    delegate_aux_parent: true,
                }
            }
        }
    });


    prisma.user.delete({
        where: {
            dni: 32881807
        },
        include: {
            profiles: {
                select: {
                    delegate_aux_parent: true,
                }
            }
        }
    });


    
    await page.getByLabel("Dni").fill("99999999");
    await page.getByLabel("Número de teléfono").fill("2915222332");
    await page.getByLabel("Nombre").fill("Leo");
    await page.getByLabel("Apellido").fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill(" test@gmail.com");
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    await page.getByLabel("Dni").last().fill("329999999"); //Como me detecta dos dni, elijo el ultimo que es el del padre
    await page.getByLabel("Número de teléfono").fill("2915222552");
    await page.getByLabel("Nombre").fill("Padre Nuevo");
    await page.getByLabel("Apellido").last().fill("Test");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill("test3@gmail.com");

    await page.getByRole('button', { name: 'Agregar' }).click();

    await page.waitForTimeout(2000);


    await page.getByRole('button', { name: 'Seleccionar' }).last().click(); //como el creado es el ultimo, selecciono este para asignarle al alumno



    await page.getByRole('button', { name: 'Registrar' }).click();

    await expect(page).toHaveURL('http://localhost:3000/student/add');
    await page.waitForTimeout(1000);
    await expect(page.getByText("Registrar Alumno")).toBeVisible();

    const newStudent = await prisma.user.findMany({
        where: {
            dni: 99999999
           
            
        },
        select: {
            profiles: {
                select: {
                    delegate_aux_student: {
                        select: {
                            parents: true
                        }
                    }
                }
            },
        }

    });

    expect(newStudent[0].profiles[0].delegate_aux_student?.parents).toBe("test3@gmail.com");

    prisma.user.delete({
        where: {
            dni: 99999999
        }
    });

    prisma.user.delete({
        where: {
            dni: 32999999
        }
    });




});


test('Asignacion de padres con un solo padre', async ({ page }) => {

    prisma.user.delete({
        where: {
            dni: 99999999
        },
        include: {
            profiles: {
                select: {
                    delegate_aux_student: true,
                }
            }
        }
    });


    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill("99999999");
    await page.getByLabel("Número de teléfono").fill("2915222332");
    await page.getByLabel("Nombre").fill("Leo");
    await page.getByLabel("Apellido").fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill(" test@gmail.com");
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Registrar' }).click();

    await expect(page).toHaveURL('http://localhost:3000/student/add');
    await page.waitForTimeout(1000);
    await expect(page.getByText("Registrar Alumno")).toBeVisible();

    const newStudent = await prisma.user.findMany({
        where: {
            dni: 99999999
           
            
        },
        select: {
            profiles: {
                select: {
                    delegate_aux_student: {
                        select: {
                            parents: true
                        }
                    }
                }
            },
        }

    });

    expect(newStudent[0].profiles[0].delegate_aux_student?.parents).toBe(1);
    prisma.user.delete({
        where: {
            dni: 99999999
        }
    });

});


test('Chequeo de alertas por numero de telefono incorrecto (menor de 8 digitos) estudiante', async ({ page }) => {
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill("44881807");
    await page.getByLabel("Número de teléfono").fill("2915222332");
    await page.getByLabel("Nombre").fill("Leo");
    await page.getByLabel("Apellido").fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill(" test@gmail.com");
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Ingrese un número de teléfono válido para el estudiante');
        dialog.dismiss();
    }
    );

    await page.getByRole('button', { name: 'Registrar' }).click();
    await expect(page.getByText("Asociar Responsable")).toBeVisible();


    
});

test('Chequeo de alertas por dni menor de 8 digitos estudiante', async ({ page }) => {
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill("4488180");
    await page.getByLabel("Número de teléfono").fill("2915222332");
    await page.getByLabel("Nombre").fill("Leo");
    await page.getByLabel("Apellido").fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill(" test@gmail.com");
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Ingrese un dni válido para el estudiante');
        dialog.dismiss();
    }
    );

    await page.getByRole('button', { name: 'Registrar' }).click();
    await expect(page.getByText("Asociar Responsable")).toBeVisible();


    
});

test('Chequeo de alertas por dni menor de 8 digitos responsable', async ({ page }) => {
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill("44881807");
    await page.getByLabel("Número de teléfono").fill("2915222332");
    await page.getByLabel("Nombre").fill("Leo");
    await page.getByLabel("Apellido").fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill(" test@gmail.com");
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    await page.getByLabel("Dni").last().fill("3288180"); //Como me detecta dos dni, elijo el ultimo que es el del padre
    await page.getByLabel("Número de teléfono").fill("2915222552");
    await page.getByLabel("Nombre").fill("Leo Padre");
    await page.getByLabel("Apellido").last().fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill("test2@gmail.com");

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Ingrese un dni válido para el responsable');
        dialog.dismiss();
    }
    );

    await page.getByRole('button', { name: 'Agregar' }).click();

});

test('Chequeo de alertas por telefono menor de 8 digitos responsable', async ({ page }) => {
    await page.goto('http://localhost:3000/student/add');

    await page.getByLabel("Dni").fill("44881807");
    await page.getByLabel("Número de teléfono").fill("2915222332");
    await page.getByLabel("Nombre").fill("Leo");
    await page.getByLabel("Apellido").fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill(" test@gmail.com");
    await page.getByText("Elija un año").click().then(() => page.getByLabel("2º año").click());

    await page.getByText("Siguiente").click();

    await page.getByRole('button', { name: 'Seleccionar' }).first().click();

    await page.getByRole('button', { name: 'Nuevo Responsable' }).first().click();

    await page.getByLabel("Dni").last().fill("32881807"); //Como me detecta dos dni, elijo el ultimo que es el del padre
    await page.getByLabel("Número de teléfono").fill("291522");
    await page.getByLabel("Nombre").fill("Leo Padre");
    await page.getByLabel("Apellido").last().fill("Dreizzen");
    await page.getByLabel("Dirección").fill("Calle Falsa 123");
    await page.getByLabel("Correo electrónico").fill("test2@gmail.com");

    page.on('dialog', dialog => {
        expect(dialog.message()).toBe('Ingrese un número de teléfono válido para el responsable');
        dialog.dismiss();
    }
    );

    await page.getByRole('button', { name: 'Agregar' }).click();

});
