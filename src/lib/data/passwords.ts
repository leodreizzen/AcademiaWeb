import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hashSync(password, 13);
}