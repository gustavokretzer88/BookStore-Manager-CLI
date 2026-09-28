console.log("=================================");
console.log("      BOOKSTORE MANAGER CLI");
console.log("=================================");

console.log("Sistema iniciado.");

import { pool, testaConexao } from "./database/connection";

async function main(): Promise<void> {
  await testaConexao();
}

main();
