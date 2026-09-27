-- ============================================================
-- BOOKSTORE MANAGER CLI
-- Limpar todos os dados do banco
-- Mantém a estrutura das tabelas
-- ============================================================

BEGIN;

TRUNCATE TABLE
    emprestimos,
    exemplares,
    livros,
    clientes,
    autores
RESTART IDENTITY
CASCADE;

COMMIT;