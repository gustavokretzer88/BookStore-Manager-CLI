import { EmprestimosPorLivroDTO } from "../dtos/relatorio/EmprestimosPorLivroDTO";
import { LivrosPorAutorDTO } from "../dtos/relatorio/LivrosPorAutorDTO";
import { LivroTituloAutorDTO } from "../dtos/relatorio/LivroTituloAutorDTO";
import { Cliente } from "../models/Cliente";
import { RelatorioRepository } from "../repositories/RelatorioRepository";

export class RelatorioService {
  constructor(private readonly relatorioRepository: RelatorioRepository) {}

  async livrosPorAutor(): Promise<LivrosPorAutorDTO[]> {
    return this.relatorioRepository.NumeroDelivrosPorAutor();
  }

  async buscarEmprestimosPorLivro(): Promise<EmprestimosPorLivroDTO[]> {
    return this.relatorioRepository.buscarEmprestimosPorLivro();
  }

  async buscarLivrosDisponiveis(): Promise<LivroTituloAutorDTO[]> {
    return this.relatorioRepository.buscarLivrosDisponiveis();
  }

  async buscarLivrosComEmprestimo(): Promise<LivroTituloAutorDTO[]> {
    return this.relatorioRepository.buscarLivrosComEmprestimos();
  }

  async clientesComEmprestimoAtivo(): Promise<Cliente[]> {
    return this.relatorioRepository.clientesComEmprestimosAtivo();
  }
}
