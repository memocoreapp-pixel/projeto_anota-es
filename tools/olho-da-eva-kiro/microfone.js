// Olho da EVA — pagina dedicada do microfone.
// Roda numa ABA (contexto persistente), onde a permissao de microfone e o
// reconhecimento de voz funcionam de forma confiavel (o popup transitorio nao).
const $ = (id) => document.getElementById(id);

function status(el, msg, cls) {
  el.textContent = msg;
  el.className = 'status' + (cls ? ' ' + cls : '');
}

// ---------- PASSO 1: liberar o microfone (getUserMedia dispara o pedido) ----------
$('btnLiberar').addEventListener('click', async () => {
  const st = $('statusLiberar');
  status(st, 'Pedindo permissao... escolha "Permitir" na caixa do Chrome.', 'on');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // libera na hora: nao precisamos gravar, so queriamos a permissao
    stream.getTracks().forEach((t) => t.stop());
    status(st, '✓ Microfone liberado! Agora o ditado (passo 2) e o botao do painel funcionam.', 'ok');
  } catch (e) {
    const m = (e && e.name) || '';
    let msg = 'Nao consegui liberar: ' + (e && (e.message || e.name) || 'erro');
    if (m === 'NotAllowedError') msg = 'Permissao negada. Clique no cadeado da barra de endereco -> Microfone -> Permitir, e tente de novo.';
    if (m === 'NotFoundError') msg = 'Nenhum microfone encontrado no computador.';
    status(st, msg, 'erro');
  }
});

// ---------- PASSO 2: ditar nesta pagina (Web Speech API, PT-BR) ----------
let reconhecimento = null;
let ativo = false;

$('btnDitar').addEventListener('click', () => {
  const st = $('statusDitar');
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { status(st, 'Reconhecimento de voz nao disponivel (use Chrome ou Edge).', 'erro'); return; }
  if (ativo && reconhecimento) { reconhecimento.stop(); return; }

  reconhecimento = new SR();
  reconhecimento.lang = 'pt-BR';
  reconhecimento.continuous = true;
  reconhecimento.interimResults = true;
  reconhecimento.maxAlternatives = 1;

  const base = $('texto').value || '';
  let acumulado = '';

  reconhecimento.onstart = () => {
    ativo = true; $('btnDitar').classList.add('gravando'); $('btnDitar').textContent = '⏹ Parar';
    status(st, '🎙 Ouvindo em portugues... fale e clique em Parar quando terminar.', 'on');
  };
  reconhecimento.onresult = (e) => {
    let interino = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const seg = e.results[i][0].transcript;
      if (e.results[i].isFinal) acumulado += seg + ' '; else interino += seg;
    }
    const bruto = (base && !base.endsWith(' ') ? base + ' ' : base) + acumulado + interino;
    $('texto').value = (window.aplicarPontuacaoFalada ? window.aplicarPontuacaoFalada(bruto) : bruto);
  };
  reconhecimento.onerror = (e) => {
    const msgs = {
      'not-allowed': 'Permissao negada. Faca o passo 1 (Liberar microfone) primeiro.',
      'service-not-allowed': 'Servico de voz bloqueado. Faca o passo 1 e confirme que ha internet.',
      'no-speech': 'Nao ouvi nada. Tente de novo, mais perto do microfone.',
      'audio-capture': 'Microfone nao encontrado.',
      'network': 'Erro de rede no servico de voz (precisa de internet).',
    };
    status(st, msgs[e.error] || ('Erro: ' + e.error), 'erro');
    parar();
  };
  reconhecimento.onend = () => {
    const tinha = acumulado.trim();
    parar();
    if (tinha) status(st, '✓ Pronto! Clique em "Salvar na caixa de Recado".', 'ok');
  };

  try { reconhecimento.start(); }
  catch (e) { status(st, 'Erro ao iniciar: ' + (e && e.message), 'erro'); parar(); }
});

function parar() {
  ativo = false;
  $('btnDitar').classList.remove('gravando'); $('btnDitar').textContent = '🎙 Comecar a falar';
  if (reconhecimento) { try { reconhecimento.stop(); } catch (_) {} reconhecimento = null; }
}

