import { pool } from "../database/connection";
import { Cliente } from "../models/Cliente";

export class ClienteRepository {
  async buscarTodos(): Promise<Cliente[]> {
    const result = await pool.query<Cliente>(`
            SELECT
                id,
                nome,
                email,
                telefone
            FROM clientes
            ORDER BY nome
        `);

    return result.rows;
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    const result = await pool.query<Cliente>(
      `
            SELECT
                id,
                nome,
                email,
                telefone
            FROM clientes
            WHERE id = $1
            `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async buscarPorNome(nome: string): Promise<Cliente[]> {
    const result = await pool.query<Cliente>(
      `
            SELECT
                id,
                nome,
                email,
                telefone
            FROM clientes
            WHERE nome ILIKE '%' || $1 || '%'
            ORDER BY nome
            `,
      [nome],
    );

    return result.rows;
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const result = await pool.query<Cliente>(
      `
            SELECT
                id,
                nome,
                email,
                telefone
            FROM clientes
            WHERE email = $1
            `,
      [email],
    );

    return result.rows[0] ?? null;
  }

  async criar(
    nome: string,
    email: string,
    telefone: string | null,
  ): Promise<Cliente> {
    const result = await pool.query<Cliente>(
      `
            INSERT INTO clientes (
                nome,
                email,
                telefone
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                nome,
                email,
                telefone
            `,
      [nome, email, telefone],
    );

    const cliente = result.rows[0];

    if (!cliente) {
      throw new Error("Não foi possível criar o cliente.");
    }

    return cliente;
  }

  async atualizar(
    id: number,
    nome: string,
    email: string,
    telefone: string | null,
  ): Promise<Cliente | null> {
    const result = await pool.query<Cliente>(
      `
            UPDATE clientes
            SET
                nome = $1,
                email = $2,
                telefone = $3
            WHERE id = $4
            RETURNING
                id,
                nome,
                email,
                telefone
            `,
      [nome, email, telefone, id],
    );

    return result.rows[0] ?? null;
  }

  async excluir(id: number): Promise<boolean> {
    try {
      const result = await pool.query(
        `
            DELETE FROM clientes
            WHERE id = $1
            `,
        [id],
      );

      return result.rowCount === 1;
    } catch (erro) {
      if (
        erro instanceof Error &&
        "code" in erro &&
        erro.code === "23503" &&
        "constraint" in erro &&
        erro.constraint === "fk_emprestimo_cliente"
      ) {
        throw new Error(
          "Não é possível remover o cliente porque existem empréstimos associados a ele.",
        );
      }

      throw erro;
    }
  }
}
