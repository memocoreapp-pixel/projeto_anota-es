// Olho da EVA - cerebro de fundo (service worker, MV3)
// Coordena: injeta o seletor na pagina, fotografa a aba, manda o recorte
// pro MOTOR (offscreen) fazer OCR + descricao, monta o RELATORIO em TEXTO e
// (opcional) envia pro canto da EVA. Nada disso passa imagem pelo chat.

const BRIDGE_ENVIAR = 'https://eva-dla.pages.dev/enviar';
const BRIDGE_OLHO_NUVEM = 'https://eva-dla.pages.dev/olho-nuvem';

// ---------- disparo ----------
chrome.action.onClicked.addListener(() => {}); // popup cuida; aqui so por seguranca
chrome.commands.onCommand.addListener(async (cmd) => {
  if (cmd === 'capturar-area') {
    const opcoes = await lerOpcoes();
    iniciarCaptura(null, opcoes);
  }
});

async function lerOpcoes() {
  const d = await chrome.storage.local.get('opcoes');
  return Object.assign(
    { camadaA: true, camadaB: true, camadaC: false, lenteC: 'nuvem', provedorNuvem: 'cloudflare', ocrMotor: 'nuvem', modeloC: 'HuggingFaceTB/SmolVLM-256M-Instruct', autoEnviar: false, idiomaOCR: 'por+eng' },
    d.opcoes || {}
  );
}

async function iniciarCaptura(tab, opcoes) {
  // Bloco 1: respeita o ON/OFF master
  try {
    const d = await chrome.storage.local.get('ativo');
    if (d.ativo === false) {
      notificarPopup({ tipo: 'ERRO', erro: 'A EVA esta DESLIGADA. Religue no botao do topo do painel.' });
      return;
    }
  } catch (_) {}
  if (!tab || !tab.id) {
    const [a] = await chrome.tabs.query({ active: true, currentWindow: true });
    tab = a;
  }
  if (!tab || !tab.id) return;
  if (/^(chrome|edge|about|chrome-extension|edge-extension|devtools):/i.test(tab.url || '')) {
    notificarPopup({ tipo: 'ERRO', erro: 'A captura de tela so funciona em SITES NORMAIS (ex.: o chat do Kiro em app.kiro.dev). Esta aba e uma pagina interna do navegador/extensao - abra a aba do site que voce quer capturar e clique de novo.' });
    return;
  }
  await chrome.storage.local.set({ opcoes });
  try {
    await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['content.css'] });
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
    chrome.tabs.sendMessage(tab.id, { type: 'OLHO_ARMAR', opcoes });
  } catch (e) {
    notificarPopup({ tipo: 'ERRO', erro: 'Nao consegui ativar o seletor aqui: ' + String(e && e.message || e) });
  }
}

// ---------- mensagens (UM unico listener, todas as rotas) ----------
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type) return false;

  // popup pede pra comecar a captura
  if (msg.type === 'OLHO_START') {
    iniciarCaptura(null, msg.opcoes);
    sendResponse({ ok: true });
    return false;
  }

  // content.js pede a foto da aba visivel
  if (msg.type === 'OLHO_CAPTURE') {
    const winId = sender.tab ? sender.tab.windowId : undefined;
    chrome.tabs.captureVisibleTab(winId, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) sendResponse({ erro: chrome.runtime.lastError.message });
      else sendResponse({ dataUrl });
    });
    return true;
  }

  // content.js entrega o resultado bruto: texto do esqueleto + recorte + opcoes
  if (msg.type === 'OLHO_PIPELINE') {
    processarPipeline(msg).then((r) => sendResponse(r)).catch((e) => sendResponse({ ok: false, erro: String(e && e.message || e) }));
    return true;
  }

  // popup pede pra enviar manualmente pro canto da EVA
  if (msg.type === 'OLHO_ENVIAR') {
    enviarParaEva(msg.texto).then((r) => sendResponse(r));
    return true;
  }

  // popup pede pra LER a ultima resposta da EVA no chat (1 clique, semi-automatico)
  if (msg.type === 'OLHO_RECEBER_RESPOSTA') {
    receberResposta(msg.seletor, msg.chatUrl).then((r) => sendResponse(r));
    return true;
  }

  // popup pede pra GUARDAR O CHAT INTEIRO na casa da EVA (1 clique)
  if (msg.type === 'OLHO_GUARDAR_CHAT') {
    guardarChatInteiro(msg.seletorChat, msg.chatUrl).then((r) => sendResponse(r));
    return true;
  }

  // popup anexou uma IMAGEM (arquivo) -> a lente da nuvem le/descreve
  if (msg.type === 'OLHO_ARQUIVO_IMAGEM') {
    lerArquivoImagem(msg.dataUrl, msg.nome).then((r) => sendResponse(r)).catch((e) => sendResponse({ ok: false, erro: String(e && e.message || e) }));
    return true;
  }

  return false;
});

