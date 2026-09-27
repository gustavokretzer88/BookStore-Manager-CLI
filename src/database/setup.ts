import { aplicaSQL, pool } from "./connection";
import dotenv from "dotenv";

async function setupBD() {
  try {
    dotenv.config();
    const dbName = process.env.DB_NAME;
    if(!dbName) {
      console.log("Erro: definir DB_NAME.");
      return;
    }
    
    const existeBD = await pool.query(`SELECT 1 FROM pg_database WHERE datname = ${dbName}`);

    if ((existeBD.rowCount ?? 0) === 0) {
      await pool.query(`CREATE DATABASE ${process.env.DB_NAME}`)
    }

    await aplicaSQL("schema.sql");

    console.log("Banco criado com sucesso!");
  } catch(error) {
    console.log(`Erro: ${error}`);
  } finally {
    await pool.end();
  }  
}

setupBD()
