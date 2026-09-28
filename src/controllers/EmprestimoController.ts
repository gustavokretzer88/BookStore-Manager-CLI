import { Emprestimo } from "../models/Emprestimo";
//import { EmprestimoService } from ''
import { EmprestimoService } from "../services/EmprestimoService";

export class EmprestimoController {
  constructor(private readonly emprestimoService: EmprestimoService) {}

  async listar(): Promise<Emprestimo[]> {
    return this.emprestimoService.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Emprestimo | null> {
    return this.emprestimoService.buscarPorId(id);
  }

  async buscarPorCliente(clienteId: number): Promise<Emprestimo[]> {
    return this.emprestimoService.buscarPorCliente(clienteId);
  }

  async buscarPorExemplar(exemplarId: number): Promise<Emprestimo[]> {
    return this.emprestimoService.buscarPorExemplar(exemplarId);
  }

  async buscarAtivos(): Promise<Emprestimo[]> {
    return this.emprestimoService.buscarAtivos();
  }

  async buscarAtivoPorExemplar(exemplarId: number): Promise<Emprestimo | null> {
    return this.emprestimoService.buscarAtivoPorExemplar(exemplarId);
  }

  async buscarAtivosPorCliente(clienteId: number): Promise<Emprestimo[]> {
    return this.emprestimoService.buscarAtivosPorCliente(clienteId);
  }

  async cadastrar(
    exemplarId: number,
    clienteId: number,
    dataEmprestimo: string,
  ): Promise<Emprestimo> {
    return this.emprestimoService.cadastrar(
      exemplarId,
      clienteId,
      dataEmprestimo,
    );
  }

  async devolver(
    id: number,
    dataDevolucao: string,
  ): Promise<Emprestimo | null> {
    return this.emprestimoService.devolver(id, dataDevolucao);
  }

  async excluir(id: number): Promise<boolean> {
    return this.emprestimoService.excluir(id);
  }
}
