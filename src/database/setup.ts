import { aplicaSQL, pool } from "./connection";
import dotenv from "dotenv";
import { Pool } from 'pg';

dotenv.config();

const dbName = process.env.DB_NAME;

if (!dbName) {
    throw new Error('DB_NAME não foi definido no arquivo .env');
}

if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(dbName)) {
    throw new Error(`Nome de banco inválido: ${dbName}`);
}

/**
 * Cria o banco de dados caso ele ainda não exista.
 *
 * A conexão administrativa é feita no banco "postgres",
 * que é utilizado apenas para operações administrativas.
 */
async function setupBD(): Promise<void> {

    const adminPool = new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres'
    });

    try {
        const resultado = await adminPool.query(
            `
            SELECT 1
            FROM pg_database
            WHERE datname = $1
            `,
            [dbName]
        );

        if ((resultado.rowCount ?? 0) === 0) {
            console.log(`Banco de dados "${dbName}" não existe.`);
            console.log(`Criando banco de dados "${dbName}"...`);

            await adminPool.query(`CREATE DATABASE "${dbName}"`);

            console.log(`Banco de dados "${dbName}" criado com sucesso.`);
        } else {
            console.log(`Banco de dados "${dbName}" já existe.`);
        }

        aplicaSQL("schema.sql");

    } finally {
        await adminPool.end();
        await pool.end();
    }
}


setupBD()