// ---------- conectores editaveis ----------
async function urlConect(chave, padrao) {
  try {
    const d = await chrome.storage.local.get('conectores');
    const v = d.conectores && d.conectores[chave];
    return (v && String(v).trim()) || padrao;
  } catch (_) { return padrao; }
}

// ---------- receber a resposta da EVA (le o chat) ----------
async function receberResposta(seletor, chatUrl) {
  try {
    let tab;
    if (chatUrl) {
      const base = chatUrl.split('#')[0].split('?')[0];
      const tabs = await chrome.tabs.query({});
      tab = tabs.find((t) => t.url && t.url.indexOf(base) === 0);
    }
    if (!tab) { const [a] = await chrome.tabs.query({ active: true, currentWindow: true }); tab = a; }
    if (!tab || !tab.id) return { ok: false, erro: 'nao achei a aba do chat' };
    if (/^(chrome|edge|about|chrome-extension|edge-extension|devtools):/i.test(tab.url || '')) {
      return { ok: false, erro: 'esta aba e interna do navegador; abra a aba do chat' };
    }
    const res = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: grabResposta, args: [seletor || ''] });
    return (res && res[0] && res[0].result) || { ok: false, erro: 'sem retorno da pagina' };
  } catch (e) {
    return { ok: false, erro: String(e && e.message || e) };
  }
}

// roda DENTRO da pagina do chat (precisa ser auto-contida)
function grabResposta(seletor) {
  function txt(el) { return (el && (el.innerText || el.textContent) || '').replace(/\u00a0/g, ' ').replace(/\n{3,}/g, '\n\n').trim(); }
  if (seletor) {
    var els;
    try { els = document.querySelectorAll(seletor); } catch (e) { return { ok: false, erro: 'seletor invalido' }; }
    if (els && els.length) return { ok: true, texto: txt(els[els.length - 1]) };
    return { ok: false, erro: 'nada encontrado com o alvo: ' + seletor };
  }
  // modo automatico: maior bloco de texto "folha" da pagina (heuristica)
  var nodes = document.querySelectorAll('div,article,section,li,p');
  var best = null, bestLen = 0;
  for (var i = 0; i < nodes.length; i++) {
    var t = txt(nodes[i]);
    if (t.length < 40 || t.length > 15000) continue;
    if (t.length > bestLen) { best = nodes[i]; bestLen = t.length; }
  }
  if (best) return { ok: true, texto: txt(best), heuristica: true };
  return { ok: false, erro: 'nao achei bloco de resposta' };
}

