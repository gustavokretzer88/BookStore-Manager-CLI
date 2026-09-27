export interface Livro {
    id: number;
    titulo: string;
    isbn: string | null;
    ano_publicacao: number | null;
    numero_chamada: string | null;
    autor_id: number;
}