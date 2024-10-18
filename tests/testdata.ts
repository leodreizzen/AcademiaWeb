import {PersonList, PersonListSchema} from "@/lib/models/seeder/person";
import fs from "fs";
import path from "node:path";
function getJsonFromFile(path: string){
    const rawdata = fs.readFileSync(path).toString();
    return JSON.parse(rawdata);
}

export function getTestUser(alias: string){
    const dataRaw = getJsonFromFile(path.join("prisma","data.json"))

    const data: PersonList = PersonListSchema.parse(dataRaw)

    const testuser = data.find(d => d.alias === alias)
    if(!testuser)
        throw new Error("test user not found with alias " + alias)
    return testuser
}


export function getTestUserChildren(alias: string){
    const dataRaw = getJsonFromFile(path.join("prisma","data.json"))

    const data: PersonList = PersonListSchema.parse(dataRaw)

    const testuser = data.find(d => d.alias === alias)
    if(!testuser)
        throw new Error("test user not found with alias " + alias)
    return data.filter(d => d.parentDnis && d.parentDnis.includes(testuser.dni))

}