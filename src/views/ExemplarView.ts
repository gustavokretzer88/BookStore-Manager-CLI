import Table from "cli-table3";
import { confirm, input, select } from "@inquirer/prompts";

export enum OpcoesMenuExemplar {
  buscar,
  adicionar,
  atualizar,
  remover,
  sair,
}

export enum OpcoesBuscarExemplarPor {
  todos,
  id,
  codigo,
  livro,
  estado,
  disponiveis,
  sair,
}

export class ExemplarView {
  async mostrarOpcoes(): Promise<OpcoesMenuExemplar> {
    return await select({
      message: "Gerenciador de exemplares:",
      choices: [
        {
          name: "Buscar",
          value: OpcoesMenuExemplar.buscar,
        },
        {
          name: "Adicionar",
          value: OpcoesMenuExemplar.adicionar,
        },
        {
          name: "Atualizar",
          value: OpcoesMenuExemplar.atualizar,
        },
        {
          name: "Remover",
          value: OpcoesMenuExemplar.remover,
        },
        {
          name: "Sair",
          value: OpcoesMenuExemplar.sair,
        },
      ],
    });
  }

  async mostrarOpcoesBusca(): Promise<OpcoesBuscarExemplarPor> {
    return await select({
      message: "Buscar exemplar por:",
      choices: [
        {
          name: "Listar todos",
          value: OpcoesBuscarExemplarPor.todos,
        },
        {
          name: "ID",
          value: OpcoesBuscarExemplarPor.id,
        },
        {
          name: "Código",
          value: OpcoesBuscarExemplarPor.codigo,
        },
        {
          name: "Livro",
          value: OpcoesBuscarExemplarPor.livro,
        },
        {
          name: "Estado de conservação",
          value: OpcoesBuscarExemplarPor.estado,
        },
        {
          name: "Disponíveis",
          value: OpcoesBuscarExemplarPor.disponiveis,
        },
        {
          name: "Sair",
          value: OpcoesBuscarExemplarPor.sair,
        },
      ],
    });
  }
}
