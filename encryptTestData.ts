import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
import path from "node:path";
dotenv.config();


const cwd = process.cwd();
const data = fs.readFileSync(path.join(cwd,"prisma","data.json"));
if(!process.env.TEST_DATA_KEY){
    throw new Error("TEST_DATA_KEY is required")
}
const key = Buffer.from(process.env.TEST_DATA_KEY,"hex");

const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

let encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

const encryptedWithIv = Buffer.concat([iv, encrypted]);

const outputFilePath = path.join(cwd, "prisma", "data.json.encrypted");
fs.writeFileSync(outputFilePath, encryptedWithIv);
console.log(`Encrypted file saved in  en: ${outputFilePath}`);


