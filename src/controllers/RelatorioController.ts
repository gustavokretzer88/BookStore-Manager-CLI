import { EmprestimosPorLivroDTO } from "../dtos/relatorio/EmprestimosPorLivroDTO";
import { LivrosPorAutorDTO } from "../dtos/relatorio/LivrosPorAutorDTO";
import { RelatorioService } from "../services/RelatorioService";
import { RelatorioView } from "../views/RelatorioView";

export class RelatorioController {
  constructor(private readonly relatorioService: RelatorioService) {}

  async livrosPorAutor(): Promise<LivrosPorAutorDTO[]> {
    return await this.relatorioService.livrosPorAutor();
  }

  async emprestimosPorLivro(): Promise<EmprestimosPorLivroDTO[]> {
    return await this.relatorioService.buscarEmprestimosPorLivro();
  }
}
