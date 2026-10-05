-- ============================================================
-- BOOKSTORE MANAGER CLI
-- Schema do banco de dados
-- PostgreSQL
-- ============================================================


-- ============================================================
-- TABELA: autores
-- ============================================================

CREATE TABLE IF NOT EXISTS autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nacionalidade VARCHAR(100),
    ano_nascimento INTEGER,
    ano_falecimento INTEGER,

    CONSTRAINT chk_autor_anos
        CHECK (
            ano_falecimento IS NULL
            OR ano_nascimento IS NULL
            OR ano_falecimento >= ano_nascimento
        )
);


-- ============================================================
-- TABELA: livros
-- ============================================================

CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    ano_publicacao INTEGER NOT NULL,
    numero_chamada VARCHAR(30) NOT NULL,
    autor_id INTEGER NOT NULL,

    CONSTRAINT fk_livro_autor
        FOREIGN KEY (autor_id)
        REFERENCES autores(id),

    CONSTRAINT chk_livro_ano
        CHECK (
            ano_publicacao IS NULL
            OR ano_publicacao > 0
        )
);


-- ============================================================
-- TABELA: exemplares
-- Cada registro representa uma cópia física de um livro.
-- ============================================================

CREATE TABLE IF NOT EXISTS exemplares (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    livro_id INTEGER NOT NULL,
    estado_conservacao VARCHAR(30) NOT NULL,

    CONSTRAINT fk_exemplar_livro
        FOREIGN KEY (livro_id)
        REFERENCES livros(id),

    CONSTRAINT chk_exemplar_estado
        CHECK (
            estado_conservacao IN (
                'NOVO',
                'BOM',
                'REGULAR',
                'RUIM'
            )
        )
);


-- ============================================================
-- TABELA: clientes
-- ============================================================

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefone VARCHAR(20)
);


-- ============================================================
-- TABELA: emprestimos
-- ============================================================

CREATE TABLE emprestimos (
    id SERIAL PRIMARY KEY,
    exemplar_id INTEGER NOT NULL,
    cliente_id INTEGER NOT NULL,
    data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
    data_devolucao DATE,

    CONSTRAINT fk_emprestimo_exemplar
        FOREIGN KEY (exemplar_id)
        REFERENCES exemplares(id),

    CONSTRAINT fk_emprestimo_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id),

    CONSTRAINT chk_data_devolucao
        CHECK (
            data_devolucao IS NULL
            OR data_devolucao >= data_emprestimo
        )
);


-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_livros_autor
    ON livros(autor_id);

CREATE INDEX IF NOT EXISTS idx_exemplares_livro
    ON exemplares(livro_id);

CREATE INDEX IF NOT EXISTS idx_emprestimos_cliente
    ON emprestimos(cliente_id);

CREATE INDEX IF NOT EXISTS idx_emprestimos_exemplar
    ON emprestimos(exemplar_id);


-- ============================================================
-- UM EXEMPLAR NÃO PODE TER DOIS EMPRÉSTIMOS ATIVOS
-- ============================================================

CREATE UNIQUE INDEX idx_exemplar_emprestimo_ativo
    ON emprestimos(exemplar_id)
    WHERE data_devolucao IS NULL;


-- ============================================================
-- VIEWS
-- ============================================================


-- ============================================================
-- View com as informações do livro e autor juntas.
-- ============================================================

CREATE VIEW vw_livrosEAutor AS
SELECT
    l.id,
    l.titulo,
    l.isbn,
    l.ano_publicacao,
    l.numero_chamada,
    l.autor_id,
    a.nome AS autor_nome,
    a.nacionalidade AS autor_nacionalidade,
    a.ano_nascimento AS autor_ano_nascimento,
    a.ano_falecimento AS autor_ano_falecimento
FROM livros l
INNER JOIN autores a
    ON a.id = l.autor_id;