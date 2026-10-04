import Table from "cli-table3";
import { LivrosPorAutorDTO } from "../dtos/relatorio/LivrosPorAutorDTO";
import { EmprestimosPorLivroDTO } from "../dtos/relatorio/EmprestimosPorLivroDTO";
import { LivroTituloAutorDTO } from "../dtos/relatorio/LivroTituloAutorDTO";
import { select } from "@inquirer/prompts";

export enum OpcoesMenuRelatorio {
  numLivrosPorAutor,
  numEmprestimoPorLivro,
  livrosDisponiveis,
  livrosComEmprestimos,
  livrosPorAutor,
  clientesComEmprestimoAtivo,
  sair,
}

export class RelatorioView {
  async mostrarOpcoes(): Promise<OpcoesMenuRelatorio> {
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
          name: "Livros com exemplares disponíveis",
          value: OpcoesMenuRelatorio.livrosDisponiveis,
        },
        {
          name: "Livros com empréstimos ativo.",
          value: OpcoesMenuRelatorio.livrosComEmprestimos,
        },
        {
          name: "Livros cadastrados por autor.",
          value: OpcoesMenuRelatorio.livrosPorAutor,
        },
        {
          name: "Clientes com empréstimos.",
          value: OpcoesMenuRelatorio.clientesComEmprestimoAtivo,
        },
        {
          name: "Sair",
          value: OpcoesMenuRelatorio.sair,
        },
      ],
    });
  }

  mostrarLivrosPorAutor(dados: LivrosPorAutorDTO[], mensagem?: string): void {
    if (mensagem !== undefined && mensagem.length !== 0) {
      console.log(mensagem);
    }

    const table = new Table({
      head: ["Autor", "Quantidade de livros"],
    });

    dados.forEach((item) => {
      table.push([item.autor_nome, item.quantidade_livros]);
    });

    console.log(table.toString());
  }

  mostraEmprestimoPorLivro(
    dados: EmprestimosPorLivroDTO[],
    mensagem?: string,
  ): void {
    if (mensagem !== undefined && mensagem.length !== 0) {
      console.log(mensagem);
    }
    const table = new Table({
      head: ["Livro", "Autor", "Empréstimos"],
    });
    dados.forEach((item) => {
      table.push([item.titulo, item.autor_nome, item.quantidade_emprestimos]);
    });
    console.log(table.toString());
  }

  mostraLivrosEAutor(dados: LivroTituloAutorDTO[], mensagem?: string): void {
    if (mensagem !== undefined && mensagem.length !== 0) {
      console.log(mensagem);
    }
    const table = new Table({
      head: ["Livro", "Autor"],
    });
    dados.forEach((item) => {
      table.push([item.titulo, item.autor_nome]);
    });
    console.log(table.toString());
  }
}
