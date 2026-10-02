// import { select } from "@inquirer/prompts";
// import { MenuPrincipal } from "./views/MenuPrincipal";
// import { LivroView } from "./views/LivroView";
// import { LivroController } from "./controllers/LivroController";
// import { LivroService } from "./services/LivroService";
// import { LivroRepository } from "./repositories/LivroRepository";
// import { AutorRepository } from "./repositories/AutorRepository";

// async function main(): Promise<void> {
//   const livroRepository = new LivroRepository();
//   const autorRepository = new AutorRepository();

//   const livroService = new LivroService(livroRepository, autorRepository);
//   const livroController = new LivroController(livroService);
//   const livroView = new LivroView(livroController);
//       const menu = new MenuPrincipal(livroView);
//       await menu.executar();
//       console.log("Obrigado por usar nosso sistema de biblioteca, até breve!");
//       process.exit(0);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });

import { MenuPrincipal } from "./views/MenuPrincipal";

//import { AutorView } from './views/AutorView';
import { LivroView } from "./views/LivroView";
//import { ExemplarView } from './views/ExemplarView';
//import { ClienteView } from './views/ClienteView';
//import { EmprestimoView } from './views/EmprestimoView';

import { AutorController } from "./controllers/AutorController";
import { LivroController } from "./controllers/LivroController";
import { ExemplarController } from "./controllers/ExemplarController";
import { ClienteController } from "./controllers/ClienteController";
import { EmprestimoController } from "./controllers/EmprestimoController";

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
import { AutorView } from "./views/AutoresView";
import { ClienteView } from "./views/ClienteView";
import { ExemplarView } from "./views/ExemplarView";
import { EmprestimoView } from "./views/EmprestimoView";
import { RelatorioController } from "./controllers/RelatorioController";
import { RelatorioService } from "./services/RelatorioService";
import { RelatorioRepository } from "./repositories/RelatorioRepository";
import { RelatorioView } from "./views/RelatorioView";

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

  const livroController = new LivroController(livroService);

  const exemplarController = new ExemplarController(exemplarService);

  const clienteController = new ClienteController(clienteService);

  const emprestimoController = new EmprestimoController(emprestimoService);

  const relatorioController = new RelatorioController(relatorioService);

  // ========================================
  // VIEWS
  // ========================================

  const autorView: AutorView = new AutorView(autorController);

  const livroView: LivroView = new LivroView(livroController, autorController);

  const exemplarView = new ExemplarView(exemplarController, livroController);

  const clienteView = new ClienteView(clienteController);

  const emprestimoView = new EmprestimoView(
    emprestimoController,
    clienteController,
    exemplarController,
  );

  const relatorioView = new RelatorioView(relatorioController);

  // ========================================
  // MENU PRINCIPAL
  // ========================================

  const menu = new MenuPrincipal(
    livroView,
    autorView,
    clienteView,
    exemplarView,
    emprestimoView,
    relatorioView,
  );

  await menu.executar();

  console.log("Obrigado por usar nosso sistema de biblioteca, até breve!");
}

main().catch((error) => {
  console.error("Erro inesperado:", error);

  process.exit(1);
});
