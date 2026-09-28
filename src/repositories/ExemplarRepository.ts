import { pool } from '../database/connection';
import { Exemplar } from '../models/Exemplar';

export class ExemplarRepository {

    async buscarTodos(): Promise<Exemplar[]> {
        const result = await pool.query<Exemplar>(`
            SELECT
                id,
                codigo,
                livro_id,
                estado_conservacao
            FROM exemplares
            ORDER BY codigo
        `);

        return result.rows;
    }

    async buscarPorId(id: number): Promise<Exemplar | null> {
        const result = await pool.query<Exemplar>(
            `
            SELECT
                id,
                codigo,
                livro_id,
                estado_conservacao
            FROM exemplares
            WHERE id = $1
            `,
            [id]
        );

        return result.rows[0] ?? null;
    }

    async buscarPorCodigo(codigo: string): Promise<Exemplar | null> {
        const result = await pool.query<Exemplar>(
            `
            SELECT
                id,
                codigo,
                livro_id,
                estado_conservacao
            FROM exemplares
            WHERE codigo = $1
            `,
            [codigo]
        );

        return result.rows[0] ?? null;
    }

    async buscarPorLivro(livroId: number): Promise<Exemplar[]> {
        const result = await pool.query<Exemplar>(
            `
            SELECT
                id,
                codigo,
                livro_id,
                estado_conservacao
            FROM exemplares
            WHERE livro_id = $1
            ORDER BY codigo
            `,
            [livroId]
        );

        return result.rows;
    }

    async buscarPorEstado(
        estado: Exemplar['estado_conservacao']
    ): Promise<Exemplar[]> {
        const result = await pool.query<Exemplar>(
            `
            SELECT
                id,
                codigo,
                livro_id,
                estado_conservacao
            FROM exemplares
            WHERE estado_conservacao = $1
            ORDER BY codigo
            `,
            [estado]
        );

        return result.rows;
    }

    async criar(
        codigo: string,
        livroId: number,
        estadoConservacao: Exemplar['estado_conservacao']
    ): Promise<Exemplar> {
        const result = await pool.query<Exemplar>(
            `
            INSERT INTO exemplares (
                codigo,
                livro_id,
                estado_conservacao
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                codigo,
                livro_id,
                estado_conservacao
            `,
            [
                codigo,
                livroId,
                estadoConservacao
            ]
        );

        const exemplar = result.rows[0];

        if (!exemplar) {
            throw new Error('Não foi possível criar o exemplar.');
        }

        return exemplar;
    }

    async atualizar(
        id: number,
        codigo: string,
        livroId: number,
        estadoConservacao: Exemplar['estado_conservacao']
    ): Promise<Exemplar | null> {
        const result = await pool.query<Exemplar>(
            `
            UPDATE exemplares
            SET
                codigo = $1,
                livro_id = $2,
                estado_conservacao = $3
            WHERE id = $4
            RETURNING
                id,
                codigo,
                livro_id,
                estado_conservacao
            `,
            [
                codigo,
                livroId,
                estadoConservacao,
                id
            ]
        );

        return result.rows[0] ?? null;
    }

    async excluir(id: number): Promise<boolean> {
        const result = await pool.query(
            `
            DELETE FROM exemplares
            WHERE id = $1
            `,
            [id]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }
}