// ---------- guardar o CHAT INTEIRO na casa da EVA ----------
async function guardarChatInteiro(seletorChat, chatUrl) {
  try {
    let tab;
    if (chatUrl) {
      const base = chatUrl.split('#')[0].split('?')[0];
      const tabs = await chrome.tabs.query({});
      tab = tabs.find((t) => t.url && t.url.indexOf(base) === 0);
    }
    if (!tab) { const [a] = await chrome.tabs.query({ active: true, currentWindow: true }); tab = a; }
    if (!tab || !tab.id) return { ok: false, erro: 'nao achei a aba do chat' };
    if (/^(chrome|edge|about|chrome-extension|edge-extension|devtools):/i.test(tab.url || '')) {
      return { ok: false, erro: 'esta aba e interna do navegador; abra a aba do chat (app.kiro.dev)' };
    }
    const res = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: grabChatInteiro, args: [seletorChat || ''] });
    const r = (res && res[0] && res[0].result) || { ok: false, erro: 'sem retorno da pagina' };
    if (!r.ok || !r.texto) return r;

    // cabecalho + envio pra ponte (pasta/nome de backup; bridge antigo ignora e cai na caixa-de-entrada)
    const agora = new Date();
    const cab =
      '=== CHAT COMPLETO (backup) — guardado pela EVA (Olho da EVA) ===\n' +
      'Pagina: ' + (tab.title || '') + '\n' +
      'Endereco: ' + (tab.url || '') + '\n' +
      'Quando: ' + agora.toLocaleString('pt-BR') + '\n' +
      'Mensagens/blocos capturados: ' + (r.n || '?') + (r.heuristica ? ' (modo automatico)' : '') + '\n' +
      '=================================================================\n\n';
    const corpo = cab + r.texto + '\n';

    const p2 = (n) => (n < 10 ? '0' + n : '' + n);
    const nomeArquivo = 'chat_backup-eva_' + agora.getFullYear() + '-' + p2(agora.getMonth() + 1) + '-' + p2(agora.getDate()) +
      '_' + p2(agora.getHours()) + '-' + p2(agora.getMinutes()) + '-' + p2(agora.getSeconds()) + '.txt';

    const envio = await enviarParaEva(corpo, {
      titulo: 'CHAT COMPLETO (backup) — Olho da EVA',
      pasta: 'MEMORIA/chats-do-mestre',
      nomeArquivo,
    });
    return { ok: true, texto: corpo, n: r.n, heuristica: r.heuristica, envio, nomeArquivo };
  } catch (e) {
    return { ok: false, erro: String(e && e.message || e) };
  }
}

