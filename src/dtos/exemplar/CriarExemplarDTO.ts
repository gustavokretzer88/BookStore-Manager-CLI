import { EstadoConservacao } from "../../models/Exemplar";

export interface CriarExemplarDTO {
  codigo: string;
  livro_id: number;
  estado_conservacao: EstadoConservacao;
}
