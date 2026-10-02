import { EmprestimosPorLivroDTO } from "../dtos/relatorio/EmprestimosPorLivroDTO";
import { LivrosPorAutorDTO } from "../dtos/relatorio/LivrosPorAutorDTO";
import { RelatorioRepository } from "../repositories/RelatorioRepository";

export class RelatorioService {
  constructor(private readonly relatorioRepository: RelatorioRepository) {}

  async livrosPorAutor(): Promise<LivrosPorAutorDTO[]> {
    return this.relatorioRepository.livrosPorAutor();
  }

  async buscarEmprestimosPorLivro(): Promise<EmprestimosPorLivroDTO[]> {
    return this.relatorioRepository.buscarEmprestimosPorLivro();
  }
}
