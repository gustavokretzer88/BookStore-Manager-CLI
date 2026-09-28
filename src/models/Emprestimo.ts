export interface Emprestimo {
    id: number;
    exemplar_id: number;
    cliente_id: number;
    data_emprestimo: string;
    data_devolucao: string | null;
    devolvido: boolean;
}