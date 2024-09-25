import {createClient} from "@1password/sdk"
import dotenv from "dotenv";
if(!process.env.CI)
    dotenv.config({path: ".env.local"});

import * as fs from "node:fs";
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
    fs.writeFileSync(".env", env);
}

loadSecrets().catch(err => "Error downloading secrets: " + err.message);