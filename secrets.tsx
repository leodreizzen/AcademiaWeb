import {createClient} from "@1password/sdk"
import dotenv from "dotenv";
import crypto from "crypto";
if(!process.env.CI)
    dotenv.config({path: ".env.local"});

import * as fs from "node:fs";
import path from "node:path";
async function loadSecrets() {
    const secrets = new Map<string, string>();
    if(!process.env.OP_SERVICE_ACCOUNT_TOKEN) {
        throw new Error("OP_SERVICE_ACCOUNT_TOKEN is required")
    }
    if(!process.env.VAULT_ID) {
        throw new Error("VAULT_ID is required")
    }
    const vaultId = process.env.VAULT_ID;

    const client = await createClient({
        auth: process.env.OP_SERVICE_ACCOUNT_TOKEN,
        integrationName: "AcademiaWeb",
        integrationVersion: "1.0.0",
    });

    const items =await client.items.listAll(vaultId);
    for await(const item of items){
        const itemData = await client.items.get(vaultId, item.id);
        for (const field of itemData.fields){
            if(field.fieldType == "Concealed"){
                secrets.set(field.title, field.value);
            }
        }
    }
    const env = Array.from(secrets).map(([key, value]) => `${key}=${value}`).join("\n");
    const currentDirectory = process.cwd();
    const filePath = path.join(currentDirectory, ".env");
    console.log("Writing secrets to", filePath);
    fs.writeFileSync(filePath, env);
    const testDataKey= secrets.get("TEST_DATA_KEY")
    if(!testDataKey){
        throw new Error("TEST_DATA_KEY is required (change remote secrets)")
    }
    decryptTestData(Buffer.from(testDataKey, "hex"));
}

function decryptTestData(key: Buffer) {
    console.log("Decrypting test data")
    const cwd = process.cwd();
    const encryptedWithIv = fs.readFileSync(path.join(cwd,"prisma","data.json.encrypted"));
    const iv = encryptedWithIv.subarray(0, 16);
    const encryptedData = encryptedWithIv.subarray(16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    const outputFilePath = path.join(cwd, "prisma", "data.json");
    fs.writeFileSync(outputFilePath, decrypted);
    console.log(`Decrypted file saved in: ${outputFilePath}`);
}

loadSecrets().catch(err => console.error("Error downloading secrets: " + err));
