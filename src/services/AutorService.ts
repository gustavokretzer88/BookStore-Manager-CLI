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
    if (id <= 0) {
      throw new Error("O ID do autor deve ser maior que zero.");
    }

    return this.autorRepository.buscarPorId(id);
  }

  async buscarPorNome(nome: string): Promise<Autor[]> {
    if (!nome.trim()) {
      throw new Error("O nome do autor é obrigatório.");
    }

    return this.autorRepository.buscarPorNome(nome.trim());
  }

  async cadastrar(
    nome: string,
    nacionalidade: string | null,
    anoNascimento: number | null,
    anoFalecimento: number | null,
  ): Promise<Autor> {
    if (!nome.trim()) {
      throw new Error("O nome do autor é obrigatório.");
    }

    this.coerenciaAnoNascimementoFalecimento(anoNascimento, anoFalecimento);

    return this.autorRepository.criar(
      nome.trim(),
      nacionalidade?.trim() || null,
      anoNascimento,
      anoFalecimento,
    );
  }

  async atualizar(
    id: number,
    nome: string,
    nacionalidade: string | null,
    anoNascimento: number | null,
    anoFalecimento: number | null,
  ): Promise<Autor | null> {
    if (id <= 0) {
      throw new Error("O ID do autor deve ser maior que zero.");
    }

    if (!nome.trim()) {
      throw new Error("O nome do autor é obrigatório.");
    }

    this.coerenciaAnoNascimementoFalecimento(anoNascimento, anoFalecimento);

    return this.autorRepository.atualizar(
      id,
      nome.trim(),
      nacionalidade?.trim() || null,
      anoNascimento,
      anoFalecimento,
    );
  }

  async excluir(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error("O ID do autor deve ser maior que zero.");
    }

    return this.autorRepository.excluir(id);
  }
}
