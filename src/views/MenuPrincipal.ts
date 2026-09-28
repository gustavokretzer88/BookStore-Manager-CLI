import { select } from "@inquirer/prompts";
import { LivroView } from "./LivroView";

enum OpcoesMenuPrincipal {
  livros,
  autores,
  exemplar,
  cliente,
  emprestimo,
  sair,
}

export class MenuPrincipal {
  constructor(private readonly livroView: LivroView) {}

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
          break;

        case OpcoesMenuPrincipal.exemplar:
          break;

        case OpcoesMenuPrincipal.cliente:
          break;

        case OpcoesMenuPrincipal.emprestimo:
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
