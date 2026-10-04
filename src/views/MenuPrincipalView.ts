import { select } from "@inquirer/prompts";

export enum OpcoesMenuPrincipal {
  livros,
  autores,
  exemplar,
  cliente,
  emprestimo,
  relatorios,
  sair,
}

export class MenuPrincipalView {
  async mostrarOpcoes(): Promise<OpcoesMenuPrincipal> {
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
