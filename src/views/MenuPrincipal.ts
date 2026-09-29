import { select } from "@inquirer/prompts";
import { LivroView } from "./LivroView";
import { AutorView } from "./AutoresView";
import { ClienteView } from "./ClienteView";
import { ExemplarView } from "./ExemplarView";
import { EmprestimoView } from "./EmprestimoView";

enum OpcoesMenuPrincipal {
  livros,
  autores,
  exemplar,
  cliente,
  emprestimo,
  sair,
}

export class MenuPrincipal {
  constructor(
    private readonly livroView: LivroView,
    private readonly atorView: AutorView,
    private readonly clienteView: ClienteView,
    private readonly exemplarView: ExemplarView,
    private readonly emprestimoView: EmprestimoView,
  ) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      const opcao = await this.mostrarOpcoes();
      console.log("\n");

      switch (opcao) {
        case OpcoesMenuPrincipal.livros:
          await this.livroView.executar();
          break;
        case OpcoesMenuPrincipal.autores:
          await this.atorView.executar();
          break;
        case OpcoesMenuPrincipal.cliente:
          await this.clienteView.executar();
          break;
        case OpcoesMenuPrincipal.exemplar:
          await this.exemplarView.executar();
          break;
        case OpcoesMenuPrincipal.emprestimo:
          await this.emprestimoView.executar();
          break;
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
        { name: "Sair", value: OpcoesMenuPrincipal.sair },
      ],
    });
  }
}
