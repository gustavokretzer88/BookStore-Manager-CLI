import { MenuPrincipal } from "./controllers/MenuPrincipal";

import { AutorService } from "./services/AutorService";
import { LivroService } from "./services/LivroService";
import { ExemplarService } from "./services/ExemplarService";
import { ClienteService } from "./services/ClienteService";
import { EmprestimoService } from "./services/EmprestimoService";

import { AutorRepository } from "./repositories/AutorRepository";
import { LivroRepository } from "./repositories/LivroRepository";
import { ExemplarRepository } from "./repositories/ExemplarRepository";
import { ClienteRepository } from "./repositories/ClienteRepository";
import { EmprestimoRepository } from "./repositories/EmprestimoRepository";


import { RelatorioService } from "./services/RelatorioService";
import { RelatorioRepository } from "./repositories/RelatorioRepository";
import { AutorController } from "./controllers/AutorController";
import { LivroController } from "./controllers/LivroController";
import { ExemplarController } from "./controllers/ExemplarController";
import { ClienteController } from "./controllers/ClienteController";
import { EmprestimoController } from "./controllers/EmprestimoController";
import { RelatorioController } from "./controllers/RelatorioController";

async function main(): Promise<void> {
  // ========================================
  // REPOSITORIES
  // ========================================

  const autorRepository = new AutorRepository();
  const livroRepository = new LivroRepository();
  const exemplarRepository = new ExemplarRepository();
  const clienteRepository = new ClienteRepository();
  const emprestimoRepository = new EmprestimoRepository();
  const relatorioRepository = new RelatorioRepository();

  // ========================================
  // SERVICES
  // ========================================

  const autorService = new AutorService(autorRepository);

  const livroService = new LivroService(livroRepository, autorRepository);

  const exemplarService = new ExemplarService(
    exemplarRepository,
    livroRepository,
  );

  const clienteService = new ClienteService(clienteRepository);

  const emprestimoService = new EmprestimoService(
    emprestimoRepository,
    clienteRepository,
    exemplarRepository,
  );

  const relatorioService = new RelatorioService(relatorioRepository);

  // ========================================
  // CONTROLLERS
  // ========================================

  const autorController = new AutorController(autorService);

  const livroController = new LivroController(livroService, autorService);

  const exemplarController = new ExemplarController(exemplarService, livroService);

  const clienteController = new ClienteController(clienteService);

  const emprestimoController = new EmprestimoController(emprestimoService, clienteService, exemplarService);

  const relatorioController = new RelatorioController(relatorioService);


  // // ========================================
  // // MENU PRINCIPAL
  // // ========================================

  const menu = new MenuPrincipal(
    livroController,
    autorController,
    clienteController,
    exemplarController,
    emprestimoController,
    relatorioController,
  );

  await menu.executar();

  console.log("Obrigado por usar nosso sistema de biblioteca, até breve!");
}

main().catch((error) => {
  console.error("Erro inesperado:", error);

  process.exit(1);
});
