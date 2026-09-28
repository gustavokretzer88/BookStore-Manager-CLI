import { pool } from "../database/connection";
import { Autor } from "../models/Autor";

export class AutorRepository {
  async buscarTodos(): Promise<Autor[]> {
    const result = await pool.query<Autor>(`
            SELECT
                id,
                nome,
                nacionalidade,
                ano_nascimento,
                ano_falecimento
            FROM autores
            ORDER BY nome
        `);

    return result.rows;
  }

  async buscarPorId(id: number): Promise<Autor | null> {
    const result = await pool.query<Autor>(
      `
            SELECT
                id,
                nome,
                nacionalidade,
                ano_nascimento,
                ano_falecimento
            FROM autores
            WHERE id = $1
            `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async buscarPorNome(nome: string): Promise<Autor[]> {
    const result = await pool.query<Autor>(
      `
            SELECT
                id,
                nome,
                nacionalidade,
                ano_nascimento,
                ano_falecimento
            FROM autores
            WHERE nome ILIKE '%' || $1 || '%'
            ORDER BY nome
            `,
      [nome],
    );

    return result.rows;
  }

  async criar(
    nome: string,
    nacionalidade: string | null,
    anoNascimento: number | null,
    anoFalecimento: number | null,
  ): Promise<Autor> {
    const result = await pool.query<Autor>(
      `
            INSERT INTO autores (
                nome,
                nacionalidade,
                ano_nascimento,
                ano_falecimento
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                nome,
                nacionalidade,
                ano_nascimento,
                ano_falecimento
            `,
      [nome, nacionalidade, anoNascimento, anoFalecimento],
    );

    const autor = result.rows[0];

    if (!autor) {
      throw new Error("Não foi possível criar o autor.");
    }

    return autor;
  }

  async atualizar(
    id: number,
    nome: string,
    nacionalidade: string | null,
    anoNascimento: number | null,
    anoFalecimento: number | null,
  ): Promise<Autor | null> {
    const result = await pool.query<Autor>(
      `
            UPDATE autores
            SET
                nome = $1,
                nacionalidade = $2,
                ano_nascimento = $3,
                ano_falecimento = $4
            WHERE id = $5
            RETURNING
                id,
                nome,
                nacionalidade,
                ano_nascimento,
                ano_falecimento
            `,
      [nome, nacionalidade, anoNascimento, anoFalecimento, id],
    );

    return result.rows[0] ?? null;
  }

  async excluir(id: number): Promise<boolean> {
    const result = await pool.query(
      `
            DELETE FROM autores
            WHERE id = $1
            `,
      [id],
    );

    return result.rowCount !== null && result.rowCount > 0;
  }
}
