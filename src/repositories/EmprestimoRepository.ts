import { pool } from '../database/connection';
import { Emprestimo } from '../models/Emprestimo';

export class EmprestimoRepository {

    async buscarTodos(): Promise<Emprestimo[]> {
        const result = await pool.query<Emprestimo>(`
            SELECT
                id,
                exemplar_id,
                cliente_id,
                data_emprestimo,
                data_devolucao,
                devolvido
            FROM emprestimos
            ORDER BY data_emprestimo DESC
        `);

        return result.rows;
    }

    async buscarPorId(id: number): Promise<Emprestimo | null> {
        const result = await pool.query<Emprestimo>(
            `
            SELECT
                id,
                exemplar_id,
                cliente_id,
                data_emprestimo,
                data_devolucao,
                devolvido
            FROM emprestimos
            WHERE id = $1
            `,
            [id]
        );

        return result.rows[0] ?? null;
    }

    async buscarPorCliente(clienteId: number): Promise<Emprestimo[]> {
        const result = await pool.query<Emprestimo>(
            `
            SELECT
                id,
                exemplar_id,
                cliente_id,
                data_emprestimo,
                data_devolucao,
                devolvido
            FROM emprestimos
            WHERE cliente_id = $1
            ORDER BY data_emprestimo DESC
            `,
            [clienteId]
        );

        return result.rows;
    }

    async buscarPorExemplar(exemplarId: number): Promise<Emprestimo[]> {
        const result = await pool.query<Emprestimo>(
            `
            SELECT
                id,
                exemplar_id,
                cliente_id,
                data_emprestimo,
                data_devolucao,
                devolvido
            FROM emprestimos
            WHERE exemplar_id = $1
            ORDER BY data_emprestimo DESC
            `,
            [exemplarId]
        );

        return result.rows;
    }

    async buscarAtivos(): Promise<Emprestimo[]> {
        const result = await pool.query<Emprestimo>(`
            SELECT
                id,
                exemplar_id,
                cliente_id,
                data_emprestimo,
                data_devolucao,
                devolvido
            FROM emprestimos
            WHERE devolvido = FALSE
            ORDER BY data_emprestimo
        `);

        return result.rows;
    }

    async buscarAtivoPorExemplar(
        exemplarId: number
    ): Promise<Emprestimo | null> {
        const result = await pool.query<Emprestimo>(
            `
            SELECT
                id,
                exemplar_id,
                cliente_id,
                data_emprestimo,
                data_devolucao,
                devolvido
            FROM emprestimos
            WHERE exemplar_id = $1
              AND devolvido = FALSE
            `,
            [exemplarId]
        );

        return result.rows[0] ?? null;
    }

    async buscarAtivosPorCliente(
        clienteId: number
    ): Promise<Emprestimo[]> {
        const result = await pool.query<Emprestimo>(
            `
            SELECT
                id,
                exemplar_id,
                cliente_id,
                data_emprestimo,
                data_devolucao,
                devolvido
            FROM emprestimos
            WHERE cliente_id = $1
              AND devolvido = FALSE
            ORDER BY data_emprestimo
            `,
            [clienteId]
        );

        return result.rows;
    }

    async criar(
        exemplarId: number,
        clienteId: number,
        dataEmprestimo: string
    ): Promise<Emprestimo> {
        const result = await pool.query<Emprestimo>(
            `
            INSERT INTO emprestimos (
                exemplar_id,
                cliente_id,
                data_emprestimo
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                exemplar_id,
                cliente_id,
                data_emprestimo,
                data_devolucao,
                devolvido
            `,
            [
                exemplarId,
                clienteId,
                dataEmprestimo
            ]
        );

        const emprestimo = result.rows[0];

        if (!emprestimo) {
            throw new Error('Não foi possível criar o empréstimo.');
        }

        return emprestimo;
    }

    async devolver(
        id: number,
        dataDevolucao: string
    ): Promise<Emprestimo | null> {
        const result = await pool.query<Emprestimo>(
            `
            UPDATE emprestimos
            SET
                data_devolucao = $1,
                devolvido = TRUE
            WHERE id = $2
              AND devolvido = FALSE
            RETURNING
                id,
                exemplar_id,
                cliente_id,
                data_emprestimo,
                data_devolucao,
                devolvido
            `,
            [
                dataDevolucao,
                id
            ]
        );

        return result.rows[0] ?? null;
    }

    async excluir(id: number): Promise<boolean> {
        const result = await pool.query(
            `
            DELETE FROM emprestimos
            WHERE id = $1
            `,
            [id]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }
}