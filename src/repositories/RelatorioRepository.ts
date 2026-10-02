import { pool } from "../database/connection";
import { EmprestimosPorLivroDTO } from "../dtos/relatorio/EmprestimosPorLivroDTO";
import { LivrosPorAutorDTO } from "../dtos/relatorio/LivrosPorAutorDTO";
import { Livro } from "../models/Livro";

export class RelatorioRepository {
  async livrosPorAutor(): Promise<LivrosPorAutorDTO[]> {
    const result = await pool.query<LivrosPorAutorDTO>(
      `
        SELECT
            a.nome AS autor_nome,
            COUNT(l.id)::integer AS quantidade_livros
        FROM autores a
        LEFT JOIN livros l
            ON l.autor_id = a.id
        GROUP BY a.id, a.nome
        ORDER BY quantidade_livros DESC;
        `,
    );

    return result.rows;
  }

  async buscarEmprestimosPorLivro(): Promise<EmprestimosPorLivroDTO[]> {
    const result = await pool.query<EmprestimosPorLivroDTO>(
      `
        SELECT
            l.id AS livro_id,
            l.titulo,
            a.nome AS autor_nome,
            COUNT(e.id)::integer AS quantidade_emprestimos
        FROM livros l
        INNER JOIN autores a
            ON a.id = l.autor_id
        LEFT JOIN exemplares ex
            ON ex.livro_id = l.id
        LEFT JOIN emprestimos e
            ON e.exemplar_id = ex.id
        GROUP BY
            l.id,
            l.titulo,
            a.nome
        ORDER BY
            quantidade_emprestimos DESC,
            l.titulo;
        `,
    );

    return result.rows;
  }
}
