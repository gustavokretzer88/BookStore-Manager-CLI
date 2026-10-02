import { pool } from "../database/connection";
import { LivroComAutorDTO } from "../dtos/livro/LivroComAutorDTO";
import { Livro } from "../models/Livro";

export class LivroRepository {
  async buscarTodos(): Promise<Livro[]> {
    const result = await pool.query<Livro>(`
            SELECT
                id,
                titulo,
                isbn,
                ano_publicacao,
                numero_chamada,
                autor_id
            FROM livros
            ORDER BY titulo
        `);

    return result.rows;
  }

  async buscarTodosComAutor(): Promise<LivroComAutorDTO[]> {
    const result = await pool.query(`
        SELECT
            l.id,
            l.titulo,
            l.isbn,
            l.ano_publicacao,
            l.numero_chamada,
            a.nome AS autor_nome
        FROM livros l
        INNER JOIN autores a
            ON a.id = l.autor_id
        ORDER BY l.titulo
    `);

    return result.rows;
  }

  async buscarPorId(id: number): Promise<Livro | null> {
    const result = await pool.query<Livro>(
      `
            SELECT
                id,
                titulo,
                isbn,
                ano_publicacao,
                numero_chamada,
                autor_id
            FROM livros
            WHERE id = $1
            `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async buscarPorIdComAutor(id: number): Promise<LivroComAutorDTO | null> {
    const result = await pool.query(
      `
            SELECT
              l.id,
              l.titulo,
              l.isbn,
              l.ano_publicacao,
              l.numero_chamada,
              a.nome AS autor_nome
          FROM livros l
          INNER JOIN autores a
              ON a.id = l.autor_id
          WHERE l.id = $1
          `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async buscarPorIsbn(isbn: string): Promise<Livro | null> {
    const result = await pool.query<Livro>(
      `
            SELECT
                id,
                titulo,
                isbn,
                ano_publicacao,
                numero_chamada,
                autor_id
            FROM livros
            WHERE isbn = $1
            `,
      [isbn],
    );

    return result.rows[0] ?? null;
  }

  async buscarPorIsbnComAutor(isbn: string): Promise<LivroComAutorDTO | null> {
    const result = await pool.query(
      `
            SELECT
                l.id,
                l.titulo,
                l.isbn,
                l.ano_publicacao,
                l.numero_chamada,
                a.nome AS autor_nome
            FROM livros l
            INNER JOIN autores a
                ON l.autor_id = a.id
            WHERE l.isbn = $1
            `,
      [isbn],
    );

    return result.rows[0] ?? null;
  }

  async buscarPorTitulo(titulo: string): Promise<Livro[]> {
    const result = await pool.query<Livro>(
      `
            SELECT
                id,
                titulo,
                isbn,
                ano_publicacao,
                numero_chamada,
                autor_id
            FROM livros
            WHERE titulo ILIKE '%' || $1 || '%'
            ORDER BY titulo
            `,
      [titulo],
    );

    return result.rows;
  }

  async buscarPorTituloComAutor(titulo: string): Promise<LivroComAutorDTO[]> {
    const result = await pool.query<LivroComAutorDTO>(
      `
        SELECT
            l.id,
            l.titulo,
            l.isbn,
            l.ano_publicacao,
            l.numero_chamada,
            a.nome AS autor_nome
        FROM livros l
        INNER JOIN autores a
            ON a.id = l.autor_id
        WHERE l.titulo ILIKE '%' || $1 || '%'
        ORDER BY l.titulo;
        `,
      [titulo],
    );

    return result.rows;
  }

  async buscarPorAutor(autorId: number): Promise<Livro[]> {
    const result = await pool.query<Livro>(
      `
            SELECT
                id,
                titulo,
                isbn,
                ano_publicacao,
                numero_chamada,
                autor_id
            FROM livros
            WHERE autor_id = $1
            ORDER BY titulo
            `,
      [autorId],
    );

    return result.rows;
  }

  async buscarPorAutorComAutor(autorId: number): Promise<LivroComAutorDTO[]> {
    const result = await pool.query<LivroComAutorDTO>(
      `
        SELECT
            l.id,
            l.titulo,
            l.isbn,
            l.ano_publicacao,
            l.numero_chamada,
            a.nome AS autor_nome
        FROM livros l
        INNER JOIN autores a
            ON a.id = l.autor_id
        WHERE l.autor_id = $1
        ORDER BY l.titulo;
        `,
      [autorId],
    );

    return result.rows;
  }

  async buscarPorNomeAutor(nomeAutor: string): Promise<Livro[]> {
    const result = await pool.query<Livro>(
      `
            SELECT
                l.id,
                l.titulo,
                l.isbn,
                l.ano_publicacao,
                l.numero_chamada,
                l.autor_id
            FROM livros l
            INNER JOIN autores a
                ON a.id = l.autor_id
            WHERE a.nome ILIKE '%' || $1 || '%'
            ORDER BY l.titulo
            `,
      [nomeAutor],
    );

    return result.rows;
  }

  async buscarPorNomeAutorComAutor(
    nomeAutor: string,
  ): Promise<LivroComAutorDTO[]> {
    const result = await pool.query<LivroComAutorDTO>(
      `
        SELECT
            l.id,
            l.titulo,
            l.isbn,
            l.ano_publicacao,
            l.numero_chamada,
            a.nome AS autor_nome
        FROM livros l
        INNER JOIN autores a
            ON a.id = l.autor_id
        WHERE a.nome ILIKE $1
        ORDER BY l.titulo;
        `,
      [`%${nomeAutor}%`],
    );

    return result.rows;
  }

  async buscarPorNumeroChamada(numeroChamada: string): Promise<Livro[]> {
    const result = await pool.query<Livro>(
      `
            SELECT
                id,
                titulo,
                isbn,
                ano_publicacao,
                numero_chamada,
                autor_id
            FROM livros
            WHERE numero_chamada = $1
            ORDER BY titulo
            `,
      [numeroChamada],
    );

    return result.rows;
  }

  async buscarPorNumeroChamadaComAutor(
    numeroChamada: string,
  ): Promise<LivroComAutorDTO[]> {
    const result = await pool.query(
      `
        SELECT
            l.id,
            l.titulo,
            l.isbn,
            l.ano_publicacao,
            l.numero_chamada,
            a.nome AS autor_nome
        FROM livros l
        INNER JOIN autores a
            ON a.id = l.autor_id
        WHERE l.numero_chamada = $1
        ORDER BY l.titulo;
        `,
      [numeroChamada],
    );

    return result.rows;
  }

  async criar(
    titulo: string,
    isbn: string | null,
    anoPublicacao: number | null,
    numeroChamada: string | null,
    autorId: number,
  ): Promise<Livro> {
    const result = await pool.query<Livro>(
      `
            INSERT INTO livros (
                titulo,
                isbn,
                ano_publicacao,
                numero_chamada,
                autor_id
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id,
                titulo,
                isbn,
                ano_publicacao,
                numero_chamada,
                autor_id
            `,
      [titulo, isbn, anoPublicacao, numeroChamada, autorId],
    );
    const livro = result.rows[0];
    if (!livro) {
      throw new Error("Não foi possível criar o livro.");
    }
    return livro;
  }

  async atualizar(
    id: number,
    titulo: string,
    isbn: string | null,
    anoPublicacao: number | null,
    numeroChamada: string | null,
    autorId: number,
  ): Promise<Livro | null> {
    const result = await pool.query<Livro>(
      `
            UPDATE livros
            SET
                titulo = $1,
                isbn = $2,
                ano_publicacao = $3,
                numero_chamada = $4,
                autor_id = $5
            WHERE id = $6
            RETURNING
                id,
                titulo,
                isbn,
                ano_publicacao,
                numero_chamada,
                autor_id
            `,
      [titulo, isbn, anoPublicacao, numeroChamada, autorId, id],
    );

    return result.rows[0] ?? null;
  }

  async excluir(id: number): Promise<boolean> {
    try {
      const result = await pool.query(
        `
              DELETE FROM livros
              WHERE id = $1
              `,
        [id],
      );

      return result.rowCount !== null && result.rowCount > 0;
    } catch (erro) {
      if (
        erro instanceof Error &&
        "code" in erro &&
        erro.code === "23503" &&
        "constraint" in erro &&
        erro.constraint === "fk_exemplar_livro"
      ) {
        throw new Error(
          "Não é possível remover o livro porque existem exemplares associados a ele.",
        );
      }

      throw erro;
    }
  }
}
