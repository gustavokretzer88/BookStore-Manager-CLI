import { Exemplar, EstadoConservacao } from "../models/Exemplar";

import { ExemplarService } from "../services/ExemplarService";

export class ExemplarController {
  constructor(private readonly exemplarService: ExemplarService) {}

  async listar(): Promise<Exemplar[]> {
    return this.exemplarService.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Exemplar | null> {
    return this.exemplarService.buscarPorId(id);
  }

  async buscarPorCodigo(codigo: string): Promise<Exemplar | null> {
    return this.exemplarService.buscarPorCodigo(codigo);
  }

  async buscarPorLivro(livroId: number): Promise<Exemplar[]> {
    return this.exemplarService.buscarPorLivro(livroId);
  }

  async buscarPorEstado(estado: EstadoConservacao): Promise<Exemplar[]> {
    return this.exemplarService.buscarPorEstado(estado);
  }

  async buscarDisponiveis(): Promise<Exemplar[]> {
    return this.exemplarService.buscarDisponiveis();
  }

  async cadastrar(
    codigo: string,
    livroId: number,
    estadoConservacao: EstadoConservacao,
  ): Promise<Exemplar> {
    return this.exemplarService.cadastrar(codigo, livroId, estadoConservacao);
  }

  async atualizar(
    id: number,
    codigo: string,
    livroId: number,
    estadoConservacao: EstadoConservacao,
  ): Promise<Exemplar | null> {
    return this.exemplarService.atualizar(
      id,
      codigo,
      livroId,
      estadoConservacao,
    );
  }

  async excluir(id: number): Promise<boolean> {
    return this.exemplarService.excluir(id);
  }
}
