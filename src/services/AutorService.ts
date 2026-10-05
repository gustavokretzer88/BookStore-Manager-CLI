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

  async cadastrar(dadosCriarAutor: CriarAutorDTO): Promise<Autor> {
    if (!dadosCriarAutor.nome.trim()) {
      throw new Error("O nome do autor é obrigatório.");
    }

    this.coerenciaAnoNascimementoFalecimento(
      dadosCriarAutor.ano_nascimento,
      dadosCriarAutor.ano_falecimento,
    );

    return this.autorRepository.criar(dadosCriarAutor);
  }

  async atualizar(autor: Autor): Promise<Autor | null> {
    if (autor.id <= 0) {
      throw new Error("O ID do autor deve ser maior que zero.");
    }

    if (!autor.nome.trim()) {
      throw new Error("O nome do autor é obrigatório.");
    }

    this.coerenciaAnoNascimementoFalecimento(
      autor.ano_nascimento,
      autor.ano_falecimento,
    );

    return this.autorRepository.atualizar(autor);
  }

  async excluir(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error("O ID do autor deve ser maior que zero.");
    }

    return this.autorRepository.excluir(id);
  }
}