// roda DENTRO da pagina do chat (auto-contida): pega TODAS as mensagens/o container da conversa
function grabChatInteiro(seletor) {
  function txt(el) { return (el && (el.innerText || el.textContent) || '').replace(/\u00a0/g, ' ').replace(/\n{3,}/g, '\n\n').trim(); }

  // 1) se o Mestre informou um seletor de mensagens, junta TODAS na ordem
  if (seletor) {
    var els;
    try { els = document.querySelectorAll(seletor); } catch (e) { return { ok: false, erro: 'seletor do chat invalido' }; }
    if (els && els.length) {
      var partes = [];
      for (var i = 0; i < els.length; i++) { var t = txt(els[i]); if (t) partes.push(t); }
      if (partes.length) return { ok: true, texto: partes.join('\n\n— — —\n\n'), n: partes.length };
    }
    return { ok: false, erro: 'nada encontrado com o alvo do chat: ' + seletor };
  }

  // 2) heuristica: o CONTAINER de conversa = elemento rolavel com mais texto
  var melhor = null, melhorLen = 0;
  var todos = document.querySelectorAll('main, [role="main"], div, section, ul');
  for (var j = 0; j < todos.length; j++) {
    var el = todos[j];
    var tag = el.tagName.toLowerCase();
    if (tag === 'body' || tag === 'html') continue;
    var cs;
    try { cs = getComputedStyle(el); } catch (e) { continue; }
    var rolavel = (cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 40;
    var t2 = txt(el);
    if (t2.length < 200) continue;
    // prioriza rolaveis (containers de chat); senao usa tamanho do texto
    var score = t2.length + (rolavel ? 1000000 : 0);
    if (score > melhorLen) { melhorLen = score; melhor = el; }
  }
  if (melhor) {
    // tenta contar blocos (mensagens) filhos diretos pra informar
    var blocos = 0;
    try { blocos = melhor.querySelectorAll(':scope > *').length; } catch (e) {}
    return { ok: true, texto: txt(melhor), heuristica: true, n: blocos || undefined };
  }
  // 3) ultimo recurso: o corpo inteiro
  var corpo = txt(document.body);
  if (corpo) return { ok: true, texto: corpo, heuristica: true };
  return { ok: false, erro: 'nao consegui ler a conversa nesta aba' };
}

// ---------- anexo de IMAGEM: a lente da nuvem le/descreve o arquivo ----------
async function lerArquivoImagem(dataUrl, nome) {
  if (!dataUrl) return { ok: false, erro: 'sem imagem' };
  const opcoes = await lerOpcoes();
  const prov = opcoes.provedorNuvem || 'cloudflare';
  const partes = [];
  partes.push('=== ARQUIVO ANEXADO (imagem) — lido pela lente da EVA ===');
  if (nome) partes.push('Arquivo: ' + nome);
  partes.push('Lente: ' + (prov === 'anthropic' ? 'NUVEM/Claude' : 'NUVEM/Cloudflare'));
  partes.push('Quando: ' + new Date().toLocaleString('pt-BR'));
  partes.push('');

  // 1) letras (OCR na nuvem)
  notificarPopup({ tipo: 'STATUS', texto: 'Lendo as letras do arquivo na nuvem...' });
  const ro = await ocrNaNuvem(dataUrl, prov);
  partes.push('--- LETRAS LIDAS (OCR) ---');
  partes.push((ro && ro.ok && ro.texto && ro.texto.trim()) ? ro.texto.trim() : '(sem texto reconhecido' + (ro && !ro.ok ? ': ' + (ro.erro || '') : '') + ')');
  partes.push('');

  // 2) descricao da imagem
  notificarPopup({ tipo: 'STATUS', texto: 'Descrevendo o arquivo na nuvem...' });
  const rn = await olharNaNuvem(dataUrl, prov);
  partes.push('--- DESCRICAO DA IMAGEM ---');
  partes.push((rn && rn.ok && rn.descricao && rn.descricao.trim()) ? rn.descricao.trim() : '(sem descricao' + (rn && !rn.ok ? ': ' + (rn.erro || '') : '') + ')');
  partes.push('');
  partes.push('=== FIM DO ARQUIVO ANEXADO ===');

  const relatorio = partes.join('\n');
  try { await chrome.storage.local.set({ ultimoRelatorio: relatorio, ultimoEm: Date.now() }); } catch (_) {}
  acenderBadge('✓');
  return { ok: true, relatorio };
}

// ---------- pipeline principal ----------
async function processarPipeline(msg) {
  const opcoes = msg.opcoes || {};
  const partes = {
    meta: msg.meta || {},
    esqueleto: msg.esqueleto || '',
    ocr: '',
    descricao: '',
    avisos: [],
  };

  // Camadas B e/ou C precisam de motor; mas o Olho C na NUVEM e leve (vai direto)
  const lenteC = opcoes.lenteC || 'nuvem';
  const ocrMotor = opcoes.ocrMotor || 'nuvem';
  const querB = !!opcoes.camadaB && !!msg.cropDataUrl;
  const querBNuvem = querB && ocrMotor === 'nuvem';
  const querBLocal = querB && ocrMotor === 'local';
  const querCLocal = !!opcoes.camadaC && lenteC === 'local' && !!msg.cropDataUrl;
  const querCNuvem = !!opcoes.camadaC && lenteC === 'nuvem' && !!msg.cropDataUrl;

  // CAMADA B na NUVEM (OCR confiavel): le as letras da imagem pela lente Cloudflare/Claude
  if (querBNuvem) {
    notificarPopup({ tipo: 'STATUS', texto: 'Lendo as letras da imagem na nuvem...' });
    const ro = await ocrNaNuvem(msg.cropDataUrl, opcoes.provedorNuvem || 'cloudflare');
    if (ro && ro.ok) partes.ocr = ro.texto || '';
    else partes.avisos.push('OCR na nuvem falhou: ' + ((ro && (ro.erro + (ro.dica ? ' - ' + ro.dica : ''))) || 'desconhecido'));
  }

  // Olho na NUVEM (leve no PC, qualidade alta) - chama a funcao Cloudflare
  if (querCNuvem) {
    const prov = opcoes.provedorNuvem || 'cloudflare';
    notificarPopup({ tipo: 'STATUS', texto: 'Olho na nuvem (' + (prov === 'anthropic' ? 'Claude' : 'Cloudflare') + '): a lente da EVA esta enxergando a imagem...' });
    const rn = await olharNaNuvem(msg.cropDataUrl, prov);
    if (rn && rn.ok) partes.descricao = rn.descricao || '';
    else partes.avisos.push('Olho na nuvem falhou: ' + ((rn && (rn.erro + (rn.dica ? ' - ' + rn.dica : ''))) || 'desconhecido'));
  }

  // Motor LOCAL (offscreen): OCR local (B local) e/ou descricao local (C local)
  if (querBLocal || querCLocal) {
    notificarPopup({ tipo: 'STATUS', texto: querCLocal ? 'Lendo/descrevendo no PC (1a vez baixa o modelo, pode demorar)...' : 'Lendo letras da imagem no PC...' });
    try {
      await garantirMotor();
      const r = await enviarAoMotor({
        type: 'MOTOR_PROCESSAR',
        target: 'offscreen',
        cropDataUrl: msg.cropDataUrl,
        fazerOCR: querBLocal,
        fazerVLM: querCLocal,
        idiomaOCR: opcoes.idiomaOCR || 'por+eng',
        modeloC: opcoes.modeloC || 'HuggingFaceTB/SmolVLM-256M-Instruct',
      });
      if (r && r.ok) {
        partes.ocr = r.ocrText || '';
        if (querCLocal && r.caption) partes.descricao = r.caption;
        if (r.avisos && r.avisos.length) partes.avisos.push(...r.avisos);
      } else {
        partes.avisos.push('Motor local falhou: ' + ((r && r.erro) || 'desconhecido'));
      }
    } catch (e) {
      partes.avisos.push('Motor local indisponivel: ' + String(e && e.message || e));
    }
  }

  const relatorio = montarRelatorio(partes, opcoes);
  // Recado pra EVA: o escrito NA HORA da captura (overlay) tem prioridade;
  // senao usa o recado fixo do painel (storage.recadoEva).
  let relatorioFinal = relatorio;
  try {
    let recado = (msg.recado || '').trim();
    if (!recado) {
      const d = await chrome.storage.local.get('recadoEva');
      recado = (d.recadoEva || '').trim();
    }
    if (recado) relatorioFinal = '=== RECADO DO MESTRE PRA EVA ===\n' + recado + '\n=== FIM DO RECADO ===\n\n' + relatorio;
  } catch (_) {}
  await chrome.storage.local.set({ ultimoRelatorio: relatorioFinal, ultimoEm: Date.now() });
  acenderBadge('✓');
  notificarPopup({ tipo: 'PRONTO', relatorio: relatorioFinal });

  // envio automatico (se ligado)
  let envio = null;
  if (opcoes.autoEnviar) {
    envio = await enviarParaEva(relatorioFinal);
    notificarPopup({ tipo: 'ENVIO', envio });
  }

  return { ok: true, relatorio: relatorioFinal, envio };
}

// ---------- monta o relatorio em TEXTO ----------
function rotuloLenteC(opcoes) {
  if ((opcoes.lenteC || 'nuvem') === 'local') return 'LOCAL/SmolVLM';
  return (opcoes.provedorNuvem || 'cloudflare') === 'anthropic' ? 'NUVEM/Claude' : 'NUVEM/Cloudflare';
}
function montarRelatorio(p, opcoes) {
  const L = [];
  const m = p.meta || {};
  L.push('=== OLHO DA EVA - CAPTURA ===');
  if (m.titulo) L.push('Pagina: ' + m.titulo);
  if (m.url) L.push('Endereco: ' + m.url);
  if (m.area) L.push('Area marcada: ' + m.area);
  L.push('Quando: ' + new Date().toLocaleString('pt-BR'));
  const camadas = [];
  if (opcoes.camadaA) camadas.push('A (esqueleto)');
  if (opcoes.camadaB) camadas.push('B (letras/OCR)');
  if (opcoes.camadaC) camadas.push('C (descricao da foto - lente ' + rotuloLenteC(opcoes) + ')');
  L.push('Olhos usados: ' + (camadas.join(' + ') || 'nenhum'));
  L.push('');

  if (opcoes.camadaA && p.esqueleto) {
    L.push('--- CAMADA A: ESQUELETO DA AREA (DOM + acessibilidade) ---');
    L.push(p.esqueleto.trim());
    L.push('');
  }
  if (opcoes.camadaB) {
    L.push('--- CAMADA B: LETRAS LIDAS NA IMAGEM (OCR ' + ((opcoes.ocrMotor || 'nuvem') === 'local' ? 'local' : 'na nuvem') + ') ---');
    L.push((p.ocr && p.ocr.trim()) ? p.ocr.trim() : '(nenhum texto reconhecido na imagem ou OCR desligado/sem recorte)');
    L.push('');
  }
  if (opcoes.camadaC) {
    L.push('--- CAMADA C: DESCRICAO DA FOTO (lente ' + rotuloLenteC(opcoes) + ') ---');
    L.push((p.descricao && p.descricao.trim()) ? p.descricao.trim() : '(sem descricao - veja avisos)');
    L.push('');
  }
  if (p.avisos && p.avisos.length) {
    L.push('--- AVISOS (honestidade) ---');
    p.avisos.forEach((a) => L.push('- ' + a));
    L.push('');
  }
  L.push('=== FIM DA CAPTURA ===');
  return L.join('\n');
}

// ---------- ponte com a EVA ----------
const OCR_PROMPT_NUVEM = 'Transcreva FIELMENTE, em texto puro, TODO o texto visivel nesta imagem, na ordem em que aparece (de cima para baixo, da esquerda para a direita). Responda APENAS com o texto transcrito, sem comentarios, sem aspas e sem explicacao. Se nao houver texto legivel, responda exatamente: (sem texto na imagem).';

async function ocrNaNuvem(dataUrl, provedor) {
  // MODO LOCAL: lente na nuvem desativada (nao contata nenhum servidor).
  return { ok: false, erro: 'modo local: OCR na nuvem desativado', local: true };
  try {
    const url = await urlConect('urlNuvem', BRIDGE_OLHO_NUVEM);
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagem: dataUrl, provedor: provedor || 'cloudflare', prompt: OCR_PROMPT_NUVEM }),
    });
    const d = await r.json().catch(() => ({ ok: false, erro: 'resposta_invalida' }));
    if (d && d.ok) return { ok: true, texto: d.descricao || '' };
    return { ok: false, erro: (d && d.erro) || 'erro', dica: d && d.dica };
  } catch (e) {
    return { ok: false, erro: String(e && e.message || e) };
  }
}

