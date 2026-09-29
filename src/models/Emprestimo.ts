export interface Emprestimo {
  id: number;
  exemplar_id: number;
  cliente_id: number;
  data_emprestimo: Date;
  data_devolucao: Date | null;
}
