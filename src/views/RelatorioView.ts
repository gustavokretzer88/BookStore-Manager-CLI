import { select } from "@inquirer/prompts";
import { LivrosPorAutorDTO } from "../dtos/relatorio/LivrosPorAutorDTO";
import { RelatorioController } from "../controllers/RelatorioController";

import Table from "cli-table3";
import { EmprestimosPorLivroDTO } from "../dtos/relatorio/EmprestimosPorLivroDTO";

enum OpcoesMenuRelatorio {
  numLivrosPorAutor,
  numEmprestimoPorLivro,
  sair,
}

export class RelatorioView {
  constructor(private readonly relatorioController: RelatorioController) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      const opcao = await this.mostrarOpcoes();

      switch (opcao) {
        case OpcoesMenuRelatorio.numLivrosPorAutor:
          await this.livrosPorAutor();
          break;
        case OpcoesMenuRelatorio.numEmprestimoPorLivro:
          await this.emprestimoPorLivro();
          break;
        case OpcoesMenuRelatorio.sair:
          continuar = false;
          break;
        default:
      }
    }
  }

  private async mostrarOpcoes(): Promise<OpcoesMenuRelatorio> {
    return await select({
      message: "Gerenciador de livros:",
      choices: [
        {
          name: "Número de livros por autor",
          value: OpcoesMenuRelatorio.numLivrosPorAutor,
        },
        {
          name: "Número de empréstimo por livro",
          value: OpcoesMenuRelatorio.numEmprestimoPorLivro,
        },
        {
          name: "Sair",
          value: OpcoesMenuRelatorio.sair,
        },
      ],
    });
  }

  private async livrosPorAutor(): Promise<void> {
    this.mostrarLivrosPorAutor(await this.relatorioController.livrosPorAutor());
  }

  private async emprestimoPorLivro(): Promise<void> {
    this.mostraEmprestimoPorLivro(
      await this.relatorioController.emprestimosPorLivro(),
    );
  }

  private mostrarLivrosPorAutor(dados: LivrosPorAutorDTO[]): void {
    if (dados.length === 0) {
      console.log("Não há dados para serem exibidos");
      return;
    }

    const table = new Table({
      head: ["Autor", "Quantidade de livros"],
    });

    dados.forEach((item) => {
      table.push([item.autor_nome, item.quantidade_livros]);
    });

    console.log(table.toString());
  }

  private mostraEmprestimoPorLivro(dados: EmprestimosPorLivroDTO[]) {
    if (dados.length === 0) {
      console.log("Não há dados para serem exibidos");
      return;
    }
    const table = new Table({
      head: ["Livro", "Autor", "Empréstimos"],
    });
    dados.forEach((item) => {
      table.push([item.titulo, item.autor_nome, item.quantidade_emprestimos]);
    });
    console.log(table.toString());
  }
}
