import { Livro } from "../models/Livro";
import { LivroRepository } from "../repositories/LivroRepository";
import { AutorRepository } from "../repositories/AutorRepository";

export class LivroService {
  constructor(
    private readonly livroRepository: LivroRepository,
    private readonly autorRepository: AutorRepository,
  ) {}

  async buscarTodos(): Promise<Livro[]> {
    return this.livroRepository.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Livro | null> {
    if (id <= 0) {
      throw new Error("O ID do livro deve ser maior que zero.");
    }

    return this.livroRepository.buscarPorId(id);
  }

  async buscarPorTitulo(titulo: string): Promise<Livro[]> {
    if (!titulo.trim()) {
      throw new Error("O título do livro é obrigatório.");
    }

    return this.livroRepository.buscarPorTitulo(titulo.trim());
  }

  async buscarPorAutor(autorId: number): Promise<Livro[]> {
    if (autorId <= 0) {
      throw new Error("O ID do autor deve ser maior que zero.");
    }

    const autor = await this.autorRepository.buscarPorId(autorId);

    if (!autor) {
      throw new Error(`Autor com ID ${autorId} não encontrado.`);
    }

    return this.livroRepository.buscarPorAutor(autorId);
  }

  async buscarPorIsbn(isbn: string): Promise<Livro | null> {
    if (!isbn.trim()) {
      throw new Error("O ISBN do livro é obrigatório.");
    }
    return this.livroRepository.buscarPorIsbn(isbn);
  }

  async buscarPorNomeAutor(nomeAutor: string): Promise<Livro[]> {
    if (!nomeAutor.trim()) {
      throw new Error("Deve ser informado o nome do autor.");
    }

    const livros = await this.livroRepository.buscarPorNomeAutor(
      nomeAutor.trim(),
    );

    if (livros.length === 0) {
      throw new Error(
        `Não foram encontrados livros para o autor: ${nomeAutor}.`,
      );
    }

    return livros;
  }

  async cadastrar(
    titulo: string,
    isbn: string,
    numeroChamada: string,
    anoPublicacao: number,
    autorId: number,
  ): Promise<Livro> {
    if (!titulo.trim()) {
      throw new Error("O título do livro é obrigatório.");
    }

    if (autorId <= 0) {
      throw new Error("O ID do autor deve ser maior que zero.");
    }

    const autor = await this.autorRepository.buscarPorId(autorId);

    if (!autor) {
      throw new Error(`Autor com ID ${autorId} não encontrado.`);
    }

    if (anoPublicacao <= 0) {
      throw new Error("O ano de publicação deve ser maior que zero.");
    }

    const isbnNormalizado = isbn.trim();

    if (isbnNormalizado) {
      const livroExistente =
        await this.livroRepository.buscarPorIsbn(isbnNormalizado);

      if (livroExistente) {
        throw new Error(
          `Já existe um livro cadastrado com o ISBN ${isbnNormalizado}.`,
        );
      }
    }

    return this.livroRepository.criar(
      titulo.trim(),
      isbnNormalizado,
      anoPublicacao,
      numeroChamada.trim(),
      autorId,
    );
  }

  async atualizar(
    id: number,
    titulo: string,
    isbn: string,
    anoPublicacao: number,
    numeroChamada: string,
    autorId: number,
  ): Promise<Livro | null> {
    if (id <= 0) {
      throw new Error("O ID do livro deve ser maior que zero.");
    }

    if (!titulo.trim()) {
      throw new Error("O título do livro é obrigatório.");
    }

    if (autorId <= 0) {
      throw new Error("O ID do autor deve ser maior que zero.");
    }

    const autor = await this.autorRepository.buscarPorId(autorId);

    if (!autor) {
      throw new Error(`Autor com ID ${autorId} não encontrado.`);
    }

    if (anoPublicacao <= 0) {
      throw new Error("O ano de publicação deve ser maior que zero.");
    }

    const isbnNormalizado = isbn.trim();

    const livroComMesmoIsbn =
      await this.livroRepository.buscarPorIsbn(isbnNormalizado);

    if (livroComMesmoIsbn && livroComMesmoIsbn.id !== id) {
      throw new Error(
        `Já existe outro livro cadastrado com o ISBN ${isbnNormalizado}.`,
      );
    }

    return this.livroRepository.atualizar(
      id,
      titulo.trim(),
      isbnNormalizado,
      anoPublicacao,
      numeroChamada.trim(),
      autorId,
    );
  }

  async excluir(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error("O ID do livro deve ser maior que zero.");
    }

    return this.livroRepository.excluir(id);
  }
}
