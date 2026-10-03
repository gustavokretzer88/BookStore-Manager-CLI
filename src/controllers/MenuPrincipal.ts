import { select } from "@inquirer/prompts";
import { LivroController } from "./LivroController";
import { AutorController } from "./AutorController";
import { ClienteController } from "./ClienteController";
import { ExemplarController } from "./ExemplarController";
import { EmprestimoController } from "./EmprestimoController";
import { RelatorioController } from "./RelatorioController";

enum OpcoesMenuPrincipal {
  livros,
  autores,
  exemplar,
  cliente,
  emprestimo,
  relatorios,
  sair,
}

export class MenuPrincipal {
  constructor(
    private readonly livroController: LivroController,
    private readonly atorController: AutorController,
    private readonly clienteController: ClienteController,
    private readonly exemplarView: ExemplarController,
    private readonly emprestimoController: EmprestimoController,
    private readonly relatoriosController: RelatorioController,
  ) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      const opcao = await this.mostrarOpcoes();

      switch (opcao) {
        case OpcoesMenuPrincipal.livros:
          await this.livroController.executar();
          break;
        case OpcoesMenuPrincipal.autores:
          await this.atorController.executar();
          break;
        case OpcoesMenuPrincipal.cliente:
          await this.clienteController.executar();
          break;
        case OpcoesMenuPrincipal.exemplar:
          await this.exemplarView.executar();
          break;
        case OpcoesMenuPrincipal.emprestimo:
          await this.emprestimoController.executar();
          break;
        case OpcoesMenuPrincipal.relatorios:
          await this.relatoriosController.executar();
        case OpcoesMenuPrincipal.sair:
          continuar = false;
          break;
        default:
      }
    }
  }

  private async mostrarOpcoes(): Promise<OpcoesMenuPrincipal> {
    return await select({
      message: "BookStore Manager",
      choices: [
        { name: "Livros", value: OpcoesMenuPrincipal.livros },
        { name: "Autores", value: OpcoesMenuPrincipal.autores },
        { name: "Exemplares", value: OpcoesMenuPrincipal.exemplar },
        { name: "Clientes", value: OpcoesMenuPrincipal.cliente },
        { name: "Empréstimos", value: OpcoesMenuPrincipal.emprestimo },
        { name: "Relatórios", value: OpcoesMenuPrincipal.relatorios },
        { name: "Sair", value: OpcoesMenuPrincipal.sair },
      ],
    });
  }
}
