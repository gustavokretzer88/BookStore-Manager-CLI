import { confirm, input, select } from "@inquirer/prompts";
import Table from "cli-table3";


import { Emprestimo } from "../models/Emprestimo";
import { Cliente } from "../models/Cliente";
import { Exemplar } from "../models/Exemplar";

import { formatData } from "../utils/FormatData";
import { EmprestimoService } from "../services/EmprestimoService";
import { ClienteService } from "../services/ClienteService";
import { ExemplarService } from "../services/ExemplarService";

enum OpcoesMenuEmprestimo {
  buscar,
  realizar,
  devolver,
  remover,
  sair,
}

enum OpcoesBuscarEmprestimo {
  listar,
  id,
  cliente,
  exemplar,
  ativos,
  sair,
}

export class EmprestimoController {
  constructor(
    private readonly emprestimoService: EmprestimoService,
    private readonly clienteService: ClienteService,
    private readonly exemplarService: ExemplarService,
  ) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      try {
        const opcao = await this.mostrarOpcoes();

        switch (opcao) {
          case OpcoesMenuEmprestimo.buscar:
            await this.buscar();
            break;

          case OpcoesMenuEmprestimo.realizar:
            await this.realizar();
            break;

          case OpcoesMenuEmprestimo.devolver:
            await this.devolver();
            break;

          case OpcoesMenuEmprestimo.remover:
            await this.remover();
            break;

          case OpcoesMenuEmprestimo.sair:
            continuar = false;
            break;
        }
      } catch (erro) {
        console.error("\nErro:", erro instanceof Error ? erro.message : erro);
      }
    }
  }

  private async mostrarOpcoes(): Promise<OpcoesMenuEmprestimo> {
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

  private async buscar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      const opcao = await select({
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

      try {
        switch (opcao) {
          case OpcoesBuscarEmprestimo.listar:
            await this.listar();
            break;

          case OpcoesBuscarEmprestimo.id:
            await this.buscarPorId();
            break;

          case OpcoesBuscarEmprestimo.cliente:
            await this.buscarPorCliente();
            break;

          case OpcoesBuscarEmprestimo.exemplar:
            await this.buscarPorExemplar();
            break;

          case OpcoesBuscarEmprestimo.ativos:
            await this.listarAtivos();
            break;

          case OpcoesBuscarEmprestimo.sair:
            continuar = false;
            break;
        }
      } catch (erro) {
        console.error("\nErro:", erro instanceof Error ? erro.message : erro);
      }
    }
  }

  private async listar(): Promise<void> {
    const emprestimos = await this.emprestimoService.buscarTodos();

    this.mostrarEmprestimos(emprestimos);
  }

  private async buscarPorId(): Promise<void> {
    const id = await this.lerId("ID do empréstimo:");

    const emprestimo = await this.emprestimoService.buscarPorId(id);

    if (!emprestimo) {
      console.log("\nEmpréstimo não encontrado.");
      return;
    }

    this.mostrarEmprestimos([emprestimo]);
  }

  private async buscarPorCliente(): Promise<void> {
    const clientes = await this.clienteService.buscarTodos();

    if (clientes.length === 0) {
      console.log("\nNenhum cliente cadastrado.");
      return;
    }

    const clienteId = await this.selecionarCliente(clientes);

    const emprestimos =
      await this.emprestimoService.buscarPorCliente(clienteId);

    this.mostrarEmprestimos(emprestimos);
  }

  private async buscarPorExemplar(): Promise<void> {
    const exemplares = await this.exemplarService.buscarTodos();

    if (exemplares.length === 0) {
      console.log("\nNenhum exemplar cadastrado.");
      return;
    }

    const exemplarId = await this.selecionarExemplar(exemplares);

    const emprestimos =
      await this.emprestimoService.buscarPorExemplar(exemplarId);

    this.mostrarEmprestimos(emprestimos);
  }

  private async listarAtivos(): Promise<void> {
    const emprestimos = await this.emprestimoService.buscarAtivos();

    this.mostrarEmprestimos(emprestimos);
  }

  private async realizar(): Promise<void> {
    const clientes = await this.clienteService.buscarTodos();

    if (clientes.length === 0) {
      throw new Error(
        "Não existem clientes cadastrados para realizar o empréstimo.",
      );
    }

    const exemplares = await this.exemplarService.buscarDisponiveis();

    if (exemplares.length === 0) {
      throw new Error("Não existem exemplares disponíveis para empréstimo.");
    }

    console.log("\n=== Novo empréstimo ===\n");

    const clienteId = await this.selecionarCliente(clientes);

    const exemplarId = await this.selecionarExemplar(exemplares);

    const dataEmprestimo = await input({
      message: "Data do empréstimo (AAAA-MM-DD):",
      default: this.dataAtual(),
    });

    const emprestimo = await this.emprestimoService.cadastrar(
      exemplarId,
      clienteId,
      dataEmprestimo,
    );

    console.log(`\nEmpréstimo #${emprestimo.id} realizado com sucesso.`);
  }

  private async devolver(): Promise<void> {
    const emprestimos = await this.emprestimoService.buscarAtivos();

    if (emprestimos.length === 0) {
      console.log("\nNão existem empréstimos ativos.");
      return;
    }

    console.log("\n=== Devolução de exemplar ===\n");

    const emprestimoId = await select({
      message: "Selecione o empréstimo:",
      choices: emprestimos.map((emprestimo) => ({
        name: this.descricaoEmprestimo(emprestimo),
        value: emprestimo.id,
      })),
    });

    const confirmar = await confirm({
      message: `Confirmar devolução do empréstimo #${emprestimoId}?`,
      default: true,
    });

    if (!confirmar) {
      console.log("\nOperação cancelada.");
      return;
    }

    const dataDevolucao = await input({
      message: "Data da devolução (AAAA-MM-DD):",
      default: this.dataAtual(),
    });

    const emprestimo = await this.emprestimoService.devolver(
      emprestimoId,
      dataDevolucao,
    );

    if (!emprestimo) {
      console.log("\nEmpréstimo não encontrado.");
      return;
    }

    console.log(`\nEmpréstimo #${emprestimo.id} devolvido com sucesso.`);
  }

  private async remover(): Promise<void> {
    const emprestimos = await this.emprestimoService.buscarTodos();

    if (emprestimos.length === 0) {
      console.log("\nNenhum empréstimo cadastrado.");
      return;
    }

    const emprestimoId = await select({
      message: "Selecione o empréstimo que deseja remover:",
      choices: emprestimos.map((emprestimo) => ({
        name: this.descricaoEmprestimo(emprestimo),
        value: emprestimo.id,
      })),
    });

    const emprestimo =
      await this.emprestimoService.buscarPorId(emprestimoId);

    if (!emprestimo) {
      console.log("\nEmpréstimo não encontrado.");
      return;
    }

    this.mostrarEmprestimos([emprestimo]);

    const confirmar = await confirm({
      message: `Deseja realmente remover o empréstimo #${emprestimo.id}?`,
      default: false,
    });

    if (!confirmar) {
      console.log("\nOperação cancelada.");
      return;
    }

    const removido = await this.emprestimoService.excluir(emprestimo.id);

    if (removido) {
      console.log("\nEmpréstimo removido com sucesso.");
    } else {
      console.log("\nEmpréstimo não encontrado.");
    }
  }

  private async selecionarCliente(clientes: Cliente[]): Promise<number> {
    return await select({
      message: "Selecione o cliente:",
      choices: clientes.map((cliente) => ({
        name: `${cliente.nome} — ${cliente.email}`,
        value: cliente.id,
      })),
    });
  }

  private async selecionarExemplar(exemplares: Exemplar[]): Promise<number> {
    return await select({
      message: "Selecione o exemplar:",
      choices: exemplares.map((exemplar) => ({
        name: `${exemplar.codigo} — Livro ID ${exemplar.livro_id} — ${exemplar.estado_conservacao}`,
        value: exemplar.id,
      })),
    });
  }

  private async lerId(message: string): Promise<number> {
    const resposta = await input({
      message,
    });

    const id = Number(resposta);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro maior que zero.");
    }

    return id;
  }

  private mostrarEmprestimos(emprestimos: Emprestimo[]): void {
    if (emprestimos.length === 0) {
      console.log("\nNenhum empréstimo encontrado.");
      return;
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

  private descricaoEmprestimo(emprestimo: Emprestimo): string {
    const status = emprestimo.data_devolucao ? "Devolvido" : "Ativo";

    return (
      `#${emprestimo.id} — ` +
      `Exemplar ${emprestimo.exemplar_id} — ` +
      `Cliente ${emprestimo.cliente_id} — ` +
      `${formatData(emprestimo.data_emprestimo)} — ` +
      status
    );
  }

  private dataAtual(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
