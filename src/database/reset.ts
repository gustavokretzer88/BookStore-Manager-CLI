import { aplicaSQL, pool } from "./connection";

async function reset() {
  try {
    await aplicaSQL("reset.sql");
    console.log("Banco resetado com sucesso.");
  } catch (error) {
    console.error("Erro ao executar reset:", error);
  } finally {
    await pool.end();
  }
}

reset();
