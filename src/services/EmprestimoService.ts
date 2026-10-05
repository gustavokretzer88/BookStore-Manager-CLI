import { Emprestimo } from "../models/Emprestimo";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { ExemplarRepository } from "../repositories/ExemplarRepository";
import { CadastrarEmprestimoDTO } from "../dtos/emprestimo/CadastrarEmprestimoDTO";
import { DevolucaoEmprestimoDTO } from "../dtos/emprestimo/DevolucaoEmprestimoDTO";

export class EmprestimoService {
  constructor(
    private readonly emprestimoRepository: EmprestimoRepository,
    private readonly clienteRepository: ClienteRepository,
    private readonly exemplarRepository: ExemplarRepository,
  ) {}

  async buscarTodos(): Promise<Emprestimo[]> {
    return this.emprestimoRepository.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Emprestimo | null> {
    this.validarId(id);

    return this.emprestimoRepository.buscarPorId(id);
  }

  async buscarPorCliente(clienteId: number): Promise<Emprestimo[]> {
    this.validarClientId(clienteId);

    const cliente = await this.clienteRepository.buscarPorId(clienteId);
    if (!cliente)
      throw new Error(`Cliente com ID ${clienteId} não encontrado.`);

    return this.emprestimoRepository.buscarPorCliente(clienteId);
  }

  async buscarPorExemplar(exemplarId: number): Promise<Emprestimo[]> {
    this.validarExemplarId(exemplarId);

    const exemplar = await this.exemplarRepository.buscarPorId(exemplarId);
    if (!exemplar)
      throw new Error(`Exemplar com ID ${exemplarId} não encontrado.`);

    return this.emprestimoRepository.buscarPorExemplar(exemplarId);
  }

  async buscarAtivos(): Promise<Emprestimo[]> {
    return this.emprestimoRepository.buscarAtivos();
  }

  async buscarAtivoPorExemplar(exemplarId: number): Promise<Emprestimo | null> {
    this.validarExemplarId(exemplarId);
    const exemplar = await this.exemplarRepository.buscarPorId(exemplarId);
    if (!exemplar)
      throw new Error(`Exemplar com ID ${exemplarId} não encontrado.`);

    return this.emprestimoRepository.buscarAtivoPorExemplar(exemplarId);
  }

  async buscarAtivosPorCliente(clienteId: number): Promise<Emprestimo[]> {
    this.validarClientId(clienteId);
    const cliente = await this.clienteRepository.buscarPorId(clienteId);
    if (!cliente)
      throw new Error(`Cliente com ID ${clienteId} não encontrado.`);

    return this.emprestimoRepository.buscarAtivosPorCliente(clienteId);
  }

  async cadastrar(
    dadosEmprestimo: CadastrarEmprestimoDTO,
  ): Promise<Emprestimo> {
    this.validarExemplarId(dadosEmprestimo.exemplarId);
    this.validarClientId(dadosEmprestimo.clienteId);
    this.validarDataEmprestimo(dadosEmprestimo.dataEmprestimo);

    const exemplar = await this.exemplarRepository.buscarPorId(
      dadosEmprestimo.exemplarId,
    );
    if (!exemplar)
      throw new Error(
        `Exemplar com ID ${dadosEmprestimo.exemplarId} não encontrado.`,
      );

    const cliente = await this.clienteRepository.buscarPorId(
      dadosEmprestimo.clienteId,
    );
    if (!cliente)
      throw new Error(
        `Cliente com ID ${dadosEmprestimo.clienteId} não encontrado.`,
      );

    const emprestimoAtivo =
      await this.emprestimoRepository.buscarAtivoPorExemplar(
        dadosEmprestimo.exemplarId,
      );

    if (emprestimoAtivo)
      throw new Error(`O exemplar ${exemplar.codigo} já está emprestado.`);

    return this.emprestimoRepository.criar(dadosEmprestimo);
  }

  async devolver(
    devolucao: DevolucaoEmprestimoDTO,
  ): Promise<Emprestimo | null> {
    this.validarId(devolucao.emprestimo_id);
    this.validarDataEmprestimo(devolucao.dataDevolucao);

    const emprestimo = await this.emprestimoRepository.buscarPorId(
      devolucao.emprestimo_id,
    );
    if (!emprestimo)
      throw new Error(
        `Empréstimo com ID ${devolucao.emprestimo_id} não encontrado.`,
      );

    if (emprestimo.data_devolucao !== null)
      throw new Error(
        `O empréstimo com ID ${devolucao.emprestimo_id} já foi devolvido.`,
      );

    return this.emprestimoRepository.devolver(devolucao);
  }

  async excluir(id: number): Promise<boolean> {
    this.validarId(id);

    return this.emprestimoRepository.excluir(id);
  }

  private validarId(id: number) {
    if (id <= 0) throw new Error("O ID do empréstimo deve ser maior que zero.");
  }

  private validarExemplarId(id: number) {
    if (id <= 0) throw new Error("O ID do exemplar deve ser maior que zero.");
  }

  private validarClientId(id: number) {
    if (id <= 0) throw new Error("O ID do cliente deve ser maior que zero.");
  }

  private validarDataEmprestimo(dataEmprestimo: string) {
    dataEmprestimo = dataEmprestimo.trim();
    if (!dataEmprestimo) throw new Error("A data do empréstimo é obrigatória.");
  }
}
