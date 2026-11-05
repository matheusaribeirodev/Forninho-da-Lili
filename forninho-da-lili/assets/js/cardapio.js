/* ==========================================================
   CARDÁPIO — monta os cartões a partir do "banco" (dados.js)
   Só aparecem produtos ATIVOS. Produto desativado some do
   cardápio, mas continua guardado e nos pedidos antigos.
   Na versão PHP, este arquivo deixa de existir: o servidor
   faz o mesmo laço com SELECT * FROM produto WHERE ativo = 1.
   ========================================================== */
(function () {
  'use strict';
  if (!window.LojaDB) return;
  var db = window.LojaDB;
  var esc = db.esc;

  function foto(p) {
    if (p.imagem) {
      return '<div class="foto"><img src="' + esc(db.urlImagem(p.imagem)) + '" alt="' + esc(p.imagem_alt || p.nome) +
        '" width="800" height="800" loading="lazy"></div>';
    }
    return '<div class="foto"><div class="foto-pendente"><img src="assets/img/logo-selo.jpg" alt="" width="56" height="56">Foto em breve</div></div>';
  }

  function cartao(p) {
    return '<article class="item">' + foto(p) +
      '<div class="item-corpo">' +
      '<h4 class="nome-produto">' + esc(p.nome) + '</h4>' +
      '<p class="preco">' + esc(db.dinheiro(p.preco)) + '</p>' +
      (p.descricao ? '<p class="item-descricao">' + esc(p.descricao) + '</p>' : '') +
      (p.alergia ? '<p class="alergia">' + esc(p.alergia) + '</p>' : '') +
      '<a class="botao" href="' + esc(db.linkWhatsApp('Olá! Gostaria de encomendar: ' + p.nome + '.')) +
      '" target="_blank" rel="noopener">Encomendar via WhatsApp</a>' +
      '</div></article>';
  }

  var ativos = db.listar('produto').filter(function (p) { return Number(p.ativo) === 1; });

  db.CATEGORIAS.forEach(function (cat) {
    var grupo = document.querySelector('.grupo[data-categoria="' + cat.id + '"]');
    if (!grupo) return;
    var lista = grupo.querySelector('.lista-produtos');
    var daCategoria = ativos.filter(function (p) { return p.categoria === cat.id; });
    lista.innerHTML = daCategoria.map(cartao).join('');
    // Categoria sem nenhum produto ativo não aparece
    grupo.hidden = daCategoria.length === 0;
  });
})();
