import { aplicaSQL, pool } from "./connection";

async function seed() {
  try {
    await aplicaSQL("seed.sql");
    console.log("Banco populado com sucesso.");
  } catch (error) {
    console.error("Erro ao executar seed:", error);
  } finally {
    await pool.end();
  }
}

seed();
