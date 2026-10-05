import { Livro } from "../models/Livro";
import { LivroRepository } from "../repositories/LivroRepository";
import { AutorRepository } from "../repositories/AutorRepository";
import { LivroComAutorDTO } from "../dtos/livro/LivroComAutorDTO";
import { CriarLivroDTO } from "../dtos/livro/CriarLivroDTO";

export class LivroService {
  constructor(
    private readonly livroRepository: LivroRepository,
    private readonly autorRepository: AutorRepository,
  ) {}

  async buscarTodos(): Promise<Livro[]> {
    return this.livroRepository.buscarTodos();
  }

  async buscarTodosComAutor(): Promise<LivroComAutorDTO[]> {
    return this.livroRepository.buscarTodosComAutor();
  }

  async buscarPorId(id: number): Promise<Livro | null> {
    this.validarId(id);

    return this.livroRepository.buscarPorId(id);
  }

  async buscarPorIdComAutor(id: number): Promise<LivroComAutorDTO | null> {
    this.validarId(id);

    return this.livroRepository.buscarPorIdComAutor(id);
  }

  async buscarPorTitulo(titulo: string): Promise<Livro[]> {
    this.validarTitulo(titulo);

    return this.livroRepository.buscarPorTitulo(titulo.trim());
  }

  async buscarPorTituloComAutor(titulo: string): Promise<LivroComAutorDTO[]> {
    this.validarTitulo(titulo);

    return this.livroRepository.buscarPorTituloComAutor(titulo.trim());
  }

  async buscarPorAutor(autorId: number): Promise<Livro[]> {
    this.validarAutorId(autorId);

    const autor = await this.autorRepository.buscarPorId(autorId);

    if (!autor) {
      throw new Error(`Autor com ID ${autorId} não encontrado.`);
    }

    return this.livroRepository.buscarPorAutor(autorId);
  }

  async buscarPorAutorComAutor(autorId: number): Promise<LivroComAutorDTO[]> {
    this.validarAutorId(autorId);

    const autor = await this.autorRepository.buscarPorId(autorId);

    if (!autor) {
      throw new Error(`Autor com ID ${autorId} não encontrado.`);
    }

    return this.livroRepository.buscarPorAutorComAutor(autorId);
  }

  async buscarPorIsbn(isbn: string): Promise<Livro | null> {
    this.validarIsbn(isbn);
    return this.livroRepository.buscarPorIsbn(isbn);
  }

  async buscarPorIsbnComAutor(isbn: string): Promise<LivroComAutorDTO | null> {
    this.validarIsbn(isbn);
    return this.livroRepository.buscarPorIsbnComAutor(isbn);
  }

  async buscarPorNumeroChamada(chamada: string): Promise<Livro[]> {
    this.validarChamada(chamada);

    return this.livroRepository.buscarPorNumeroChamada(chamada);
  }

  async buscarPorNumeroChamadaComAutor(
    chamada: string,
  ): Promise<LivroComAutorDTO[]> {
    this.validarChamada(chamada);

    return this.livroRepository.buscarPorNumeroChamadaComAutor(chamada);
  }

  async buscarPorNomeAutor(nomeAutor: string): Promise<Livro[]> {
    this.validarNomeAutor(nomeAutor);

    const livros = await this.livroRepository.buscarPorNomeAutor(nomeAutor);

    if (livros.length === 0) {
      throw new Error(
        `Não foram encontrados livros para o autor: ${nomeAutor}.`,
      );
    }

    return livros;
  }

  async buscarPorNomeAutorComAutor(
    nomeAutor: string,
  ): Promise<LivroComAutorDTO[]> {
    this.validarNomeAutor(nomeAutor);

    const livros =
      await this.livroRepository.buscarPorNomeAutorComAutor(nomeAutor);

    if (livros.length === 0) {
      throw new Error(
        `Não foram encontrados livros para o autor: ${nomeAutor}.`,
      );
    }

    return livros;
  }

  async cadastrar(dadosLivro: CriarLivroDTO): Promise<Livro> {
    this.validarLivro(dadosLivro);
    const autor = await this.autorRepository.buscarPorId(dadosLivro.autor_id);
    if (!autor) {
      throw new Error(`Autor com ID ${dadosLivro.autor_id} não encontrado.`);
    }

    const isbnNormalizado = dadosLivro.isbn.trim();

    if (isbnNormalizado) {
      const livroExistente =
        await this.livroRepository.buscarPorIsbn(isbnNormalizado);

      if (livroExistente) {
        throw new Error(
          `Já existe um livro cadastrado com o ISBN ${isbnNormalizado}.`,
        );
      }
    }

    return this.livroRepository.criar(dadosLivro);
  }

  async atualizar(livro: Livro): Promise<Livro | null> {
    this.validarLivro(livro);

    const autor = await this.autorRepository.buscarPorId(livro.autor_id);
    if (!autor) {
      throw new Error(`Autor com ID ${livro.autor_id} não encontrado.`);
    }

    const isbnNormalizado = livro.isbn.trim();

    const livroComMesmoIsbn =
      await this.livroRepository.buscarPorIsbn(isbnNormalizado);

    if (livroComMesmoIsbn && livroComMesmoIsbn.id !== livro.id) {
      throw new Error(
        `Já existe outro livro cadastrado com o ISBN ${isbnNormalizado}.`,
      );
    }

    return this.livroRepository.atualizar(livro);
  }

  async excluir(id: number): Promise<boolean> {
    this.validarId(id);

    return this.livroRepository.excluir(id);
  }

  private validarId(id: number): void {
    if (id <= 0) {
      throw new Error("O ID do livro deve ser maior que zero.");
    }
  }

  private validarAutorId(id: number): void {
    if (id <= 0) {
      throw new Error("O ID do autor deve ser maior que zero.");
    }
  }
  private validarIsbn(isbn: string): void {
    if (!isbn.trim()) {
      throw new Error("O ISBN do livro é obrigatório.");
    }
  }
  private validarTitulo(titulo: string): void {
    if (!titulo.trim()) {
      throw new Error("O título do livro é obrigatório.");
    }
  }
  private validarAnoPublicacao(anoPublicacao: number): void {
    if (anoPublicacao <= 0) {
      throw new Error("O ano de publicação deve ser maior que zero.");
    }
  }
  private validarChamada(chamada: string): void {
    if (!chamada.trim()) {
      throw new Error("A chamada do livro é obrigatório.");
    }
  }
  private validarNomeAutor(nomeAutor: string): void {
    if (!nomeAutor.trim()) {
      throw new Error("Deve ser informado o nome do autor.");
    }
  }
  private validarLivro(dadosLivro: CriarLivroDTO | Livro) {
    if ("id" in dadosLivro) {
      this.validarId(dadosLivro.id);
    }
    this.validarTitulo(dadosLivro.titulo);
    this.validarIsbn(dadosLivro.isbn);
    this.validarAnoPublicacao(dadosLivro.ano_publicacao);
    this.validarChamada(dadosLivro.numero_chamada);
    this.validarAutorId(dadosLivro.autor_id);
  }
}