$('btnSalvar').addEventListener('click', async () => {
  const st = $('statusDitar');
  const txt = ($('texto').value || '').trim();
  if (!txt) { status(st, 'Nada pra salvar — dite algo primeiro.', 'erro'); return; }
  try {
    await chrome.storage.local.set({ recadoEva: txt });
    status(st, '✓ Salvo na caixa de Recado! Abra o painel da extensao — ja vai estar la.', 'ok');
  } catch (e) {
    status(st, 'Nao consegui salvar: ' + (e && e.message), 'erro');
  }
});

$('btnLimpar').addEventListener('click', () => { $('texto').value = ''; status($('statusDitar'), '', ''); $('statusDitar').className = 'status'; });



// ---------- PASSO 3: PREMIUM (gravar -> Whisper na nuvem -> limpeza por IA) ----------
var ENDPOINT_PADRAO = 'https://eva-dla.pages.dev/transcrever-audio';
var mediaRec = null, chunks = [], premStream = null, recTimer = null, recSeg = 0;
function fmtSeg(s) { var m = Math.floor(s / 60), ss = s % 60; return (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss; }

async function urlTranscrever() {
  try { var d = await chrome.storage.local.get('conectores'); var v = d.conectores && d.conectores.urlTranscrever; return (v && String(v).trim()) || ENDPOINT_PADRAO; }
  catch (_) { return ENDPOINT_PADRAO; }
}
function blobParaBase64(blob) {
  return new Promise(function (res, rej) {
    var r = new FileReader();
    r.onload = function () { var s = String(r.result || ''); var i = s.indexOf(','); res(i >= 0 ? s.slice(i + 1) : s); };
    r.onerror = rej; r.readAsDataURL(blob);
  });
}

$('btnGravar').addEventListener('click', async function () {
  var st = $('statusPremium');
  try { premStream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
  catch (e) { status(st, 'Nao consegui o microfone. Faca o passo 1 (Liberar microfone) primeiro.', 'erro'); return; }
  chunks = [];
  try { mediaRec = new MediaRecorder(premStream, { mimeType: 'audio/webm' }); }
  catch (e) { try { mediaRec = new MediaRecorder(premStream); } catch (e2) { try { premStream.getTracks().forEach(function (t) { t.stop(); }); } catch (_) {} status(st, 'Este navegador nao grava audio (MediaRecorder).', 'erro'); return; } }
  mediaRec.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
  mediaRec.onstop = async function () {
    if (recTimer) { clearInterval(recTimer); recTimer = null; }
    $('btnGravar').classList.remove('gravando'); $('btnGravar').textContent = '⏺ Gravar';
    try { premStream.getTracks().forEach(function (t) { t.stop(); }); } catch (_) {}
    var blob = new Blob(chunks, { type: (mediaRec && mediaRec.mimeType) || 'audio/webm' });
    status(st, 'Transcrevendo na nuvem (Whisper) e refinando com IA... aguarde alguns segundos.', 'on');
    try {
      var b64 = await blobParaBase64(blob);
      var url = await urlTranscrever();
      var resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ audio: b64, idioma: 'pt', limpar: true }) });
      var d = await resp.json().catch(function () { return {}; });
      if (d && d.ok) {
        $('textoPremium').value = d.limpo || d.bruto || '';
        var det = (d.motor || '') + (d.limpou === false ? ' · limpeza: nao' : (d.limpou ? ' · limpeza: sim' : ''));
        status(st, '✓ Pronto!' + (det.trim() ? ' (' + det.trim() + ')' : '') + ' Confira e clique em Salvar na caixa de Recado.', 'ok');
      }
      else { status(st, 'Falhou: ' + ((d && (d.erro + (d.dica ? ' - ' + d.dica : ''))) || 'erro'), 'erro'); }
    } catch (e) { status(st, 'Erro de rede: ' + (e && e.message), 'erro'); }
    $('btnGravar').disabled = false; $('btnPararGravar').disabled = true;
  };
  mediaRec.start();
  $('btnGravar').disabled = true; $('btnPararGravar').disabled = false;
  $('btnGravar').classList.add('gravando'); $('btnGravar').textContent = '● Gravando';
  recSeg = 0;
  status(st, '⏺ GRAVANDO  00:00  — fale; depois clique em "Parar e transcrever".', 'on');
  if (recTimer) clearInterval(recTimer);
  recTimer = setInterval(function () { recSeg++; status(st, '⏺ GRAVANDO  ' + fmtSeg(recSeg) + '  — fale; depois clique em "Parar e transcrever".', 'on'); }, 1000);
});

