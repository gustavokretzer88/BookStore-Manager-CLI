import { Autor } from "../models/Autor";
import { AutorService } from "../services/AutorService";

export class AutorController {
  constructor(private readonly autorService: AutorService) {}

  async listar(): Promise<Autor[]> {
    return this.autorService.buscarTodos();
  }

  async buscarPorId(id: number): Promise<Autor | null> {
    return this.autorService.buscarPorId(id);
  }

  async buscarPorNome(nome: string): Promise<Autor[]> {
    return this.autorService.buscarPorNome(nome);
  }

  async cadastrar(
    nome: string,
    nacionalidade: string | null,
    anoNascimento: number | null,
    anoFalecimento: number | null,
  ): Promise<Autor> {
    return this.autorService.cadastrar(
      nome,
      nacionalidade,
      anoNascimento,
      anoFalecimento,
    );
  }

  async atualizar(
    id: number,
    nome: string,
    nacionalidade: string | null,
    anoNascimento: number | null,
    anoFalecimento: number | null,
  ): Promise<Autor | null> {
    return this.autorService.atualizar(
      id,
      nome,
      nacionalidade,
      anoNascimento,
      anoFalecimento,
    );
  }

  async excluir(id: number): Promise<boolean> {
    return this.autorService.excluir(id);
  }
}
