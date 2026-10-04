import Table from "cli-table3";
import { Cliente } from "../models/Cliente";
import { select } from "@inquirer/prompts";

export enum OpcoesMenuCliente {
  buscar,
  adicionar,
  atualizar,
  remover,
  sair,
}

export class ClienteView {
  async mostrarOpcoes(): Promise<OpcoesMenuCliente> {
    return await select({
      message: "Gerenciador de clientes:",
      choices: [
        {
          name: "Buscar",
          value: OpcoesMenuCliente.buscar,
        },
        {
          name: "Adicionar",
          value: OpcoesMenuCliente.adicionar,
        },
        {
          name: "Atualizar",
          value: OpcoesMenuCliente.atualizar,
        },
        {
          name: "Remover",
          value: OpcoesMenuCliente.remover,
        },
        {
          name: "Sair",
          value: OpcoesMenuCliente.sair,
        },
      ],
    });
  }

  mostrarClientes(clientes: Cliente[], mensagem?: string): void {
    if (mensagem !== undefined && mensagem.length !== 0) {
      console.log(mensagem);
    }

    const tabela = new Table({
      head: ["ID", "Nome", "E-mail", "Telefone"],
    });

    for (const cliente of clientes) {
      tabela.push([
        cliente.id,
        cliente.nome,
        cliente.email,
        cliente.telefone ?? "-",
      ]);
    }

    console.log(tabela.toString());
  }
}
