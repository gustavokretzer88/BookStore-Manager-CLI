import Table from "cli-table3";

import { input, select } from "@inquirer/prompts";
import { formatData } from "../utils/FormatData";
import { Emprestimo } from "../models/Emprestimo";
import { Cliente } from "../models/Cliente";
import { Exemplar } from "../models/Exemplar";
import { BaseView } from "./BaseView";
import { dataAtual } from "../utils/DataAtual";
import { CadastrarEmprestimoDTO } from "../dtos/emprestimo/CadastrarEmprestimoDTO";
import { DevolucaoEmprestimoDTO as DevolucaoEmprestimoDTO } from "../dtos/emprestimo/DevolucaoEmprestimoDTO";

export enum OpcoesMenuEmprestimo {
  buscar,
  realizar,
  devolver,
  remover,
  sair,
}

export enum OpcoesBuscarEmprestimo {
  listar,
  id,
  cliente,
  exemplar,
  ativos,
  sair,
}

export class EmprestimoView extends BaseView {
  async mostrarOpcoes(): Promise<OpcoesMenuEmprestimo> {
    return await select({
      message: "Gerenciamento de empréstimos:",
      choices: [
        {
          name: "Buscar empréstimos",
          value: OpcoesMenuEmprestimo.buscar,
        },
        {
          name: "Realizar empréstimo",
          value: OpcoesMenuEmprestimo.realizar,
        },
        {
          name: "Devolver exemplar",
          value: OpcoesMenuEmprestimo.devolver,
        },
        {
          name: "Remover empréstimo",
          value: OpcoesMenuEmprestimo.remover,
        },
        {
          name: "Voltar",
          value: OpcoesMenuEmprestimo.sair,
        },
      ],
    });
  }

  async mostrarOpcoesBuscarPor(): Promise<OpcoesBuscarEmprestimo> {
    return await select({
      message: "Buscar empréstimo por:",
      choices: [
        {
          name: "Listar todos",
          value: OpcoesBuscarEmprestimo.listar,
        },
        {
          name: "Buscar por ID",
          value: OpcoesBuscarEmprestimo.id,
        },
        {
          name: "Buscar por cliente",
          value: OpcoesBuscarEmprestimo.cliente,
        },
        {
          name: "Buscar por exemplar",
          value: OpcoesBuscarEmprestimo.exemplar,
        },
        {
          name: "Listar empréstimos ativos",
          value: OpcoesBuscarEmprestimo.ativos,
        },
        {
          name: "Voltar",
          value: OpcoesBuscarEmprestimo.sair,
        },
      ],
    });
  }

  mostrarEmprestimos(emprestimos: Emprestimo[], mensagem?: string): void {
    if (mensagem !== undefined && mensagem.length !== 0) {
      console.log(mensagem);
    }

    const tabela = new Table({
      head: [
        "ID",
        "Exemplar",
        "Cliente",
        "Data empréstimo",
        "Data devolução",
        "Status",
      ],
      colWidths: [6, 12, 12, 18, 18, 12],
      wordWrap: true,
    });

    for (const emprestimo of emprestimos) {
      tabela.push([
        emprestimo.id,
        emprestimo.exemplar_id,
        emprestimo.cliente_id,
        formatData(emprestimo.data_emprestimo),
        emprestimo.data_devolucao === null
          ? "-"
          : formatData(emprestimo.data_devolucao),
        emprestimo.data_devolucao !== null ? "Devolvido" : "Ativo",
      ]);
    }

    console.log("\n" + tabela.toString());
  }

  async selecionarCliente(clientes: Cliente[]): Promise<number> {
    return await select({
      message: "Selecione o cliente:",
      choices: clientes.map((cliente) => ({
        name: `${cliente.nome} — ${cliente.email}`,
        value: cliente.id,
      })),
    });
  }

  async selecionarExemplar(exemplares: Exemplar[]): Promise<number> {
    return await select({
      message: "Selecione o exemplar:",
      choices: exemplares.map((exemplar) => ({
        name: `${exemplar.codigo} — Livro ID ${exemplar.livro_id} — ${exemplar.estado_conservacao}`,
        value: exemplar.id,
      })),
    });
  }

  async selecionarEmprestimo(emprestimos: Emprestimo[]): Promise<number> {
    return await select({
      message: "Selecione o empréstimo:",
      choices: emprestimos.map((emprestimo) => ({
        name: this.descricaoEmprestimo(emprestimo),
        value: emprestimo.id,
      })),
    });
  }

  async lerId(message: string): Promise<number> {
    const resposta = await input({
      message,
    });

    const id = Number(resposta);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro maior que zero.");
    }
    return id;
  }

  async solicitaData(mensagem: string): Promise<string> {
    return await input({
      message: mensagem,
      default: dataAtual(),
    });
  }

  async solicitaDadosEmprestimo(
    clientes: Cliente[],
    exemplares: Exemplar[],
  ): Promise<CadastrarEmprestimoDTO> {
    const clienteId = await this.selecionarCliente(clientes);
    const exemplarId = await this.selecionarExemplar(exemplares);
    const dataEmprestimo = await this.solicitaData(
      "Data do empréstimo (AAAA-MM-DD):",
    );

    const dadosEmprestimo: CadastrarEmprestimoDTO = {
      exemplarId: exemplarId,
      clienteId: clienteId,
      dataEmprestimo: dataEmprestimo,
    };
    return dadosEmprestimo;
  }

  async solicitaDadosDevolucaoEmprestimo(
    emprestimos: Emprestimo[],
  ): Promise<DevolucaoEmprestimoDTO> {
    const emprestimoId = await this.selecionarEmprestimo(emprestimos);
    const dataDevolucao = await this.solicitaData(
      "Data da devolução (AAAA-MM-DD):",
    );
    const confirmar = await this.solicitaConfirmacao(
      `Confirmar devolução do empréstimo #${emprestimoId}?`,
    );
    if (!confirmar) throw new Error("Operação cancelada!");

    const dadosDevolucao: DevolucaoEmprestimoDTO = {
      emprestimo_id: emprestimoId,
      dataDevolucao: dataDevolucao,
    };
    return dadosDevolucao;
  }

  descricaoEmprestimo(emprestimo: Emprestimo): string {
    const status = emprestimo.data_devolucao ? "Devolvido" : "Ativo";

    return (
      `#${emprestimo.id} — ` +
      `Exemplar ${emprestimo.exemplar_id} — ` +
      `Cliente ${emprestimo.cliente_id} — ` +
      `${formatData(emprestimo.data_emprestimo)} — ` +
      status
    );
  }
}
