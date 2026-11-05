-- 01_criar_tabelas.sql — Forninho da Lili (SQLite)
-- Mesmas tabelas e colunas usadas hoje em assets/js/dados.js.
-- Rode no DB Browser for SQLite: aba "Executar SQL" > Executar > Escrever modificações.

PRAGMA foreign_keys = ON;

CREATE TABLE usuario (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario     TEXT NOT NULL UNIQUE,
    nome        TEXT NOT NULL,
    senha_hash  TEXT NOT NULL            -- gerado com password_hash() no PHP, NUNCA a senha pura
);

CREATE TABLE categoria (
    id     TEXT PRIMARY KEY,             -- 'docinhos', 'cookies', 'kits'
    nome   TEXT NOT NULL,
    ordem  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE produto (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT NOT NULL,
    categoria   TEXT NOT NULL REFERENCES categoria (id),
    preco       REAL,                    -- NULL = "Sob consulta"
    descricao   TEXT,
    alergia     TEXT,
    imagem      TEXT,                    -- caminho: assets/img/produtos/arquivo.jpg
    imagem_alt  TEXT,
    ativo       INTEGER NOT NULL DEFAULT 1   -- 1 = aparece no cardápio, 0 = desativado
);

CREATE TABLE cliente (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT NOT NULL,
    telefone  TEXT,
    email     TEXT,
    cidade    TEXT
);

CREATE TABLE pedido (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id   INTEGER NOT NULL REFERENCES cliente (id),
    data_pedido  TEXT NOT NULL,          -- AAAA-MM-DD
    status       TEXT NOT NULL DEFAULT 'Novo'
                 CHECK (status IN ('Novo','Em preparo','Pronto','Entregue','Cancelado')),
    entrega      TEXT NOT NULL DEFAULT 'Retirada' CHECK (entrega IN ('Retirada','Entrega')),
    observacao   TEXT
);

-- Um pedido pode ter vários produtos. O preço é COPIADO no momento da venda,
-- então mudar o preço do produto depois não altera pedidos antigos.
CREATE TABLE pedido_item (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id       INTEGER NOT NULL REFERENCES pedido (id) ON DELETE CASCADE,
    produto_id      INTEGER NOT NULL REFERENCES produto (id),   -- impede excluir produto já vendido
    quantidade      INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario  REAL NOT NULL CHECK (preco_unitario >= 0)
);
