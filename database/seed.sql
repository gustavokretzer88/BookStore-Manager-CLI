-- ============================================================
-- BOOKSTORE MANAGER CLI
-- Dados iniciais / Seed
-- ============================================================


BEGIN;

-- ============================================================
-- AUTORES
-- ============================================================

INSERT INTO autores (
    nome,
    nacionalidade,
    ano_nascimento,
    ano_falecimento
)
VALUES
    ('Machado de Assis', 'Brasileira', 1839, 1908),
    ('Clarice Lispector', 'Brasileira', 1920, 1977),
    ('George Orwell', 'Britânica', 1903, 1950),
    ('Jorge Amado', 'Brasileira', 1912, 2001),
    ('José Saramago', 'Portuguesa', 1922, 2010)
ON CONFLICT DO NOTHING;

-- ============================================================
-- LIVROS
-- ============================================================

INSERT INTO livros (
    titulo,
    isbn,
    ano_publicacao,
    numero_chamada,
    autor_id
)
VALUES
    (
        'Dom Casmurro',
        '9788535902778',
        1899,
        '869.3',
        (SELECT id FROM autores WHERE nome = 'Machado de Assis')
    ),
    (
        'Memórias Póstumas de Brás Cubas',
        '9788535910667',
        1881,
        '869.3',
        (SELECT id FROM autores WHERE nome = 'Machado de Assis')
    ),
    (
        'A Hora da Estrela',
        '9788532508126',
        1977,
        '869.3',
        (SELECT id FROM autores WHERE nome = 'Clarice Lispector')
    ),
    (
        '1984',
        '9780451524935',
        1949,
        '823.912',
        (SELECT id FROM autores WHERE nome = 'George Orwell')
    ),
    (
        'A Revolução dos Bichos',
        '9780451526342',
        1945,
        '823.912',
        (SELECT id FROM autores WHERE nome = 'George Orwell')
    ),
    (
        'Capitães da Areia',
        '9788535911695',
        1937,
        '869.3',
        (SELECT id FROM autores WHERE nome = 'Jorge Amado')
    ),
    (
        'Ensaio sobre a Cegueira',
        '9788535904017',
        1995,
        '869.3',
        (SELECT id FROM autores WHERE nome = 'José Saramago')
    )
ON CONFLICT DO NOTHING;

-- ============================================================
-- EXEMPLARES
-- ============================================================

INSERT INTO exemplares (
    codigo,
    livro_id,
    estado_conservacao
)
VALUES
    (
        'EX-001',
        (SELECT id FROM livros WHERE titulo = 'Dom Casmurro'),
        'NOVO'
    ),
    (
        'EX-002',
        (SELECT id FROM livros WHERE titulo = 'Dom Casmurro'),
        'BOM'
    ),
    (
        'EX-003',
        (SELECT id FROM livros WHERE titulo = 'Dom Casmurro'),
        'REGULAR'
    ),
    (
        'EX-004',
        (SELECT id FROM livros WHERE titulo = 'Memórias Póstumas de Brás Cubas'),
        'BOM'
    ),
    (
        'EX-005',
        (SELECT id FROM livros WHERE titulo = 'A Hora da Estrela'),
        'NOVO'
    ),
    (
        'EX-006',
        (SELECT id FROM livros WHERE titulo = 'A Hora da Estrela'),
        'BOM'
    ),
    (
        'EX-007',
        (SELECT id FROM livros WHERE titulo = '1984'),
        'NOVO'
    ),
    (
        'EX-008',
        (SELECT id FROM livros WHERE titulo = '1984'),
        'BOM'
    ),
    (
        'EX-009',
        (SELECT id FROM livros WHERE titulo = 'A Revolução dos Bichos'),
        'REGULAR'
    ),
    (
        'EX-010',
        (SELECT id FROM livros WHERE titulo = 'Capitães da Areia'),
        'BOM'
    ),
    (
        'EX-011',
        (SELECT id FROM livros WHERE titulo = 'Ensaio sobre a Cegueira'),
        'NOVO'
    ),
    (
        'EX-012',
        (SELECT id FROM livros WHERE titulo = 'Ensaio sobre a Cegueira'),
        'REGULAR'
    )
ON CONFLICT DO NOTHING;


-- ============================================================
-- CLIENTES
-- ============================================================

INSERT INTO clientes (
    nome,
    email,
    telefone
)
VALUES
    ('João da Silva', 'joao@example.com', '(48) 99999-1111'),
    ('Maria Oliveira', 'maria@example.com', '(48) 99999-2222'),
    ('Pedro Santos', 'pedro@example.com', '(48) 99999-3333'),
    ('Ana Souza', 'ana@example.com', '(48) 99999-4444'),
    ('Carlos Pereira', 'carlos@example.com', '(48) 99999-5555')
ON CONFLICT DO NOTHING;


-- ============================================================
-- EMPRÉSTIMOS
-- ============================================================

-- Empréstimos já devolvidos

INSERT INTO emprestimos (
    exemplar_id,
    cliente_id,
    data_emprestimo,
    data_devolucao
)
VALUES
    (
        (SELECT id FROM exemplares WHERE codigo = 'EX-001'),
        (SELECT id FROM clientes WHERE email = 'joao@example.com'),
        CURRENT_DATE - 30,
        CURRENT_DATE - 20
    ),
    (
        (SELECT id FROM exemplares WHERE codigo = 'EX-004'),
        (SELECT id FROM clientes WHERE email = 'maria@example.com'),
        CURRENT_DATE - 25,
        CURRENT_DATE - 15
    ),
    (
        (SELECT id FROM exemplares WHERE codigo = 'EX-007'),
        (SELECT id FROM clientes WHERE email = 'pedro@example.com'),
        CURRENT_DATE - 40,
        CURRENT_DATE - 25
    );


-- Empréstimos atualmente ativos

INSERT INTO emprestimos (
    exemplar_id,
    cliente_id,
    data_emprestimo
)
VALUES
    (
        (SELECT id FROM exemplares WHERE codigo = 'EX-002'),
        (SELECT id FROM clientes WHERE email = 'maria@example.com'),
        CURRENT_DATE - 5
    ),
    (
        (SELECT id FROM exemplares WHERE codigo = 'EX-005'),
        (SELECT id FROM clientes WHERE email = 'joao@example.com'),
        CURRENT_DATE - 10
    ),
    (
        (SELECT id FROM exemplares WHERE codigo = 'EX-010'),
        (SELECT id FROM clientes WHERE email = 'ana@example.com'),
        CURRENT_DATE - 3
    );


COMMIT;