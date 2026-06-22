// Olho da EVA - pontuacao falada (PT-BR).
// Converte palavras DITAS em sinais: "virgula"->, "ponto"->. "nova linha"->quebra etc.
// O ouvido nativo do Chrome nao faz isso; a EVA faz aqui. Default ligado no ditado.
(function () {
  function aplicar(t) {
    if (!t) return t;
    var s = ' ' + String(t).replace(/\s+/g, ' ') + ' ';
    var regras = [
      [/ ponto e v[ií]rgula /gi, '; '],
      [/ ponto de interroga[cç][aã]o /gi, '? '],
      [/ ponto de exclama[cç][aã]o /gi, '! '],
      [/ dois pontos /gi, ': '],
      [/ ponto final /gi, '. '],
      [/ novo par[aá]grafo /gi, '\n\n'],
      [/ par[aá]grafo /gi, '\n\n'],
      [/ nova linha /gi, '\n'],
      [/ quebra de linha /gi, '\n'],
      [/ retic[eê]ncias /gi, '... '],
      [/ interroga[cç][aã]o /gi, '? '],
      [/ exclama[cç][aã]o /gi, '! '],
      [/ abre aspas /gi, ' "'],
      [/ fecha aspas /gi, '" '],
      [/ abre par[eê]ntese[s]? /gi, ' ('],
      [/ fecha par[eê]ntese[s]? /gi, ') '],
      [/ v[ií]rgula /gi, ', '],
      [/ ponto /gi, '. '],
    ];
    for (var p = 0; p < 2; p++) { regras.forEach(function (r) { s = s.replace(r[0], r[1]); }); }
    s = s.replace(/\s+([,.;:!?])/g, '$1');     // sem espaco antes do sinal
    s = s.replace(/([(])\s+/g, '$1');           // sem espaco depois de (
    s = s.replace(/[ \t]{2,}/g, ' ');
    s = s.replace(/ ?\n ?/g, '\n');
    s = s.trim();
    // capitaliza o inicio e depois de . ! ? e de quebra de linha
    s = s.replace(/(^|[.!?]\s+|\n)([a-zà-ÿ])/g, function (m, a, b) { return a + b.toUpperCase(); });
    return s;
  }
  if (typeof window !== 'undefined') window.aplicarPontuacaoFalada = aplicar;
  if (typeof module !== 'undefined' && module.exports) module.exports = aplicar;
})();
