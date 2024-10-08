import {createClient} from "@1password/sdk"
import dotenv from "dotenv";
import crypto from "crypto";

if (!process.env.CI)
    dotenv.config({path: ".env.local"});

import * as fs from "node:fs";
import path from "node:path";
import readline from "readline-sync";
import {writeFileSync} from "node:fs";

async function loadSecrets() {
    const secrets = new Map<string, string>();
    if (!process.env.OP_SERVICE_ACCOUNT_TOKEN) {
        throw new Error("OP_SERVICE_ACCOUNT_TOKEN is required")
    }
    if (!process.env.VAULT_ID) {
        throw new Error("VAULT_ID is required")
    }
    const vaultId = process.env.VAULT_ID;

    const client = await createClient({
        auth: process.env.OP_SERVICE_ACCOUNT_TOKEN,
        integrationName: "AcademiaWeb",
        integrationVersion: "1.0.0",
    });

    const items = await client.items.listAll(vaultId);
    for await(const item of items) {
        const itemData = await client.items.get(vaultId, item.id);
        for (const field of itemData.fields) {
            if (field.fieldType == "Concealed") {
                secrets.set(field.title, field.value);
            }
        }
    }
    const env = Array.from(secrets).map(([key, value]) => `${key}=${value}`).join("\n");
    const currentDirectory = process.cwd();
    const filePath = path.join(currentDirectory, ".env");
    console.log("Writing secrets to", filePath);
    fs.writeFileSync(filePath, env);
    const testDataKey = secrets.get("TEST_DATA_KEY")
    if (!testDataKey) {
        throw new Error("TEST_DATA_KEY is required (change remote secrets)")
    }

    const dataFilePath = path.join(currentDirectory, "prisma", "data.json");
    if (fs.existsSync(dataFilePath)) {
        if (encryptedTestDataChanged()) {
            console.log("!!!!!! WARNING !!!!!")
            console.log("Found existing data.json (test data) file. Do you want to overwrite it? (y/n)");
            const answer = readline.question();
            if (answer.toLowerCase() === "y") {
                decryptTestData(Buffer.from(testDataKey, "hex"));
            }
        }
    } else {
        decryptTestData(Buffer.from(testDataKey, "hex"));
    }
}
const cwd = process.cwd();
const dataLockFilePath = path.join(cwd, "prisma", "data.json.lock");


function encryptedTestDataChanged() {
    // data.json.lock, if exists, should have the sha256 hash of the encrypted data.json file
    if (fs.existsSync(dataLockFilePath)) {
        const dataLock = fs.readFileSync(dataLockFilePath, "utf-8");
        const encryptedData = fs.readFileSync(path.join(cwd, "prisma", "data.json.encrypted"));
        const hash = crypto.createHash("sha256").update(encryptedData).digest("hex");

        return dataLock != hash;
    }
    else
        return true;
}


function decryptTestData(key: Buffer) {
    console.log("Decrypting test data")
    const encryptedWithIv = fs.readFileSync(path.join(cwd, "prisma", "data.json.encrypted"));
    const iv = encryptedWithIv.subarray(0, 16);
    const encryptedData = encryptedWithIv.subarray(16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    const outputFilePath = path.join(cwd, "prisma", "data.json");
    fs.writeFileSync(outputFilePath, decrypted);
    console.log(`Decrypted file saved in: ${outputFilePath}`);

    // write hash to lockfile
    const hash = crypto.createHash("sha256").update(encryptedWithIv).digest("hex");
    fs.writeFileSync(dataLockFilePath, hash);
}

loadSecrets().catch(err => console.error("Error downloading secrets: " + err));
