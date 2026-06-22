// Olho da EVA - historico das ultimas gravacoes/recados enviados pra EVA.
// Guarda em chrome.storage.local (compartilhado entre popup e pagina do microfone).
// Cada item: { id, texto, origem, quando, enviado, visualizou, respondeu }.
(function () {
  var CHAVE = 'historicoEva';
  var MAX = 10; // pelo menos 5; guardamos 10

  async function ler() {
    try { var d = await chrome.storage.local.get(CHAVE); return Array.isArray(d[CHAVE]) ? d[CHAVE] : []; }
    catch (_) { return []; }
  }
  async function registrar(texto, origem) {
    texto = (texto || '').trim();
    if (!texto) return null;
    try {
      var arr = await ler();
      var item = {
        id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        texto: texto, origem: origem || '', quando: Date.now(),
        enviado: true, visualizou: false, respondeu: false,
      };
      arr.unshift(item);
      if (arr.length > MAX) arr = arr.slice(0, MAX);
      var o = {}; o[CHAVE] = arr;
      await chrome.storage.local.set(o);
      return item;
    } catch (_) { return null; }
  }
  async function atualizar(id, campo, valor) {
    try {
      var arr = await ler();
      for (var i = 0; i < arr.length; i++) { if (arr[i].id === id) { arr[i][campo] = valor; break; } }
      var o = {}; o[CHAVE] = arr;
      await chrome.storage.local.set(o);
    } catch (_) {}
  }
  async function limpar() {
    try { var o = {}; o[CHAVE] = []; await chrome.storage.local.set(o); } catch (_) {}
  }
  window.HistoricoEVA = { ler: ler, registrar: registrar, atualizar: atualizar, limpar: limpar };
})();
