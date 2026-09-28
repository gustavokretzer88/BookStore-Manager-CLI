import { Emprestimo } from "../models/Emprestimo";
import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { ClienteRepository } from "../repositories/ClienteRepository";
import { ExemplarRepository } from "../repositories/ExemplarRepository";

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
    if (id <= 0) {
      throw new Error("O ID do empréstimo deve ser maior que zero.");
    }

    return this.emprestimoRepository.buscarPorId(id);
  }

  async buscarPorCliente(clienteId: number): Promise<Emprestimo[]> {
    if (clienteId <= 0) {
      throw new Error("O ID do cliente deve ser maior que zero.");
    }

    const cliente = await this.clienteRepository.buscarPorId(clienteId);

    if (!cliente) {
      throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }

    return this.emprestimoRepository.buscarPorCliente(clienteId);
  }

  async buscarPorExemplar(exemplarId: number): Promise<Emprestimo[]> {
    if (exemplarId <= 0) {
      throw new Error("O ID do exemplar deve ser maior que zero.");
    }

    const exemplar = await this.exemplarRepository.buscarPorId(exemplarId);

    if (!exemplar) {
      throw new Error(`Exemplar com ID ${exemplarId} não encontrado.`);
    }

    return this.emprestimoRepository.buscarPorExemplar(exemplarId);
  }

  async buscarAtivos(): Promise<Emprestimo[]> {
    return this.emprestimoRepository.buscarAtivos();
  }

  async buscarAtivoPorExemplar(exemplarId: number): Promise<Emprestimo | null> {
    if (exemplarId <= 0) {
      throw new Error("O ID do exemplar deve ser maior que zero.");
    }

    const exemplar = await this.exemplarRepository.buscarPorId(exemplarId);

    if (!exemplar) {
      throw new Error(`Exemplar com ID ${exemplarId} não encontrado.`);
    }

    return this.emprestimoRepository.buscarAtivoPorExemplar(exemplarId);
  }

  async buscarAtivosPorCliente(clienteId: number): Promise<Emprestimo[]> {
    if (clienteId <= 0) {
      throw new Error("O ID do cliente deve ser maior que zero.");
    }

    const cliente = await this.clienteRepository.buscarPorId(clienteId);

    if (!cliente) {
      throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }

    return this.emprestimoRepository.buscarAtivosPorCliente(clienteId);
  }

  async cadastrar(
    exemplarId: number,
    clienteId: number,
    dataEmprestimo: string,
  ): Promise<Emprestimo> {
    if (exemplarId <= 0) {
      throw new Error("O ID do exemplar deve ser maior que zero.");
    }

    if (clienteId <= 0) {
      throw new Error("O ID do cliente deve ser maior que zero.");
    }

    if (!dataEmprestimo.trim()) {
      throw new Error("A data do empréstimo é obrigatória.");
    }

    const exemplar = await this.exemplarRepository.buscarPorId(exemplarId);

    if (!exemplar) {
      throw new Error(`Exemplar com ID ${exemplarId} não encontrado.`);
    }

    const cliente = await this.clienteRepository.buscarPorId(clienteId);

    if (!cliente) {
      throw new Error(`Cliente com ID ${clienteId} não encontrado.`);
    }

    const emprestimoAtivo =
      await this.emprestimoRepository.buscarAtivoPorExemplar(exemplarId);

    if (emprestimoAtivo) {
      throw new Error(`O exemplar ${exemplar.codigo} já está emprestado.`);
    }

    return this.emprestimoRepository.criar(
      exemplarId,
      clienteId,
      dataEmprestimo.trim(),
    );
  }

  async devolver(
    id: number,
    dataDevolucao: string,
  ): Promise<Emprestimo | null> {
    if (id <= 0) {
      throw new Error("O ID do empréstimo deve ser maior que zero.");
    }

    if (!dataDevolucao.trim()) {
      throw new Error("A data de devolução é obrigatória.");
    }

    const emprestimo = await this.emprestimoRepository.buscarPorId(id);

    if (!emprestimo) {
      throw new Error(`Empréstimo com ID ${id} não encontrado.`);
    }

    if (emprestimo.data_devolucao !== null) {
      throw new Error(`O empréstimo com ID ${id} já foi devolvido.`);
    }

    return this.emprestimoRepository.devolver(id, dataDevolucao.trim());
  }

  async excluir(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error("O ID do empréstimo deve ser maior que zero.");
    }

    return this.emprestimoRepository.excluir(id);
  }
}
