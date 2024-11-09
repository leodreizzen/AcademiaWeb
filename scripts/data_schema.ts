import "./data_schema_env"
import {zodToJsonSchema} from "zod-to-json-schema";
import fs from "fs";
import path from "node:path";
import {TestDataSchema} from "./seeder/test_data/testData";

const testDataSchema = zodToJsonSchema(TestDataSchema,
    {
        errorMessages: true,
        name: "test data",
    });

const cwd = process.cwd();
fs.writeFileSync(path.join(cwd, "prisma", "data.schema.json"), JSON.stringify(testDataSchema, null, 2));
