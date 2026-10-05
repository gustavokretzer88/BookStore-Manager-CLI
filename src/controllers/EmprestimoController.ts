import { EmprestimoService } from "../services/EmprestimoService";
import { ClienteService } from "../services/ClienteService";
import { ExemplarService } from "../services/ExemplarService";
import {
  OpcoesMenuEmprestimo,
  OpcoesBuscarEmprestimo,
  EmprestimoView,
} from "../views/EmprestimoView";

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
      switch (await this.emprestimoView.mostrarOpcoes()) {
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
    }
  }

  private async buscar(): Promise<void> {
    let continuar = true;

    while (continuar) {
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
    }
  }

  private async listar(): Promise<void> {
    const emprestimos = await this.emprestimoService.buscarTodos();
    this.emprestimoView.mostrarEmprestimos(emprestimos);
  }

  private async buscarPorId(): Promise<void> {
    const id = await this.emprestimoView.lerId("ID do empréstimo:");

    const emprestimo = await this.emprestimoService.buscarPorId(id);

    if (!emprestimo) throw new Error("Empréstimo não encontrado.");

    this.emprestimoView.mostrarEmprestimos([emprestimo]);
  }

  private async buscarPorCliente(): Promise<void> {
    const clientes = await this.clienteService.buscarTodos();
    if (clientes.length === 0) throw new Error("Nenhum cliente cadastrado.");

    const clienteId = await this.emprestimoView.selecionarCliente(clientes);

    const emprestimos =
      await this.emprestimoService.buscarPorCliente(clienteId);

    this.emprestimoView.mostrarEmprestimos(emprestimos);
  }

  private async buscarPorExemplar(): Promise<void> {
    const exemplares = await this.exemplarService.buscarTodos();

    if (exemplares.length === 0) throw new Error("Nenhum exemplar cadastrado.");

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
    if (clientes.length === 0)
      throw new Error(
        "Não existem clientes cadastrados para realizar o empréstimo.",
      );

    const exemplares = await this.exemplarService.buscarDisponiveis();
    if (exemplares.length === 0)
      throw new Error("Não existem exemplares disponíveis para empréstimo.");

    const dadosEmprestimo = await this.emprestimoView.solicitaDadosEmprestimo(
      clientes,
      exemplares,
    );
    const emprestimo = await this.emprestimoService.cadastrar(dadosEmprestimo);
    this.emprestimoView.mensagemSucesso(
      `\nEmpréstimo #${emprestimo.id} realizado com sucesso.`,
    );
  }

  private async devolver(): Promise<void> {
    const emprestimos = await this.emprestimoService.buscarAtivos();
    if (emprestimos.length === 0) {
      this.emprestimoView.mensagem("Não existem empréstimo ativo.");
      return;
    }
    const dadosEmprestimo =
      await this.emprestimoView.solicitaDadosDevolucaoEmprestimo(emprestimos);
    const emprestimo = await this.emprestimoService.devolver(dadosEmprestimo);

    if (!emprestimo) throw new Error("Empréstimo não encontrado.");

    this.emprestimoView.mensagemSucesso(
      `\nEmpréstimo #${emprestimo.id} devolvido com sucesso.`,
    );
  }

  private async remover(): Promise<void> {
    const emprestimos = await this.emprestimoService.buscarTodos();

    if (emprestimos.length === 0)
      throw new Error("Nenhum empréstimo cadastrado.");

    const emprestimoId =
      await this.emprestimoView.selecionarEmprestimo(emprestimos);

    const emprestimo = await this.emprestimoService.buscarPorId(emprestimoId);
    if (!emprestimo) throw new Error("Empréstimo não encontrado.");

    this.emprestimoView.mostrarEmprestimos([emprestimo]);

    const confirmar = await this.emprestimoView.solicitaConfirmacao(
      `Deseja realmente remover o empréstimo #${emprestimo.id}?`,
    );
    if (!confirmar) return;

    const removido = await this.emprestimoService.excluir(emprestimo.id);

    if (removido) {
      this.emprestimoView.mensagemSucesso("Empréstimo removido com sucesso.");
    } else {
      this.emprestimoView.mensagemErro("Empréstimo não encontrado.");
    }
  }
}
