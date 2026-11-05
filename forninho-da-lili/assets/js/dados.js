/* ==========================================================
   FORNINHO DA LILI — "banco de dados" de demonstração
   ----------------------------------------------------------
   Enquanto o PHP + SQLite não entra, os dados ficam guardados
   no próprio navegador (localStorage). As "tabelas" abaixo têm
   os MESMOS nomes e colunas do arquivo banco/01_criar_tabelas.sql,
   então cada função daqui vira uma consulta SQL depois:

     LojaDB.listar('produto')        ->  SELECT * FROM produto
     LojaDB.buscar('produto', 3)     ->  SELECT * FROM produto WHERE id = 3
     LojaDB.salvar('produto', {...}) ->  INSERT ... ou UPDATE ... WHERE id = ?
     LojaDB.excluir('produto', 3)    ->  DELETE FROM produto WHERE id = 3

   Atenção: localStorage vale só para ESTE navegador, neste
   computador. Serve para apresentar o projeto, não para a loja
   funcionar de verdade (isso é papel do SQLite no servidor).
   ========================================================== */
(function () {
  'use strict';

  var CHAVE = 'forninho-da-lili:banco:v1';

  /* Categorias fixas do cardápio (no SQLite: tabela categoria) */
  var CATEGORIAS = [
    { id: 'docinhos', nome: 'Docinhos' },
    { id: 'cookies', nome: 'Cookies' },
    { id: 'kits', nome: 'Kits e presentes' }
  ];

  var STATUS_PEDIDO = ['Novo', 'Em preparo', 'Pronto', 'Entregue', 'Cancelado'];

  var WHATSAPP = '5511989634843';

  /* Data no formato do banco (AAAA-MM-DD), contando dias para trás a partir de hoje.
     Assim os pedidos de exemplo sempre caem no mês atual da apresentação. */
  function diasAtras(n) {
    var d = new Date();
    d.setDate(d.getDate() - n);
    var mes = String(d.getMonth() + 1).padStart(2, '0');
    var dia = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mes + '-' + dia;
  }

  /* Dados de exemplo: o mesmo conteúdo de banco/02_dados_exemplo.sql */
  function dadosIniciais() {
    return {
      produto: [
        { id: 1, nome: 'Coxinha de morango de chocolate tradicional', categoria: 'docinhos', preco: 9.00,
          descricao: 'Morango envolvido em brigadeiro e coberto com granulado de chocolate.',
          alergia: 'Contém leite.', imagem: 'assets/img/produtos/coxinha-chocolate.jpg',
          imagem_alt: 'Coxinha de morango coberta com granulado de chocolate, em forminha de papel branca', ativo: 1 },
        { id: 2, nome: 'Coxinha de morango de amendoim e castanhas', categoria: 'docinhos', preco: 10.00,
          descricao: 'Coberta com amendoim e castanhas, com chocolate por cima.',
          alergia: 'Contém leite, amendoim e castanhas.', imagem: 'assets/img/produtos/coxinha-amendoim.jpg',
          imagem_alt: 'Coxinha coberta com amendoim e castanhas, com chocolate por cima, em forminha de papel branca', ativo: 1 },
        { id: 3, nome: 'Coxinha de ninho com chocolate', categoria: 'docinhos', preco: 8.00,
          descricao: 'Coxinha de ninho com chocolate aplicado à mão.',
          alergia: 'Contém glúten, leite e ovos.', imagem: 'assets/img/produtos/coxinha-ninho.jpg',
          imagem_alt: 'Coxinha de ninho com chocolate aplicado por cima, em forminha de papel branca', ativo: 1 },
        { id: 4, nome: 'Cookie com doce de leite', categoria: 'cookies', preco: 12.00,
          descricao: 'Cookie com gotas de chocolate e doce de leite por cima.',
          alergia: 'Contém glúten, leite e ovos.', imagem: 'assets/img/produtos/cookie-doce-de-leite.jpg',
          imagem_alt: 'Cookie com gotas de chocolate e doce de leite por cima, em embalagem transparente', ativo: 1 },
        { id: 5, nome: 'Cookie com gotas de chocolate', categoria: 'cookies', preco: 10.00,
          descricao: 'A versão clássica, com bastante gota de chocolate.',
          alergia: 'Contém glúten, leite e ovos.', imagem: '', imagem_alt: '', ativo: 1 },
        { id: 6, nome: 'Kit presente com 4 doces', categoria: 'kits', preco: 38.00,
          descricao: 'Uma caixinha delicada para surpreender alguém especial.',
          alergia: 'Contém glúten, leite e ovos.', imagem: '', imagem_alt: '', ativo: 1 },
        { id: 7, nome: 'Kit colegas de trabalho com 12 doces', categoria: 'kits', preco: 98.00,
          descricao: 'Doces sortidos para dividir com a equipe.',
          alergia: 'Contém glúten, leite e ovos.', imagem: '', imagem_alt: '', ativo: 1 },
        { id: 8, nome: 'Kit personalizado', categoria: 'kits', preco: null,
          descricao: 'Você conta a ocasião e a Lili monta o kit com os doces escolhidos.',
          alergia: 'Alérgicos variam conforme os doces escolhidos.', imagem: '', imagem_alt: '', ativo: 1 }
      ],
      cliente: [
        { id: 1, nome: 'Ana Souza', telefone: '(11) 98765-4321', email: 'ana.souza@email.com', cidade: 'São Paulo' },
        { id: 2, nome: 'Bruno Lima', telefone: '(11) 97654-3210', email: 'bruno.lima@email.com', cidade: 'Osasco' },
        { id: 3, nome: 'Carla Mendes', telefone: '(11) 96543-2109', email: 'carla.mendes@email.com', cidade: 'Barueri' },
        { id: 4, nome: 'Diego Santos', telefone: '(11) 95432-1098', email: 'diego.santos@email.com', cidade: 'Carapicuíba' },
        { id: 5, nome: 'Eduarda Rocha', telefone: '(11) 94321-0987', email: 'eduarda.rocha@email.com', cidade: 'Santana de Parnaíba' },
        { id: 6, nome: 'Fernanda Alves', telefone: '(11) 93210-9876', email: 'fernanda.alves@email.com', cidade: 'Cotia' }
      ],
      pedido: [
        { id: 1, cliente_id: 1, data_pedido: diasAtras(12), status: 'Entregue', entrega: 'Retirada', observacao: '' },
        { id: 2, cliente_id: 2, data_pedido: diasAtras(10), status: 'Entregue', entrega: 'Entrega', observacao: 'Entregar na portaria.' },
        { id: 3, cliente_id: 3, data_pedido: diasAtras(7), status: 'Entregue', entrega: 'Retirada', observacao: '' },
        { id: 4, cliente_id: 4, data_pedido: diasAtras(5), status: 'Cancelado', entrega: 'Entrega', observacao: 'Cliente desistiu.' },
        { id: 5, cliente_id: 5, data_pedido: diasAtras(3), status: 'Pronto', entrega: 'Retirada', observacao: 'Aniversário, caprichar no laço.' },
        { id: 6, cliente_id: 1, data_pedido: diasAtras(1), status: 'Em preparo', entrega: 'Entrega', observacao: '' },
        { id: 7, cliente_id: 6, data_pedido: diasAtras(0), status: 'Novo', entrega: 'Retirada', observacao: '' }
      ],
      /* Cada linha é um produto dentro de um pedido. O preço é copiado no momento
         da venda: se a Lili mudar o preço depois, os pedidos antigos não mudam. */
      pedido_item: [
        { id: 1, pedido_id: 1, produto_id: 1, quantidade: 10, preco_unitario: 9.00 },
        { id: 2, pedido_id: 1, produto_id: 3, quantidade: 6, preco_unitario: 8.00 },
        { id: 3, pedido_id: 2, produto_id: 7, quantidade: 1, preco_unitario: 98.00 },
        { id: 4, pedido_id: 3, produto_id: 2, quantidade: 12, preco_unitario: 10.00 },
        { id: 5, pedido_id: 3, produto_id: 4, quantidade: 4, preco_unitario: 12.00 },
        { id: 6, pedido_id: 4, produto_id: 6, quantidade: 2, preco_unitario: 38.00 },
        { id: 7, pedido_id: 5, produto_id: 8, quantidade: 1, preco_unitario: 75.00 },
        { id: 8, pedido_id: 5, produto_id: 1, quantidade: 8, preco_unitario: 9.00 },
        { id: 9, pedido_id: 6, produto_id: 1, quantidade: 20, preco_unitario: 9.00 },
        { id: 10, pedido_id: 6, produto_id: 5, quantidade: 6, preco_unitario: 10.00 },
        { id: 11, pedido_id: 7, produto_id: 4, quantidade: 3, preco_unitario: 12.00 }
      ]
    };
  }

  /* ---------- leitura e gravação ---------- */
  var memoria = null; // usado se o navegador bloquear o localStorage

  function carregar() {
    try {
      var texto = window.localStorage.getItem(CHAVE);
      if (texto) return JSON.parse(texto);
    } catch (e) { /* sem localStorage: segue com a memória */ }
    if (!memoria) memoria = dadosIniciais();
    return memoria;
  }

  function gravar(banco) {
    memoria = banco;
    try {
      window.localStorage.setItem(CHAVE, JSON.stringify(banco));
      return true;
    } catch (e) {
      // Normalmente acontece quando a foto enviada é grande demais para o navegador
      console.warn('Não foi possível gravar no navegador:', e);
      return false;
    }
  }

  function copia(obj) { return obj ? JSON.parse(JSON.stringify(obj)) : null; }

  /* ---------- "SQL" ---------- */
  function listar(tabela) {
    return copia(carregar()[tabela] || []);
  }

  function buscar(tabela, id) {
    id = Number(id);
    var linha = (carregar()[tabela] || []).filter(function (r) { return r.id === id; })[0];
    return copia(linha);
  }

  /* Sem id -> INSERT (cria o próximo id). Com id -> UPDATE. Devolve o id salvo. */
  function salvar(tabela, registro) {
    var banco = carregar();
    var linhas = banco[tabela] || (banco[tabela] = []);
    registro = copia(registro);
    if (registro.id) {
      registro.id = Number(registro.id);
      var i = linhas.findIndex(function (r) { return r.id === registro.id; });
      if (i === -1) linhas.push(registro); else linhas[i] = Object.assign(linhas[i], registro);
    } else {
      var maior = linhas.reduce(function (m, r) { return Math.max(m, r.id); }, 0);
      registro.id = maior + 1;
      linhas.push(registro);
    }
    if (!gravar(banco)) throw new Error('armazenamento-cheio');
    return registro.id;
  }

  function excluir(tabela, id) {
    id = Number(id);
    var banco = carregar();
    banco[tabela] = (banco[tabela] || []).filter(function (r) { return r.id !== id; });
    gravar(banco);
  }

  /* Apaga várias linhas de uma vez (ex.: DELETE FROM pedido_item WHERE pedido_id = ?) */
  function excluirOnde(tabela, coluna, valor) {
    var banco = carregar();
    banco[tabela] = (banco[tabela] || []).filter(function (r) { return r[coluna] !== valor; });
    gravar(banco);
  }

  function restaurarExemplo() {
    memoria = null;
    try { window.localStorage.removeItem(CHAVE); } catch (e) { /* nada */ }
    gravar(dadosIniciais());
  }

  /* ---------- ajudantes de exibição ---------- */
  function dinheiro(valor) {
    if (valor === null || valor === undefined || valor === '') return 'Sob consulta';
    return 'R$ ' + Number(valor).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function dataBr(data) {
    if (!data) return '';
    var p = data.split('-');
    return p[2] + '/' + p[1] + '/' + p[0];
  }

  function nomeCategoria(id) {
    var c = CATEGORIAS.filter(function (c) { return c.id === id; })[0];
    return c ? c.nome : id;
  }

  /* Evita que um nome digitado com < > quebre a página (equivale ao htmlspecialchars do PHP) */
  function esc(texto) {
    return String(texto === null || texto === undefined ? '' : texto)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Caminho da foto visto de outra pasta (o admin fica em /admin, um nível abaixo) */
  function urlImagem(caminho, prefixo) {
    if (!caminho) return '';
    if (/^(https?:|data:|\/)/.test(caminho)) return caminho;
    return (prefixo || '') + caminho;
  }

  function linkWhatsApp(texto) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);
  }

  window.LojaDB = {
    CATEGORIAS: CATEGORIAS,
    STATUS_PEDIDO: STATUS_PEDIDO,
    listar: listar,
    buscar: buscar,
    salvar: salvar,
    excluir: excluir,
    excluirOnde: excluirOnde,
    restaurarExemplo: restaurarExemplo,
    dinheiro: dinheiro,
    dataBr: dataBr,
    nomeCategoria: nomeCategoria,
    esc: esc,
    urlImagem: urlImagem,
    linkWhatsApp: linkWhatsApp
  };
})();
