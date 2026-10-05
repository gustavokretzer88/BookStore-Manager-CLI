import { pool } from "../database/connection";
import { EmprestimosPorLivroDTO } from "../dtos/relatorio/EmprestimosPorLivroDTO";
import { LivrosPorAutorDTO } from "../dtos/relatorio/LivrosPorAutorDTO";
import { LivroTituloAutorDTO } from "../dtos/relatorio/LivroTituloAutorDTO";
import { Cliente } from "../models/Cliente";

export class RelatorioRepository {
  async NumeroDelivrosPorAutor(): Promise<LivrosPorAutorDTO[]> {
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
            l.autor_nome,
            COUNT(e.id)::integer AS quantidade_emprestimos
        FROM vw_livrosEAutor l
        LEFT JOIN exemplares ex
            ON ex.livro_id = l.id
        LEFT JOIN emprestimos e
            ON e.exemplar_id = ex.id
        GROUP BY
            l.id,
            l.titulo,
            l.autor_nome
        ORDER BY
            quantidade_emprestimos DESC,
            l.titulo;
        `,
    );

    return result.rows;
  }

  async buscarLivrosDisponiveis(): Promise<LivroTituloAutorDTO[]> {
    const result = await pool.query<LivroTituloAutorDTO>(`
    SELECT 
        l.titulo,
        l.autor_nome
    FROM vw_livrosEAutor l
    WHERE EXISTS (
      SELECT 1
      FROM exemplares e
      WHERE e.livro_id = l.id
        AND NOT EXISTS (
          SELECT 1
          FROM emprestimos emp
          WHERE emp.exemplar_id = e.id
            AND emp.data_devolucao IS NULL
        )
    );
  `);

    return result.rows;
  }

  async buscarLivrosComEmprestimos(): Promise<LivroTituloAutorDTO[]> {
    const result = await pool.query<LivroTituloAutorDTO>(`
    SELECT DISTINCT 
        l.titulo,
        a.nome AS autor_nome
    FROM livros l
    INNER JOIN autores a
        ON a.id = l.autor_id
    INNER JOIN exemplares e
        ON e.livro_id = l.id
    INNER JOIN emprestimos emp
        ON emp.exemplar_id = e.id
    WHERE emp.data_devolucao IS NULL;
  `);

    return result.rows;
  }

  async clientesComEmprestimosAtivo(): Promise<Cliente[]> {
    const result = await pool.query<Cliente>(`
    SELECT DISTINCT
        c.id,
        c.nome,
        c.email,
        c.telefone
    FROM clientes c
    INNER JOIN emprestimos emp
        ON emp.cliente_id = c.id
    WHERE emp.data_devolucao IS NULL
    ORDER BY c.nome;
  `);

    return result.rows;
  }
}
