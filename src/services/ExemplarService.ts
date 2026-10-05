import { CriarExemplarDTO } from "../dtos/exemplar/CriarExemplarDTO";
import { Exemplar, EstadoConservacao } from "../models/Exemplar";
import { ExemplarRepository } from "../repositories/ExemplarRepository";
import { LivroRepository } from "../repositories/LivroRepository";

export class ExemplarService {
  constructor(
    private readonly exemplarRepository: ExemplarRepository,
    private readonly livroRepository: LivroRepository,
  ) {}

  async buscarTodos(): Promise<Exemplar[]> {
    return this.exemplarRepository.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Exemplar | null> {
    this.validarId(id);
    return this.exemplarRepository.buscarPorId(id);
  }

  async buscarPorCodigo(codigo: string): Promise<Exemplar | null> {
    this.validarCodigo(codigo);
    return this.exemplarRepository.buscarPorCodigo(codigo);
  }

  async buscarPorLivro(livroId: number): Promise<Exemplar[]> {
    this.validarLivroId(livroId);
    const livro = await this.livroRepository.buscarPorId(livroId);
    if (!livro) throw new Error(`Livro com ID ${livroId} não encontrado.`);

    return this.exemplarRepository.buscarPorLivro(livroId);
  }

  async buscarPorEstado(estado: EstadoConservacao): Promise<Exemplar[]> {
    this.validarEstado(estado);
    return this.exemplarRepository.buscarPorEstado(estado);
  }

  async buscarDisponiveis(): Promise<Exemplar[]> {
    return this.exemplarRepository.buscarDisponiveis();
  }

  async cadastrar(dadosExemplar: CriarExemplarDTO): Promise<Exemplar> {
    this.validarExemplar(dadosExemplar);

    const livro = await this.livroRepository.buscarPorId(
      dadosExemplar.livro_id,
    );
    if (!livro)
      throw new Error(`Livro com ID ${dadosExemplar.livro_id} não encontrado.`);

    const exemplarExistente = await this.exemplarRepository.buscarPorCodigo(
      dadosExemplar.codigo,
    );

    if (exemplarExistente) {
      throw new Error(
        `Já existe um exemplar cadastrado com o código ${dadosExemplar.codigo}.`,
      );
    }

    return this.exemplarRepository.criar(dadosExemplar);
  }

  async atualizar(exemplar: Exemplar): Promise<Exemplar | null> {
    this.validarExemplar(exemplar);
    const livro = await this.livroRepository.buscarPorId(exemplar.livro_id);

    if (!livro)
      throw new Error(`Livro com ID ${exemplar.livro_id} não encontrado.`);

    const exemplarComMesmoCodigo =
      await this.exemplarRepository.buscarPorCodigo(exemplar.codigo);

    if (exemplarComMesmoCodigo && exemplarComMesmoCodigo.id !== exemplar.id)
      throw new Error(
        `Já existe outro exemplar cadastrado com o código ${exemplar.codigo}.`,
      );

    return this.exemplarRepository.atualizar(exemplar);
  }

  async excluir(id: number): Promise<boolean> {
    this.validarId(id);
    return this.exemplarRepository.excluir(id);
  }

  private validarEstado(estado: EstadoConservacao): void {
    const estadosValidos: EstadoConservacao[] = [
      "NOVO",
      "BOM",
      "REGULAR",
      "RUIM",
    ];

    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado de conservação inválido: ${estado}.`);
    }
  }

  private validarId(id: number) {
    if (id <= 0) throw new Error("O ID do exemplar deve ser maior que zero.");
  }

  private validarLivroId(id: number) {
    if (id <= 0) throw new Error("O ID do livro deve ser maior que zero.");
  }
  private validarCodigo(codigo: string) {
    codigo = codigo.trim();
    if (!codigo) {
      throw new Error("O código do exemplar é obrigatório.");
    }
  }

  private validarExemplar(exemplar: CriarExemplarDTO | Exemplar) {
    if ("id" in exemplar) this.validarId(exemplar.id);
    this.validarLivroId(exemplar.livro_id);
    this.validarEstado(exemplar.estado_conservacao);
    this.validarCodigo(exemplar.codigo);
  }
}
