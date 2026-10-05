import { RelatorioService } from "../services/RelatorioService";
import { AutorService } from "../services/AutorService";
import { ClienteView } from "../views/ClienteView";
import { AutorView } from "../views/AutorView";
import { OpcoesMenuRelatorio, RelatorioView } from "../views/RelatorioView";

export class RelatorioController {
  private readonly relatorioView: RelatorioView = new RelatorioView();
  private readonly clienteView: ClienteView = new ClienteView();
  private readonly autorView: AutorView = new AutorView();

  constructor(
    private readonly relatorioService: RelatorioService,
    private readonly autorService: AutorService,
  ) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      switch (await this.relatorioView.mostrarOpcoes()) {
        case OpcoesMenuRelatorio.numLivrosPorAutor:
          await this.livrosPorAutor();
          break;
        case OpcoesMenuRelatorio.numEmprestimoPorLivro:
          await this.emprestimoPorLivro();
          break;
        case OpcoesMenuRelatorio.livrosDisponiveis:
          await this.livrosDisponiveis();
          break;
        case OpcoesMenuRelatorio.livrosComEmprestimos:
          await this.livrosComEmprestimos();
          break;
        case OpcoesMenuRelatorio.livrosPorAutor:
          await this.livrosCadastradosPorAutor();
          break;
        case OpcoesMenuRelatorio.clientesComEmprestimoAtivo:
          await this.clientesComEmprestimoAtivo();
          break;
        case OpcoesMenuRelatorio.sair:
          continuar = false;
          break;
        default:
      }
    }
  }

  private async livrosPorAutor(): Promise<void> {
    this.relatorioView.mostrarLivrosPorAutor(
      await this.relatorioService.livrosPorAutor(),
      "Número de livros por autor:",
    );
  }

  private async emprestimoPorLivro(): Promise<void> {
    this.relatorioView.mostraEmprestimoPorLivro(
      await this.relatorioService.buscarEmprestimosPorLivro(),
      "Número de empréstimos por livro:",
    );
  }

  private async livrosDisponiveis(): Promise<void> {
    this.relatorioView.mostraLivrosEAutor(
      await this.relatorioService.buscarLivrosDisponiveis(),
      "Livros com exemplares disponível:",
    );
  }

  private async livrosComEmprestimos(): Promise<void> {
    this.relatorioView.mostraLivrosEAutor(
      await this.relatorioService.buscarLivrosComEmprestimo(),
      "Livros com exemplares emprestados:",
    );
  }

  private async clientesComEmprestimoAtivo(): Promise<void> {
    this.clienteView.mostrarClientes(
      await this.relatorioService.clientesComEmprestimoAtivo(),
      "Clientes com empréstimos ativo:",
    );
  }

  private async livrosCadastradosPorAutor(): Promise<void> {
    const autores = await this.autorService.buscarTodos();
    if (autores.length === 0) {
      throw new Error(
        "Não é possível efetuar a operação pois não existem autores cadastrados.",
      );
    }
    this.autorView.mostrarAutores([
      await this.autorView.selecionaAutor(autores),
    ]);
  }
}
