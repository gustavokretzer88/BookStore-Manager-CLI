import { Autor } from "../models/Autor";
import Table from "cli-table3";
import { confirm, input, select } from "@inquirer/prompts";
import { Livro } from "../models/Livro";
import { LivroComAutorDTO } from "../dtos/livro/LivroComAutorDTO";
import { BaseView } from "./BaseView";
import { CriarLivroDTO } from "../dtos/livro/CriarLivroDTO";

export enum OpcoesMenuLivros {
  buscar,
  adicionar,
  atualizar,
  remover,
  sair,
}

export enum OpcoesBuscarPor {
  todos,
  titulo,
  id,
  isbn,
  nomeAutor,
  numeroChamada,
  sair,
}

export class LivroView extends BaseView {
  async mostrarOpcoes(): Promise<OpcoesMenuLivros> {
    return await select({
      message: "Gerenciador de livros:",
      choices: [
        {
          name: "Buscar",
          value: OpcoesMenuLivros.buscar,
        },
        {
          name: "Adicionar",
          value: OpcoesMenuLivros.adicionar,
        },
        {
          name: "Atualizar",
          value: OpcoesMenuLivros.atualizar,
        },
        {
          name: "Remover",
          value: OpcoesMenuLivros.remover,
        },
        {
          name: "Sair",
          value: OpcoesMenuLivros.sair,
        },
      ],
    });
  }

  async mostrarOpcoesBuscarPor(): Promise<OpcoesBuscarPor> {
    return await select({
      message: "Buscar livro por:",
      choices: [
        {
          name: "Listar todos",
          value: OpcoesBuscarPor.todos,
        },
        {
          name: "Título",
          value: OpcoesBuscarPor.titulo,
        },
        {
          name: "ID",
          value: OpcoesBuscarPor.id,
        },
        {
          name: "ISBN",
          value: OpcoesBuscarPor.isbn,
        },
        {
          name: "Nome do autor",
          value: OpcoesBuscarPor.nomeAutor,
        },
        {
          name: "Número de chamada",
          value: OpcoesBuscarPor.numeroChamada,
        },
        {
          name: "Sair",
          value: OpcoesBuscarPor.sair,
        },
      ],
    });
  }

  async solicitaDadosCriarLivro(autores: Autor[]): Promise<CriarLivroDTO> {
    const titulo = await this.perguntar("Título do livro:");
    const isbn = await this.perguntar("ISBN (opcional):");
    const anoPublicacao = await this.perguntarNumero("Ano de publicação:");
    const numeroChamada = await this.perguntar("Número de chamada:");

    const autorId = await select({
      message: "Selecione o autor:",
      choices: autores.map((autor) => ({
        name: autor.nome,
        value: autor.id,
      })),
    });

    const dadosAutor: CriarLivroDTO = {
      titulo: titulo,
      isbn: isbn,
      ano_publicacao: anoPublicacao,
      numero_chamada: numeroChamada,
      autor_id: autorId,
    };
    return dadosAutor;
  }

  async solicitaDadosAtualizarLivro(
    livro: Livro,
    autores: Autor[],
  ): Promise<Livro> {
    const titulo = await input({
      message: "Título:",
      default: livro.titulo,
    });

    const isbn = await input({
      message: "ISBN:",
      default: livro.isbn ?? "",
    });

    const anoResposta = await input({
      message: "Ano de publicação:",
      default: livro.ano_publicacao?.toString() ?? "",
    });

    const numeroChamada = await input({
      message: "Número de chamada:",
      default: livro.numero_chamada ?? "",
    });

    const autorId = await select({
      message: "Selecione o autor:",
      choices: autores.map((autor) => ({
        name: autor.nome,
        value: autor.id,
      })),
      default: livro.autor_id,
    });

    const anoPublicacao = Number(anoResposta);

    if (
      anoPublicacao !== null &&
      (!Number.isInteger(anoPublicacao) || anoPublicacao <= 0)
    ) {
      throw new Error(
        "O ano de publicação deve ser um número inteiro maior que zero.",
      );
    }

    const livroAtualizado: Livro = {
      id: livro.id,
      titulo: titulo,
      isbn: isbn,
      ano_publicacao: anoPublicacao,
      numero_chamada: numeroChamada,
      autor_id: autorId,
    };
    return livroAtualizado;
  }

  mostrarLivros(livros: Livro[] | LivroComAutorDTO[], mensagem?: string): void {
    if (mensagem !== undefined && mensagem.length !== 0) {
      console.log(mensagem);
    }

    const labelColunaAutor =
      "autor_id" in livros[0]! ? "AutorID" : "Nome do autor";

    const tabela = new Table({
      head: ["ID", "Título", "ISBN", "Ano", "Nº chamada", labelColunaAutor],
    });

    for (const livro of livros) {
      tabela.push([
        livro.id,
        livro.titulo,
        livro.isbn ?? "-",
        livro.ano_publicacao ?? "-",
        livro.numero_chamada ?? "-",
        "autor_id" in livro ? livro.autor_id : livro.autor_nome,
      ]);
    }

    console.log(tabela.toString());
  }
}
