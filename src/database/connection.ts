import { Pool } from "pg";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs/promises";

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD
} = process.env;

if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  throw new Error("Variáveis de ambiente do banco não configuradas.");
}

export const pool = new Pool({
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

export async function testaConexao(): Promise<void> {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("Conectado ao PostgreSQL!");
    console.log("Data/hora do servidor:", result.rows[0]);

  } catch (error) {
    console.error("Erro ao conectar ao PostgreSQL:", error);

  } finally {
    await pool.end();
  }
}

export async function aplicaSQL(fileName:string) {
    try {
      const schemaPath = path.join(
      process.cwd(),
      "database",
      fileName
    );

    const sql = await fs.readFile(schemaPath, "utf-8");

    await pool.query(sql);
  } catch (error) {
    console.error("Erro ao aplicar SQL no banco de dados:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
  
}