async function olharNaNuvem(dataUrl, provedor) {
  // MODO LOCAL: lente na nuvem desativada (nao contata nenhum servidor).
  return { ok: false, erro: 'modo local: descricao de imagem na nuvem desativada', local: true };
  try {
    const url = await urlConect('urlNuvem', BRIDGE_OLHO_NUVEM);
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagem: dataUrl, provedor: provedor || 'cloudflare' }),
    });
    return await r.json().catch(() => ({ ok: false, erro: 'resposta_invalida' }));
  } catch (e) {
    return { ok: false, erro: String(e && e.message || e) };
  }
}

// ---------- helpers de envio: codigo da mensagem + anti-duplicado ----------
function hashTexto(s) {
  s = String(s || ''); let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
async function gerarCodigoMsg() {
  let seq = 0;
  try { const d = await chrome.storage.local.get('seqEnvio'); seq = (d.seqEnvio || 0) + 1; await chrome.storage.local.set({ seqEnvio: seq }); } catch (_) {}
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return { codigo: 'EVA-' + rnd, seq };
}
async function ehDuplicado(hash) {
  try {
    const d = await chrome.storage.local.get('ultimoEnvio');
    const u = d.ultimoEnvio;
    if (u && u.hash === hash && (Date.now() - u.ts) < 90000) return true;
  } catch (_) {}
  return false;
}

async function enviarParaEva(texto, extra) {
  // === MODO ISOLADO (Terminal Kiro) ===
  // Esta copia NUNCA contata a ponte/caixa compartilhada da EVA, para nao
  // cruzar dados com o outro terminal. O texto fica guardado localmente;
  // a entrega neste chat e feita por "Copiar" e colar.
  try {
    await chrome.storage.local.set({ olhoUltimoLocal: { titulo: (extra && extra.titulo) || 'Olho da EVA', texto: String(texto || ''), em: Date.now() } });
  } catch (_) {}
  return { ok: true, local: true, isolado: true };

  // (código de envio à nuvem abaixo fica desativado no modo isolado)
  try {
    const ehBackup = !!(extra && extra.pasta);
    // anti-duplicado: mesmo conteudo em < 90s nao manda de novo (so para envios normais)
    const h = ehBackup ? '' : hashTexto(texto);
    if (!ehBackup) {
      if (await ehDuplicado(h)) return { ok: true, deduped: true };
    }
    // codigo da mensagem (pra identificar e rastrear)
    let codigo = '', seq = 0, textoFinal = texto;
    if (!ehBackup) {
      const c = await gerarCodigoMsg(); codigo = c.codigo; seq = c.seq;
      textoFinal = '=== CODIGO DA MENSAGEM: ' + codigo + ' (#' + seq + ') ===\n' + texto;
    }
    const url = await urlConect('urlEnviar', BRIDGE_ENVIAR);
    const corpo = { titulo: (extra && extra.titulo) || 'Olho da EVA', texto: textoFinal };
    if (extra && extra.pasta) corpo.pasta = extra.pasta;
    if (extra && extra.nomeArquivo) corpo.nomeArquivo = extra.nomeArquivo;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok && data && data.ok) {
      if (!ehBackup) { try { await chrome.storage.local.set({ ultimoEnvio: { hash: h, ts: Date.now() } }); } catch (_) {} }
      return { ok: true, path: data.path, codigo, seq };
    }
    return { ok: false, erro: (data && data.erro) || ('http_' + r.status) };
  } catch (e) {
    return { ok: false, erro: String(e && e.message || e) };
  }
}

