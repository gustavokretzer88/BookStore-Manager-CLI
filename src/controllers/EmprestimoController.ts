import { confirm, input, select } from "@inquirer/prompts";
import { Emprestimo } from "../models/Emprestimo";
import { formatData } from "../utils/FormatData";
import { EmprestimoService } from "../services/EmprestimoService";
import { ClienteService } from "../services/ClienteService";
import { ExemplarService } from "../services/ExemplarService";
import {
  OpcoesMenuEmprestimo,
  OpcoesBuscarEmprestimo,
  EmprestimoView,
} from "../views/EmprestimoView";
import { dataAtual } from "../utils/DataAtual";

export class EmprestimoController {
  private readonly emprestimoView: EmprestimoView = new EmprestimoView();
  constructor(
    private readonly emprestimoService: EmprestimoService,
    private readonly clienteService: ClienteService,
    private readonly exemplarService: ExemplarService,
  ) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      try {
        const opcao = await this.emprestimoView.mostrarOpcoes();

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

  private async buscar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      try {
        switch (await this.emprestimoView.mostrarOpcoesBuscarPor()) {
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

    this.emprestimoView.mostrarEmprestimos(emprestimos);
  }

  private async buscarPorId(): Promise<void> {
    const id = await this.emprestimoView.lerId("ID do empréstimo:");

    const emprestimo = await this.emprestimoService.buscarPorId(id);

    if (!emprestimo) {
      console.log("\nEmpréstimo não encontrado.");
      return;
    }

    this.emprestimoView.mostrarEmprestimos([emprestimo]);
  }

  private async buscarPorCliente(): Promise<void> {
    const clientes = await this.clienteService.buscarTodos();

    if (clientes.length === 0) {
      console.log("\nNenhum cliente cadastrado.");
      return;
    }

    const clienteId = await this.emprestimoView.selecionarCliente(clientes);

    const emprestimos =
      await this.emprestimoService.buscarPorCliente(clienteId);

    this.emprestimoView.mostrarEmprestimos(emprestimos);
  }

  private async buscarPorExemplar(): Promise<void> {
    const exemplares = await this.exemplarService.buscarTodos();

    if (exemplares.length === 0) {
      console.log("\nNenhum exemplar cadastrado.");
      return;
    }

    const exemplarId = await this.emprestimoView.selecionarExemplar(exemplares);

    const emprestimos =
      await this.emprestimoService.buscarPorExemplar(exemplarId);

    this.emprestimoView.mostrarEmprestimos(emprestimos);
  }

  private async listarAtivos(): Promise<void> {
    const emprestimos = await this.emprestimoService.buscarAtivos();

    this.emprestimoView.mostrarEmprestimos(emprestimos);
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

    const clienteId = await this.emprestimoView.selecionarCliente(clientes);

    const exemplarId = await this.emprestimoView.selecionarExemplar(exemplares);

    const dataEmprestimo = await input({
      message: "Data do empréstimo (AAAA-MM-DD):",
      default: dataAtual(),
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
      default: dataAtual(),
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

    const emprestimo = await this.emprestimoService.buscarPorId(emprestimoId);

    if (!emprestimo) {
      console.log("\nEmpréstimo não encontrado.");
      return;
    }

    this.emprestimoView.mostrarEmprestimos([emprestimo]);

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
}
