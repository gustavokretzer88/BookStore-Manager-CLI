-- ============================================================
-- BOOKSTORE MANAGER CLI
-- Reset completo do banco de dados
-- PostgreSQL
-- ============================================================

BEGIN;

-- ============================================================
-- 1. REMOVER TABELAS
-- ============================================================

DROP TABLE IF EXISTS emprestimos CASCADE;
DROP TABLE IF EXISTS exemplares CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS livros CASCADE;
DROP TABLE IF EXISTS autores CASCADE;


COMMIT;


-- Recria o schema
\i schema.sql