import { Cliente } from "../models/Cliente";
import { ClienteRepository } from "../repositories/ClienteRepository";

export class ClienteService {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async buscarTodos(): Promise<Cliente[]> {
    return this.clienteRepository.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    if (id <= 0) {
      throw new Error("O ID do cliente deve ser maior que zero.");
    }

    return this.clienteRepository.buscarPorId(id);
  }

  async buscarPorNome(nome: string): Promise<Cliente[]> {
    if (!nome.trim()) {
      throw new Error("O nome do cliente é obrigatório.");
    }

    return this.clienteRepository.buscarPorNome(nome.trim());
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    if (!email.trim()) {
      throw new Error("O e-mail do cliente é obrigatório.");
    }

    return this.clienteRepository.buscarPorEmail(email.trim());
  }

  async cadastrar(
    nome: string,
    email: string,
    telefone: string | null,
  ): Promise<Cliente> {
    if (!nome.trim()) {
      throw new Error("O nome do cliente é obrigatório.");
    }

    if (!email.trim()) {
      throw new Error("O e-mail do cliente é obrigatório.");
    }

    const emailNormalizado = email.trim().toLowerCase();

    const clienteExistente =
      await this.clienteRepository.buscarPorEmail(emailNormalizado);

    if (clienteExistente) {
      throw new Error(
        `Já existe um cliente cadastrado com o e-mail ${emailNormalizado}.`,
      );
    }

    return this.clienteRepository.criar(
      nome.trim(),
      emailNormalizado,
      telefone?.trim() || null,
    );
  }

  async atualizar(
    id: number,
    nome: string,
    email: string,
    telefone: string | null,
  ): Promise<Cliente | null> {
    if (id <= 0) {
      throw new Error("O ID do cliente deve ser maior que zero.");
    }

    if (!nome.trim()) {
      throw new Error("O nome do cliente é obrigatório.");
    }

    if (!email.trim()) {
      throw new Error("O e-mail do cliente é obrigatório.");
    }

    const emailNormalizado = email.trim().toLowerCase();

    const clienteComMesmoEmail =
      await this.clienteRepository.buscarPorEmail(emailNormalizado);

    if (clienteComMesmoEmail && clienteComMesmoEmail.id !== id) {
      throw new Error(
        `Já existe outro cliente cadastrado com o e-mail ${emailNormalizado}.`,
      );
    }

    return this.clienteRepository.atualizar(
      id,
      nome.trim(),
      emailNormalizado,
      telefone?.trim() || null,
    );
  }

  async excluir(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error("O ID do cliente deve ser maior que zero.");
    }

    return this.clienteRepository.excluir(id);
  }
}
