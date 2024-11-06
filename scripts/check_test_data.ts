import path from "node:path";
import fs from "fs";
import {TestDataSchema} from "./seeder/test_data/testData";
const rawdata = fs.readFileSync(path.join("prisma","data.json")).toString();
const json = JSON.parse(rawdata);

TestDataSchema.parse(json);
console.log("OK!");