$('btnPararGravar').addEventListener('click', function () {
  if (mediaRec && mediaRec.state !== 'inactive') mediaRec.stop();
});

$('btnSalvarPremium').addEventListener('click', async function () {
  var st = $('statusPremium'); var txt = ($('textoPremium').value || '').trim();
  if (!txt) { status(st, 'Nada pra salvar — grave algo primeiro.', 'erro'); return; }
  try { await chrome.storage.local.set({ recadoEva: txt }); status(st, '✓ Salvo na caixa de Recado! Abra o painel da extensao.', 'ok'); }
  catch (e) { status(st, 'Nao consegui salvar: ' + (e && e.message), 'erro'); }
});



// ---------- Enviar DIRETO pra EVA (fecha o loop sem voltar ao popup) ----------
var ENVIAR_PADRAO = 'https://eva-dla.pages.dev/enviar';
async function urlEnviarFn() {
  try { var d = await chrome.storage.local.get('conectores'); var v = d.conectores && d.conectores.urlEnviar; return (v && String(v).trim()) || ENVIAR_PADRAO; }
  catch (_) { return ENVIAR_PADRAO; }
}
async function enviarPraEva(texto, statusEl, origem) {
  texto = (texto || '').trim();
  if (!texto) { status(statusEl, 'Nada pra enviar — grave/dite algo primeiro.', 'erro'); return; }
  // anti-duplicado: mesmo conteudo em < 90s nao manda de novo
  var hh = hashMsg(texto);
  try {
    var d0 = await chrome.storage.local.get('ultimoEnvio');
    if (d0.ultimoEnvio && d0.ultimoEnvio.hash === hh && (Date.now() - d0.ultimoEnvio.ts) < 90000) {
      status(statusEl, '✓ Isso ja foi enviado agora (evitei mandar duplicado).', 'ok'); return;
    }
  } catch (_) {}
  status(statusEl, 'Enviando pra EVA...', 'on');
  try {
    var cod = await gerarCodigoMic();
    var url = await urlEnviarFn();
    var corpo = '=== CODIGO DA MENSAGEM: ' + cod.codigo + ' (#' + cod.seq + ') ===\n' +
      '=== RECADO DO MESTRE PRA EVA (voz) ===\n' + texto + '\n=== FIM ===\n';
    var r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ titulo: 'Transcricao do Mestre — Olho da EVA', texto: corpo }) });
    var d = await r.json().catch(function () { return {}; });
    if (r.ok && d && d.ok) {
      try { await chrome.storage.local.set({ ultimoEnvio: { hash: hh, ts: Date.now() } }); } catch (_) {}
      try { if (window.HistoricoEVA) await window.HistoricoEVA.registrar(texto, origem || 'microfone'); } catch (_) {}
      try { await chrome.storage.local.set({ recadoEva: texto }); } catch (_) {}
      status(statusEl, '✓ Enviado pra EVA (codigo ' + cod.codigo + ')! Va no chat e escreva RESPOSTA EVA.', 'ok');
    } else {
      status(statusEl, 'Nao consegui enviar (' + ((d && d.erro) || ('http_' + r.status)) + '). Use Salvar e mande pelo painel.', 'erro');
    }
  } catch (e) { status(statusEl, 'Erro de rede: ' + (e && e.message), 'erro'); }
}

function hashMsg(s) { s = String(s || ''); var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
async function gerarCodigoMic() {
  var seq = 0;
  try { var d = await chrome.storage.local.get('seqEnvio'); seq = (d.seqEnvio || 0) + 1; await chrome.storage.local.set({ seqEnvio: seq }); } catch (_) {}
  return { codigo: 'EVA-' + Math.random().toString(36).slice(2, 6).toUpperCase(), seq: seq };
}

if ($('btnEnviarDitado')) $('btnEnviarDitado').addEventListener('click', function () { enviarPraEva($('texto').value, $('statusDitar'), 'voz-ao-vivo'); });
if ($('btnEnviarPremium')) $('btnEnviarPremium').addEventListener('click', function () { enviarPraEva($('textoPremium').value, $('statusPremium'), 'voz-premium'); });
