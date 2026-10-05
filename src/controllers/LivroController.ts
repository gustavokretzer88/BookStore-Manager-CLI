import { confirm, input, select } from "@inquirer/prompts";

import { LivroService } from "../services/LivroService";
import { AutorService } from "../services/AutorService";
import {
  LivroView,
  OpcoesBuscarPor,
  OpcoesMenuLivros,
} from "../views/LivroView";

export class LivroController {
  private readonly livroView: LivroView = new LivroView();

  constructor(
    private readonly livroService: LivroService,
    private readonly autorService: AutorService,
  ) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      const opcao = await this.livroView.mostrarOpcoes();

      switch (opcao) {
        case OpcoesMenuLivros.buscar:
          await this.buscar();
          break;

        case OpcoesMenuLivros.adicionar:
          await this.adicionar();
          break;

        case OpcoesMenuLivros.atualizar:
          await this.atualizar();
          break;

        case OpcoesMenuLivros.remover:
          await this.remover();
          break;

        case OpcoesMenuLivros.sair:
          continuar = false;
          break;
      }
    }
  }

  private async buscar(): Promise<void> {
    const selecao = await this.livroView.mostrarOpcoesBuscarPor();

    switch (selecao) {
      case OpcoesBuscarPor.todos:
        await this.buscarPorTodos();
        break;
      case OpcoesBuscarPor.titulo:
        await this.buscarPorTitulo();
        break;
      case OpcoesBuscarPor.id:
        await this.buscarPorId();
        break;
      case OpcoesBuscarPor.isbn:
        await this.buscarPorIsbn();
        break;
      case OpcoesBuscarPor.nomeAutor:
        await this.buscarPorNomeAutor();
        break;
      case OpcoesBuscarPor.numeroChamada:
        await this.buscarPorNumeroChamada();
        break;
      case OpcoesBuscarPor.sair:
        break;
    }
  }

  async buscarPorTodos() {
    this.livroView.mostrarLivros(await this.livroService.buscarTodosComAutor());
  }

  async buscarPorId() {
    const id = await this.livroView.perguntarNumero("Id do livro:");
    const livro = await this.livroService.buscarPorIdComAutor(id);

    this.livroView.mostrarLivros(livro ? [livro] : []);
  }

  async buscarPorTitulo() {
    const titulo = await this.livroView.perguntar("Título do livro:");

    this.livroView.mostrarLivros(
      await this.livroService.buscarPorTituloComAutor(titulo),
    );
  }

  async buscarPorIsbn() {
    const isbn = await this.livroView.perguntar("ISBN do livro:");
    const livro = await this.livroService.buscarPorIsbnComAutor(isbn);
    this.livroView.mostrarLivros(livro ? [livro] : []);
  }

  async buscarPorNomeAutor() {
    const nomeAutor = await this.livroView.perguntar("Nome do autor:");
    this.livroView.mostrarLivros(
      await this.livroService.buscarPorNomeAutorComAutor(nomeAutor),
    );
  }

  async buscarPorNumeroChamada() {
    const numeroChamada = await this.livroView.perguntar("Número de chamada:");
    this.livroView.mostrarLivros(
      await this.livroService.buscarPorNumeroChamadaComAutor(numeroChamada),
    );
  }

  private async adicionar(): Promise<void> {
    const autores = await this.autorService.buscarTodos();
    if (autores.length === 0) {
      throw new Error(
        "Não é possível cadastrar o livro porque não existem autores cadastrados.",
      );
    }
    const dadosLivro = await this.livroView.solicitaDadosCriarLivro(autores);

    const livro = await this.livroService.cadastrar(dadosLivro);

    this.livroView.mostrarLivros([livro], "Livro cadastrado com sucesso!");
  }

  private async atualizar(): Promise<void> {
    const autores = await this.autorService.buscarTodos();
    if (autores.length === 0) {
      throw new Error(
        "Não é possível atualizar o livro porque não existem autores cadastrados.",
      );
    }
    const id = await this.livroView.perguntarNumero(
      "ID do livro que deseja atualizar:",
    );
    const livro = await this.livroService.buscarPorId(id);

    if (!livro) {
      throw new Error("Livro não encontrado.");
    }

    this.livroView.mensagemSucesso(`Livro selecionado: ${livro.titulo}`);

    const dadosLivrosAtualizado =
      await this.livroView.solicitaDadosAtualizarLivro(livro, autores);

    const livroAtualizado = await this.livroService.atualizar(
      dadosLivrosAtualizado,
    );

    if (!livroAtualizado) {
      throw new Error("Erro ao atualizar livro.");
    }

    this.livroView.mostrarLivros(
      [livroAtualizado],
      "Livro atualizado com sucesso!",
    );
  }

  private async remover(): Promise<void> {
    const id = await this.livroView.perguntarNumero(
      "ID do livro que deseja remover:",
    );
    const livro = await this.livroService.buscarPorId(id);

    if (!livro) {
      throw new Error("Livro não encontrado");
    }

    this.livroView.mostrarLivros([livro], "Livro selecionado:");

    const confirmar = await this.livroView.solicitaConfirmacao(
      `Deseja realmente remover o livro "${livro.titulo}"?`,
    );
    if (!confirmar) {
      return;
    }
    const removido = await this.livroService.excluir(id);

    if (!removido) {
      throw new Error("Livro não encontrado.");
    }

    this.livroView.mensagemSucesso("Livro removido com sucesso!");
  }
}
