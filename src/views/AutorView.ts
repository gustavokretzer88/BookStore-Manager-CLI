import { Autor } from "../models/Autor";
import Table from "cli-table3";
import { confirm, input, select } from "@inquirer/prompts";

export enum OpcoesMenuAutor {
  buscar,
  adicionar,
  atualizar,
  remover,
  sair,
}

export enum OpcoesBuscarAutorPor {
  listar,
  id,
  nome,
  sair,
}

export class AutorView {
  async mostrarOpcoes(): Promise<OpcoesMenuAutor> {
    return await select({
      message: "Gerenciador de autores:",
      choices: [
        {
          name: "Buscar",
          value: OpcoesMenuAutor.buscar,
        },
        {
          name: "Adicionar",
          value: OpcoesMenuAutor.adicionar,
        },
        {
          name: "Atualizar",
          value: OpcoesMenuAutor.atualizar,
        },
        {
          name: "Remover",
          value: OpcoesMenuAutor.remover,
        },
        {
          name: "Sair",
          value: OpcoesMenuAutor.sair,
        },
      ],
    });
  }

  async mostraOpcoesBuscarAutorPor(): Promise<OpcoesBuscarAutorPor> {
    return await select({
      message: "Buscar autor por:",
      choices: [
        {
          name: "Listar todos",
          value: OpcoesBuscarAutorPor.listar,
        },
        {
          name: "ID",
          value: OpcoesBuscarAutorPor.id,
        },
        {
          name: "Nome",
          value: OpcoesBuscarAutorPor.nome,
        },
        {
          name: "Sair",
          value: OpcoesBuscarAutorPor.sair,
        },
      ],
    });
  }

  async selecionaAutor(autores: Autor[]): Promise<Autor> {
    return await select({
      message: "Selecione o autor:",
      choices: autores.map((autor) => ({
        name: autor.nome,
        value: autor,
      })),
    });
  }

  mostrarAutores(autores: Autor[]): void {
    if (autores.length === 0) {
      console.log("\nNenhum autor encontrado.\n");
      return;
    }

    const tabela = new Table({
      head: ["ID", "Nome", "Nacionalidade", "Nascimento", "Falecimento"],
    });

    for (const autor of autores) {
      tabela.push([
        autor.id,
        autor.nome,
        autor.nacionalidade ?? "-",
        autor.ano_nascimento ?? "-",
        autor.ano_falecimento ?? "-",
      ]);
    }

    console.log(tabela.toString());
  }
}
