export type EstadoConservacao = "NOVO" | "BOM" | "REGULAR" | "RUIM";

export interface Exemplar {
  id: number;
  codigo: string;
  livro_id: number;
  estado_conservacao: EstadoConservacao;
}