// permite o popup pedir o envio manualmente (rota tratada no listener unico acima)

// ---------- motor (offscreen) ----------
async function garantirMotor() {
  try {
    if (chrome.offscreen.hasDocument) {
      const tem = await chrome.offscreen.hasDocument();
      if (tem) return;
    } else {
      const ctx = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] });
      if (ctx && ctx.length) return;
    }
  } catch (_) {}
  await chrome.offscreen.createDocument({
    url: 'motor.html',
    reasons: ['WORKERS', 'BLOBS'],
    justification: 'Rodar OCR (Tesseract) e descricao de imagem (SmolVLM/WebGPU) localmente para a EVA.',
  });
}

function enviarAoMotor(payload) {
  return new Promise((resolve) => {
    let respondeu = false;
    const t = setTimeout(() => { if (!respondeu) resolve({ ok: false, erro: 'OCR demorou demais (>45s) - pode ser imagem grande ou Tesseract travado. A Camada A e a lente Nuvem nao dependem disso.' }); }, 45000);
    chrome.runtime.sendMessage(payload, (r) => {
      respondeu = true; clearTimeout(t);
      if (chrome.runtime.lastError) resolve({ ok: false, erro: chrome.runtime.lastError.message });
      else resolve(r);
    });
  });
}

// ---------- avisos visuais ----------
function acenderBadge(txt) {
  try {
    chrome.action.setBadgeBackgroundColor({ color: '#6D5DF6' });
    chrome.action.setBadgeText({ text: txt || '' });
  } catch (_) {}
}
function notificarPopup(obj) {
  // se o popup estiver aberto ele escuta; se nao, ignora silenciosamente.
  // Em alguns Chromes sendMessage sem callback NAO retorna Promise -> blindamos.
  try {
    const p = chrome.runtime.sendMessage(Object.assign({ type: 'OLHO_UI' }, obj), () => {
      // descarta lastError (popup fechado e normal)
      void chrome.runtime.lastError;
    });
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch (_) { /* ignora */ }
}
