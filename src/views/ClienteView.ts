import Table from "cli-table3";
import { Cliente } from "../models/Cliente";
import { input, select } from "@inquirer/prompts";
import { BaseView } from "./BaseView";
import { CriarClienteDTO } from "../dtos/cliente/CriarClienteDTO";

export enum OpcoesMenuCliente {
  buscar,
  adicionar,
  atualizar,
  remover,
  sair,
}

export enum OpcaoBuscarClientePor {
  todos,
  id,
  nome,
  email,
  sair,
}

export class ClienteView extends BaseView {
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

  async mostraOpcoesBuscarClientePor(): Promise<OpcaoBuscarClientePor> {
    return await select({
      message: "Buscar cliente por:",
      choices: [
        {
          name: "Listar todos",
          value: OpcaoBuscarClientePor.todos,
        },
        {
          name: "ID",
          value: OpcaoBuscarClientePor.id,
        },
        {
          name: "Nome",
          value: OpcaoBuscarClientePor.nome,
        },
        {
          name: "E-mail",
          value: OpcaoBuscarClientePor.email,
        },
        {
          name: "Sair",
          value: OpcaoBuscarClientePor.sair,
        },
      ],
    });
  }

  async solicitaDadosCliente(): Promise<CriarClienteDTO> {
    const nome = await input({
      message: "Nome do cliente:",
    });

    const email = await input({
      message: "E-mail:",
    });

    const telefone =
      (
        await input({
          message: "Telefone (opcional):",
        })
      ).trim() || null;

    const dadosCliente: CriarClienteDTO = {
      nome: nome,
      email: email,
      telefone: telefone,
    };
    return dadosCliente;
  }

  async solicitaDadosAtualizarCliente(cliente: Cliente): Promise<Cliente> {
    let clienteAtualizado: Cliente = {
      id: cliente.id,
      nome: "",
      email: "",
      telefone: null,
    };
    clienteAtualizado.nome = await input({
      message: "Nome:",
      default: cliente.nome,
    });

    clienteAtualizado.email = await input({
      message: "E-mail:",
      default: cliente.email,
    });

    clienteAtualizado.telefone =
      (
        await input({
          message: "Telefone:",
          default: cliente.telefone ?? "",
        })
      ).trim() || null;

    return clienteAtualizado;
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
