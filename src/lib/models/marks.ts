import {z} from "zod";

const IdModel = z.coerce.number().int().refine(id => !isNaN(id))
const SemesterMarkModel = z.string().regex(new RegExp("[ABCD]"));
const FinalMarModel = z.number({message: "Ingresa una nota válida"}).int("Ingresa una nota válida").max(10, "La nota debe ser menor o igual a 10").min(1, "La nota debe ser mayor o igual a 10")
export const FirstSemesterMarkListModel = z.record(IdModel, SemesterMarkModel);
export const SecondSemesterMarkModel = z.object({
    secondSemester: SemesterMarkModel,
    final: FinalMarModel
});

export const SecondSemesterMarkListModel = z.record(IdModel, SecondSemesterMarkModel);
export const FirstSemesterMarkModel = z.record(IdModel, SemesterMarkModel);
