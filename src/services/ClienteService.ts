import { CriarClienteDTO } from "../dtos/cliente/CriarClienteDTO";
import { Cliente } from "../models/Cliente";
import { ClienteRepository } from "../repositories/ClienteRepository";

export class ClienteService {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async buscarTodos(): Promise<Cliente[]> {
    return this.clienteRepository.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    this.validarId(id);
    return this.clienteRepository.buscarPorId(id);
  }

  async buscarPorNome(nome: string): Promise<Cliente[]> {
    this.validarNome(nome);

    return this.clienteRepository.buscarPorNome(nome);
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    this.validarEmail(email);
    return this.clienteRepository.buscarPorEmail(email);
  }

  async cadastrar(dadosCliente: CriarClienteDTO): Promise<Cliente> {
    this.validarDadosCliente(dadosCliente);

    dadosCliente.email = dadosCliente.email.trim().toLowerCase();

    const clienteExistente = await this.clienteRepository.buscarPorEmail(
      dadosCliente.email,
    );

    if (clienteExistente) {
      throw new Error(
        `Já existe um cliente cadastrado com o e-mail ${dadosCliente.email}.`,
      );
    }

    return this.clienteRepository.criar(dadosCliente);
  }

  async atualizar(cliente: Cliente): Promise<Cliente | null> {
    this.validarDadosCliente(cliente);

    const clienteComMesmoEmail = await this.clienteRepository.buscarPorEmail(
      cliente.email,
    );
    if (clienteComMesmoEmail && clienteComMesmoEmail.id !== cliente.id) {
      throw new Error(
        `Já existe outro cliente cadastrado com o e-mail ${cliente.email}.`,
      );
    }

    return this.clienteRepository.atualizar(cliente);
  }

  async excluir(id: number): Promise<boolean> {
    this.validarId(id);
    return this.clienteRepository.excluir(id);
  }

  private validarId(id: number) {
    if (id <= 0) {
      throw new Error("O ID do cliente deve ser maior que zero.");
    }
  }
  private validarNome(nome: string) {
    if (!nome.trim()) {
      throw new Error("O nome do cliente é obrigatório.");
    }
    nome = nome.trim();
  }

  private validarEmail(email: string) {
    if (!email.trim()) {
      throw new Error("O e-mail do cliente é obrigatório.");
    }
    email = email.trim().toLowerCase();
  }

  private validarDadosCliente(dadosCliente: CriarClienteDTO | Cliente) {
    if ("id" in dadosCliente) {
      this.validarId(dadosCliente.id);
    }
    this.validarNome(dadosCliente.nome);
    this.validarEmail(dadosCliente.email);
  }
}
