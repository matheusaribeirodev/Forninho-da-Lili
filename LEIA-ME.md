# Forninho da Lili — site + área administrativa

Site de demonstração da confeitaria, dividido em páginas, com uma área administrativa separada em `/admin`.

## Estrutura

```
forninho-da-lili/
├── index.html            Início: hero, vitrine, "como encomendar"
├── cardapio.html         Cardápio com filtros (lê os produtos do "banco")
├── sobre.html            Sobre Nós
├── contato.html          Contato
├── 404.html              Página não encontrada
├── assets/
│   ├── css/estilo.css    Estilo do site (o mesmo do index.html original)
│   ├── fontes/           Fontes (antes ficavam embutidas no HTML)
│   ├── img/              Logo, fotos da vitrine e img/produtos/
│   └── js/
│       ├── dados.js      "Banco" provisório (localStorage), espelha as tabelas do SQLite
│       └── cardapio.js   Monta o cardápio só com produtos ativos
├── admin/                ← NÃO tem link no site. Abre digitando .../admin
│   ├── index.html        Tela de login (usuário e senha)
│   ├── painel.html       Visão geral: métricas, pedidos recentes, vendas por item
│   ├── pedidos.html      Lista de pedidos (troca rápida de situação, excluir)
│   ├── pedido-form.html  Criar/editar pedido com vários itens
│   ├── produtos.html     Lista de produtos (busca, filtros, ativar/desativar, excluir)
│   ├── produto-form.html Criar/editar produto, com envio de foto
│   ├── clientes.html     Lista de clientes
│   ├── cliente-form.html Criar/editar cliente
│   └── assets/           admin.css e admin.js (proteção por login)
├── banco/                Scripts do SQLite (01_criar_tabelas.sql, 02_dados_exemplo.sql)
└── Dockerfile            Para publicar no Render (PHP 8.2 + Apache + SQLite)
```

## Como testar

Use um servidor local para que o site e o admin enxerguem os mesmos dados:

- VS Code: extensão **Live Server**, abrir `index.html`; ou
- terminal: `php -S localhost:8000` na pasta do projeto (o mesmo comando servirá a versão PHP).

Acesso ao painel: `http://localhost:8000/admin`. **Usuário:** `lili` · **Senha:** `forninho2026`

Teste rápido: cadastre um produto no painel → abra o Cardápio → ele aparece. Desative → some do site.

## Roteiro do professor

1. **Tirar do site todas as evidências do administrador**: botão "Área do Admin" do topo e do rodapé, seção de demonstração do painel e menções a "painel" nos textos e na descrição da página foram removidos. As páginas do admin têm `noindex` (não aparecem no Google).
2. **Pasta `admin` com os recursos administrativos**: pedidos, produtos e clientes, com CRUD completo (criar, ler, editar, excluir).
3. **Tela de login**: `.../admin` abre a tela com "usuário" e "senha". Sem login, qualquer página do admin volta para essa tela. Botão "Sair" encerra a sessão (que também expira em 8 horas).
4. **Autocrítica**: abaixo.

## 4. Autocrítica: pensando no futuro

### Quando a Lili precisar acrescentar mais produtos, como vai fazer?

**Antes:** cada produto era um bloco de HTML copiado à mão dentro do `index.html`. Ela dependeria de alguém que sabe programar, e um erro de cópia podia quebrar a página.

**Agora:** Painel → Produtos → **+ Novo produto**. Ela preenche nome, categoria, preço, descrição, aviso de alérgicos e envia a foto pelo celular (o sistema corta em quadrado e reduz). Ao salvar, o produto aparece no cardápio na hora. Sem foto, o site mostra "Foto em breve". Sem preço, mostra "Sob consulta".

**O que ainda falta:** criar categorias novas pelo painel (hoje são fixas: Docinhos, Cookies, Kits), escolher a ordem dos produtos e editar os 4 doces da vitrine animada da página inicial, que continuam no HTML porque a animação foi feita para exatamente 4 itens.

### Se ela não trabalha mais com algum produto, como será a tratativa?

**Desativar em vez de excluir.** O botão **Desativar** tira o produto do cardápio, mas mantém o cadastro, então os pedidos antigos continuam mostrando o que foi vendido e o relatório "Vendas por item" continua correto. Se o produto voltar (um doce sazonal, por exemplo), é só clicar em **Ativar**.

**Exclusão protegida.** "Excluir" só funciona para produtos que nunca foram vendidos (cadastro feito por engano). Se o produto já aparece em algum pedido, o sistema não deixa excluir e oferece desativar. A mesma regra vale para clientes com pedidos. No SQLite isso é garantido pela chave estrangeira `pedido_item.produto_id`, não só pela tela.

**Preço histórico.** Cada item do pedido guarda o preço do momento da venda (`preco_unitario`). Se ela aumentar o preço amanhã, o faturamento do mês passado não muda.

### Outros pontos fracos que reconhecemos

- **Segurança do login:** nesta versão estática o login é só uma demonstração. A senha está no código JavaScript e os dados ficam no navegador. Isso **não protege nada de verdade**. Na versão PHP: senha com `password_hash`/`password_verify`, sessão com `$_SESSION` verificada em todas as páginas do admin (`protecao.php`), limite de tentativas de login e HTTPS (o Render já fornece).
- **Dados só no navegador:** o `localStorage` vale para um navegador em um computador. Se a Lili cadastrar no celular, o computador não vê. O SQLite no servidor resolve.
- **Fotos grandes:** no navegador cabem poucas fotos (cerca de 5 MB no total). No PHP, as fotos vão para `assets/img/produtos/` como arquivos.
- **Pedidos chegam pelo WhatsApp:** a Lili ainda precisa lançar o pedido no painel manualmente. Um próximo passo seria um carrinho no site que gere a mensagem do WhatsApp **e** já registre o pedido como "Novo".
- **Formulário de contato:** continua só demonstrativo. No PHP ele pode gravar numa tabela `mensagem` e aparecer no painel.
- **Ainda a confirmar com a cliente:** número de WhatsApp, Instagram, horários, prazo mínimo de encomenda, região e taxa de entrega.

## Próximo passo: PHP + SQLite

Cada página já foi pensada para virar um `.php`, seguindo o padrão do projeto lojaFS:

| Hoje (HTML + JS)                 | Versão PHP                                                     |
|----------------------------------|---------------------------------------------------------------|
| `LojaDB.listar('produto')`       | `$pdo->query('SELECT * FROM produto')`                        |
| `LojaDB.salvar(...)`             | `produto_salvar.php` com `INSERT` / `UPDATE` (prepare + execute) |
| `LojaDB.excluir(...)`            | `produto_excluir.php` com `DELETE ... WHERE id = ?`           |
| `cardapio.js`                    | laço `foreach` em `cardapio.php` com `WHERE ativo = 1`        |
| `admin/assets/admin.js` (guarda) | `admin/protecao.php` incluído no topo de cada página          |
| topo/rodapé repetidos            | `topo.php` e `rodape.php` com `include`                       |

As tabelas e colunas de `banco/01_criar_tabelas.sql` têm os mesmos nomes usados no `dados.js`, então as telas não precisam mudar.
