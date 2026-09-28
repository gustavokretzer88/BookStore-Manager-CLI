import { aplicaSQL, pool } from "./connection";

async function clear() {
  try {
    await aplicaSQL("clear.sql");
    console.log("Banco limpo com sucesso.");
  } catch (error) {
    console.error("Erro ao executar clear:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

clear();
