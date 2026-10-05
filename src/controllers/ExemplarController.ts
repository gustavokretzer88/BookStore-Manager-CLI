import { ExemplarService } from "../services/ExemplarService";
import { LivroService } from "../services/LivroService";
import {
  ExemplarView,
  OpcoesBuscarExemplarPor,
  OpcoesMenuExemplar,
} from "../views/ExemplarView";

export class ExemplarController {
  private readonly exemplarView: ExemplarView = new ExemplarView();
  constructor(
    private readonly exemplarService: ExemplarService,
    private readonly livroService: LivroService,
  ) {}

  async executar(): Promise<void> {
    let continuar = true;

    do {
      switch (await this.exemplarView.mostrarOpcoes()) {
        case OpcoesMenuExemplar.buscar:
          await this.buscar();
          break;
        case OpcoesMenuExemplar.adicionar:
          await this.adicionar();
          break;
        case OpcoesMenuExemplar.atualizar:
          await this.atualizar();
          break;
        case OpcoesMenuExemplar.remover:
          await this.remover();
          break;
        case OpcoesMenuExemplar.sair:
          continuar = false;
          break;
      }
    } while (continuar);
  }

  private async buscar(): Promise<void> {
    const selecao = await this.exemplarView.mostrarOpcoesBusca();

    switch (selecao) {
      case OpcoesBuscarExemplarPor.todos:
        await this.buscarExemplarPorTodos();
        break;
      case OpcoesBuscarExemplarPor.id:
        await this.buscarExemplarPorId();
        break;
      case OpcoesBuscarExemplarPor.codigo:
        await this.buscarExemplarPorCodigo();
        break;
      case OpcoesBuscarExemplarPor.livro:
        await this.buscarExemplarPorLivro();
        break;
      case OpcoesBuscarExemplarPor.estado:
        await this.buscarExemplarPorEstado();
        break;
      case OpcoesBuscarExemplarPor.disponiveis:
        await this.buscarExemplarPorDisponiveis();
        break;
      case OpcoesBuscarExemplarPor.sair:
        break;
    }
  }

  private async buscarExemplarPorTodos() {
    const exemplares = await this.exemplarService.buscarTodos();
    this.exemplarView.mostrarExemplares(exemplares);
  }

  private async buscarExemplarPorId() {
    const id = await this.exemplarView.perguntarNumero("ID do exemplar:");
    const exemplar = await this.exemplarService.buscarPorId(id);
    this.exemplarView.mostrarExemplares(exemplar ? [exemplar] : []);
  }

  private async buscarExemplarPorCodigo() {
    const codigo = await this.exemplarView.perguntar("Código do exemplar:");
    const exemplar = await this.exemplarService.buscarPorCodigo(codigo);
    this.exemplarView.mostrarExemplares(exemplar ? [exemplar] : []);
  }

  private async buscarExemplarPorLivro() {
    const livros = await this.livroService.buscarTodos();
    const livroId = await this.exemplarView.selecionaLivro(livros);
    const exemplares = await this.exemplarService.buscarPorLivro(livroId);
    this.exemplarView.mostrarExemplares(exemplares);
  }

  private async buscarExemplarPorEstado() {
    const estado = await this.exemplarView.selecionarEstado();
    const exemplares = await this.exemplarService.buscarPorEstado(estado);
    this.exemplarView.mostrarExemplares(exemplares);
  }
  private async buscarExemplarPorDisponiveis() {
    const exemplares = await this.exemplarService.buscarDisponiveis();
    this.exemplarView.mostrarExemplares(exemplares);
  }

  private async adicionar(): Promise<void> {
    const livros = await this.livroService.buscarTodos();
    if (livros.length === 0)
      throw new Error(
        "Não é possível cadastrar um exemplar porque não existem livros cadastrados.",
      );

    const dadosExemplar = await this.exemplarView.solicitaDadosExemplar(livros);
    const exemplar = await this.exemplarService.cadastrar(dadosExemplar);
    this.exemplarView.mostrarExemplares([exemplar]);
  }

  private async atualizar(): Promise<void> {
    const livros = await this.livroService.buscarTodos();
    if (livros.length === 0) throw new Error("Não existem livros cadastrados.");

    const id = await this.exemplarView.perguntarNumero(
      "ID do exemplar que deseja atualizar:",
    );
    const exemplar = await this.exemplarService.buscarPorId(id);
    if (!exemplar) throw new Error("Exemplar não encontrado.");

    this.exemplarView.mostrarExemplares([exemplar], "Exemplar selecionado:");

    const dadosExemplar =
      await this.exemplarView.solicitaDadosAtualizarExemplar(exemplar, livros);

    const exemplarAtualizado =
      await this.exemplarService.atualizar(dadosExemplar);

    if (!exemplarAtualizado) throw new Error("Exemplar não encontrado.");

    this.exemplarView.mostrarExemplares(
      [exemplarAtualizado],
      "Exemplar atualizado com sucesso!",
    );
  }

  private async remover(): Promise<void> {
    const id = await this.exemplarView.perguntarNumero(
      "ID do exemplar que deseja remover:",
    );
    const exemplar = await this.exemplarService.buscarPorId(id);
    if (!exemplar) throw new Error("Exemplar não encontrado.");

    this.exemplarView.mostrarExemplares([exemplar], "Exemplar selecionado:");
    const confirmar = await this.exemplarView.solicitaConfirmacao(
      `Deseja realmente remover o exemplar "${exemplar.codigo}"?`,
    );
    if (!confirmar) return;

    const removido = await this.exemplarService.excluir(id);

    if (!removido) throw new Error("Exemplar não encontrado.");

    this.exemplarView.mensagemSucesso("Exemplar removido!");
  }
}
