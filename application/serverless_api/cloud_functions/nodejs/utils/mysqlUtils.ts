const mysql = require("mysql2/promise");

const config = {
    host: process.env.DB_HOST,
    port: 13306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}

export const getWalletPrivateKeyByUsername = async (username: string): Promise<string> => {
    if (process.env.ENV_IS_LOCAL)
        if (!process.env.PRIVATE_KEY) throw new Error("Private key must be defined as .env variable!");
        else return process.env.PRIVATE_KEY;

    const conn = await mysql.createConnection(config);

    const [rows] = await conn.execute("SELECT cwc.private_key FROM custodial_wallet_credentials cwc WHERE cwc.id = (" +
        "SELECT c.custodial_wallet_credentials_id FROM company c WHERE c.eth_address = (" +
        "SELECT u.company_eth_address FROM user u WHERE u.email = (" +
        "SELECT l.user_email FROM login l WHERE l.username = '" + username + "'" +
        ")" +
        ")" +
        ")");

    return rows[0].private_key;
}

export const getAllWalletPrivateKeys = async (): Promise<string[]> => {
    const conn = await mysql.createConnection(config);
    const [rows] = await conn.execute("SELECT private_key FROM custodial_wallet_credentials");

    return rows.map((r: any) => r.private_key);
}

export const updateWalletPublicKeyByPrivateKey = async (publicKey: string, privateKey: string) => {
    const conn = await mysql.createConnection(config);

    await conn.execute("UPDATE custodial_wallet_credentials SET public_key = ? WHERE private_key = ?",
        [publicKey, privateKey]);
}