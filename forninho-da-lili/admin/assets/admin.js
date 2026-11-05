/* ==========================================================
   FORNINHO DA LILI — funções comuns da área administrativa
   ----------------------------------------------------------
   1. Proteção: toda página do admin carrega este arquivo no
      <head>. Sem login, a pessoa volta para a tela de entrada.
   2. Ajudantes: sair, mensagens (?msg=...), confirmação.

   IMPORTANTE (segurança): nesta versão o login é só uma
   demonstração no navegador, e qualquer pessoa que leia o
   código vê a senha. Na versão PHP:
     - a senha fica no SQLite como password_hash();
     - o login confere com password_verify();
     - a página verifica $_SESSION no servidor antes de mostrar
       qualquer dado (arquivo protecao.php incluído no topo).
   ========================================================== */
(function () {
  'use strict';

  var SESSAO = 'forninho-da-lili:sessao';
  var DURACAO_HORAS = 8;

  /* Usuário de demonstração. Na versão PHP vem da tabela usuario. */
  var USUARIOS_DEMO = [
    { usuario: 'lili', senha: 'forninho2026', nome: 'Lili' }
  ];

  function lerSessao() {
    try {
      var s = JSON.parse(window.localStorage.getItem(SESSAO));
      if (s && s.expira > Date.now()) return s;
    } catch (e) { /* sem sessão */ }
    return null;
  }

  function entrar(usuario, senha) {
    usuario = String(usuario || '').trim().toLowerCase();
    var achado = USUARIOS_DEMO.filter(function (u) { return u.usuario === usuario && u.senha === senha; })[0];
    if (!achado) return false;
    var sessao = { usuario: achado.usuario, nome: achado.nome, expira: Date.now() + DURACAO_HORAS * 3600 * 1000 };
    try { window.localStorage.setItem(SESSAO, JSON.stringify(sessao)); } catch (e) { return false; }
    return true;
  }

  function sair() {
    try { window.localStorage.removeItem(SESSAO); } catch (e) { /* nada */ }
    window.location.replace('index.html');
  }

  /* ---------- 1. PROTEÇÃO DAS PÁGINAS ---------- */
  var paginaDeLogin = document.documentElement.hasAttribute('data-login');
  var sessao = lerSessao();

  if (!paginaDeLogin && !sessao) {
    window.location.replace('index.html');
    // Evita mostrar o conteúdo por um instante antes de redirecionar
    document.documentElement.style.visibility = 'hidden';
  }

  /* ---------- 2. AJUDANTES ---------- */
  function param(nome) {
    return new URLSearchParams(window.location.search).get(nome);
  }

  /* Mostra a mensagem de ?msg=salvo etc. dentro do elemento [data-aviso] */
  function mostrarAviso(mapa) {
    var caixa = document.querySelector('[data-aviso]');
    var chave = param('msg');
    if (!caixa || !chave || !mapa[chave]) return;
    var info = mapa[chave];
    var texto = typeof info === 'string' ? info : info.texto;
    caixa.className = 'aviso' + (info.erro ? ' aviso-erro' : '');
    caixa.textContent = texto;
    caixa.hidden = false;
    // limpa o ?msg= da barra de endereço, para não repetir ao atualizar
    if (window.history.replaceState) window.history.replaceState(null, '', window.location.pathname);
  }

  /* Caixa de confirmação. Uso:
     Admin.confirmar({ titulo, texto, botao, perigo }).then(function (ok) { ... }) */
  function confirmar(op) {
    return new Promise(function (resolver) {
      var d = document.createElement('dialog');
      d.className = 'dialogo';
      d.setAttribute('aria-labelledby', 'dialogo-titulo');
      var botaoOk = op.botao
        ? '<button type="button" class="botao' + (op.perigo ? ' botao-perigo' : '') + '" data-ok>' + LojaDB.esc(op.botao) + '</button>'
        : '';
      d.innerHTML = '<h2 id="dialogo-titulo">' + LojaDB.esc(op.titulo) + '</h2>' +
        '<p>' + (op.html || LojaDB.esc(op.texto || '')) + '</p>' +
        '<div class="form-acoes">' + botaoOk +
        '<button type="button" class="botao botao-claro" data-cancelar>' + LojaDB.esc(op.cancelar || (op.botao ? 'Cancelar' : 'Entendi')) + '</button>' +
        '</div>';
      document.body.appendChild(d);
      function fechar(resposta) { d.close(); d.remove(); resolver(resposta); }
      if (botaoOk) d.querySelector('[data-ok]').addEventListener('click', function () { fechar(true); });
      d.querySelector('[data-cancelar]').addEventListener('click', function () { fechar(false); });
      d.addEventListener('cancel', function (e) { e.preventDefault(); fechar(false); });
      d.showModal();
    });
  }

  function iniciarPagina() {
    document.querySelectorAll('[data-sair]').forEach(function (b) {
      b.addEventListener('click', sair);
    });
    document.querySelectorAll('[data-nome-usuario]').forEach(function (el) {
      if (sessao) el.textContent = sessao.nome;
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciarPagina);
  else iniciarPagina();

  window.Admin = {
    entrar: entrar,
    sair: sair,
    logado: function () { return !!lerSessao(); },
    param: param,
    mostrarAviso: mostrarAviso,
    confirmar: confirmar
  };
})();
