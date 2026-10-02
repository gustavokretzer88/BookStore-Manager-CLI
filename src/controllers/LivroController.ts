import { LivroComAutorDTO } from "../dtos/livro/LivroComAutorDTO";
import { Livro } from "../models/Livro";
import { LivroService } from "../services/LivroService";

export class LivroController {
  constructor(private readonly livroService: LivroService) {}

  async listar(): Promise<Livro[]> {
    return this.livroService.buscarTodos();
  }

  async listarComAutor(): Promise<LivroComAutorDTO[]> {
    return this.livroService.listarLivrosComAutor();
  }

  async buscarPorId(id: number): Promise<Livro | null> {
    return this.livroService.buscarPorId(id);
  }

  async buscarPorIdComAutor(id: number): Promise<LivroComAutorDTO | null> {
    return this.livroService.buscarPorIdComAutor(id);
  }

  async buscarPorTitulo(titulo: string): Promise<Livro[]> {
    return this.livroService.buscarPorTitulo(titulo);
  }

  async buscarPorTituloComAutor(titulo: string): Promise<LivroComAutorDTO[]> {
    return this.livroService.buscarPorTituloComAutor(titulo);
  }

  async buscarPorAutor(autorId: number): Promise<Livro[]> {
    return this.livroService.buscarPorAutor(autorId);
  }

  async buscarPorAutorComAutor(autorId: number): Promise<LivroComAutorDTO[]> {
    return this.livroService.buscarPorAutorComAutor(autorId);
  }

  async buscarPorNomeAutor(nomeAutor: string): Promise<Livro[]> {
    return this.livroService.buscarPorNomeAutor(nomeAutor);
  }

  async buscarPorNomeAutorComAutor(
    nomeAutor: string,
  ): Promise<LivroComAutorDTO[]> {
    return this.livroService.buscarPorNomeAutorComAutor(nomeAutor);
  }

  async buscarPorIsbn(nomeAutor: string): Promise<Livro | null> {
    return this.livroService.buscarPorIsbn(nomeAutor);
  }

  async buscarPorIsbnComAutor(
    nomeAutor: string,
  ): Promise<LivroComAutorDTO | null> {
    return this.livroService.buscarPorIsbnComAutor(nomeAutor);
  }

  async buscarPorNumeroChamada(nomeAutor: string): Promise<Livro[]> {
    return this.livroService.buscarPorNumeroChamada(nomeAutor);
  }

  async buscarPorNumeroChamadaComAutor(
    nomeAutor: string,
  ): Promise<LivroComAutorDTO[]> {
    return this.livroService.buscarPorNumeroChamadaComAutor(nomeAutor);
  }

  async cadastrar(
    titulo: string,
    isbn: string,
    numeroChamada: string,
    anoPublicacao: number,
    autorId: number,
  ): Promise<Livro> {
    return this.livroService.cadastrar(
      titulo,
      isbn,
      numeroChamada,
      anoPublicacao,
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
    return this.livroService.atualizar(
      id,
      titulo,
      isbn,
      anoPublicacao,
      numeroChamada,
      autorId,
    );
  }

  async excluir(id: number): Promise<boolean> {
    return this.livroService.excluir(id);
  }
}
