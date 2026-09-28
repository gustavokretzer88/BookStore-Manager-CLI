import { Cliente } from "../models/Cliente";
import { ClienteService } from "../services/ClienteService";

export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  async listar(): Promise<Cliente[]> {
    return this.clienteService.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    return this.clienteService.buscarPorId(id);
  }

  async buscarPorNome(nome: string): Promise<Cliente[]> {
    return this.clienteService.buscarPorNome(nome);
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    return this.clienteService.buscarPorEmail(email);
  }

  async cadastrar(
    nome: string,
    email: string,
    telefone: string | null,
  ): Promise<Cliente> {
    return this.clienteService.cadastrar(nome, email, telefone);
  }

  async atualizar(
    id: number,
    nome: string,
    email: string,
    telefone: string | null,
  ): Promise<Cliente | null> {
    return this.clienteService.atualizar(id, nome, email, telefone);
  }

  async excluir(id: number): Promise<boolean> {
    return this.clienteService.excluir(id);
  }
}
