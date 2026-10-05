import { CriarAutorDTO } from "../dtos/autor/CriarAutorDTO";
import { Autor } from "../models/Autor";
import { AutorRepository } from "../repositories/AutorRepository";

export class AutorService {
  constructor(private readonly autorRepository: AutorRepository) {}

  coerenciaAnoNascimementoFalecimento(
    anoNascimento: number | null,
    anoFalecimento: number | null,
  ) {
    if (
      anoNascimento !== null &&
      anoFalecimento !== null &&
      anoFalecimento < anoNascimento
    ) {
      throw new Error(
        "O ano de falecimento não pode ser anterior ao ano de nascimento.",
      );
    }
  }

  async buscarTodos(): Promise<Autor[]> {
    return this.autorRepository.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Autor | null> {
    this.validarId(id);

    return this.autorRepository.buscarPorId(id);
  }

  async buscarPorNome(nome: string): Promise<Autor[]> {
    this.validarNome(nome);

    return this.autorRepository.buscarPorNome(nome.trim());
  }

  async cadastrar(dadosCriarAutor: CriarAutorDTO): Promise<Autor> {
    this.validarNome(dadosCriarAutor.nome);

    this.coerenciaAnoNascimementoFalecimento(
      dadosCriarAutor.ano_nascimento,
      dadosCriarAutor.ano_falecimento,
    );

    return this.autorRepository.criar(dadosCriarAutor);
  }

  async atualizar(autor: Autor): Promise<Autor | null> {
    this.validarId(autor.id);
    this.validarNome(autor.nome);

    this.coerenciaAnoNascimementoFalecimento(
      autor.ano_nascimento,
      autor.ano_falecimento,
    );

    return this.autorRepository.atualizar(autor);
  }

  async excluir(id: number): Promise<boolean> {
    this.validarId(id);
    return this.autorRepository.excluir(id);
  }

  private validarId(id: number) {
    if (id <= 0) {
      throw new Error("O ID do autor deve ser maior que zero.");
    }
  }

  private validarNome(nome: string) {
    if (!nome.trim()) {
      throw new Error("O nome do autor é obrigatório.");
    }
  }
}
