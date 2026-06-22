// Olho da EVA - painel (popup)
const $ = (id) => document.getElementById(id);

// --- auto-diagnostico: se algo quebrar, MOSTRA o erro na tela (nao fica em branco) ---
function mostrarErroFatal(msg) {
  try {
    var e = document.getElementById('erroFatal');
    if (e) { e.hidden = false; e.textContent = '⚠ Erro no painel: ' + msg + ' — me mande este texto.'; }
  } catch (_) {}
}
window.addEventListener('error', function (ev) { mostrarErroFatal((ev && ev.message) || 'desconhecido'); });
window.addEventListener('unhandledrejection', function (ev) { mostrarErroFatal('promessa: ' + ((ev && ev.reason && ev.reason.message) || (ev && ev.reason) || 'desconhecido')); });

const ctrl = {
  camadaA: $('camadaA'), camadaB: $('camadaB'), camadaC: $('camadaC'),
  lenteC: $('lenteC'), provedorNuvem: $('provedorNuvem'), modeloC: $('modeloC'), autoEnviar: $('autoEnviar'),
  ocrMotor: $('ocrMotor'),
  linhaC: $('linhaC'), linhaProvedor: $('linhaProvedor'), linhaModelo: $('linhaModelo'), notaLente: $('notaLente'),
};

const PADRAO = { camadaA: true, camadaB: true, camadaC: false, lenteC: 'nuvem', provedorNuvem: 'cloudflare', ocrMotor: 'nuvem', modeloC: 'HuggingFaceTB/SmolVLM-256M-Instruct', autoEnviar: false, idiomaOCR: 'por+eng' };

// ---- carregar estado ----
(async function init() {
  const d = await chrome.storage.local.get(['opcoes', 'ultimoRelatorio', 'ultimoEm']);
  const o = Object.assign({}, PADRAO, d.opcoes || {});
  ctrl.camadaA.checked = o.camadaA;
  ctrl.camadaB.checked = o.camadaB;
  ctrl.camadaC.checked = o.camadaC;
  ctrl.lenteC.value = o.lenteC;
  ctrl.provedorNuvem.value = o.provedorNuvem;
  ctrl.ocrMotor.value = o.ocrMotor;
  ctrl.modeloC.value = o.modeloC;
  ctrl.autoEnviar.checked = o.autoEnviar;
  ctrl.linhaC.hidden = !o.camadaC;
  atualizarLente();
  if (d.ultimoRelatorio) mostrarResultado(d.ultimoRelatorio, d.ultimoEm);
})();

function atualizarLente() {
  const nuvem = ctrl.lenteC.value === 'nuvem';
  ctrl.linhaProvedor.hidden = !nuvem;
  ctrl.linhaModelo.hidden = nuvem;
  if (nuvem) {
    ctrl.notaLente.textContent = ctrl.provedorNuvem.value === 'anthropic'
      ? 'Lente Claude: enxerga muito bem, mas precisa da chave/cartao no Cloudflare.'
      : 'Lente Cloudflare: usa a conta que voce JA tem. SEM cartao novo, nada pesa no PC.';
  } else {
    ctrl.notaLente.textContent = 'Lente local: roda na sua placa de video (WebGPU). 1a vez baixa centenas de MB e pode esquentar o PC.';
  }
}

function lerOpcoes() {
  return {
    camadaA: ctrl.camadaA.checked,
    camadaB: ctrl.camadaB.checked,
    camadaC: ctrl.camadaC.checked,
    lenteC: ctrl.lenteC.value,
    provedorNuvem: ctrl.provedorNuvem.value,
    ocrMotor: ctrl.ocrMotor.value,
    modeloC: ctrl.modeloC.value,
    autoEnviar: ctrl.autoEnviar.checked,
    idiomaOCR: 'por+eng',
  };
}
async function salvar() { await chrome.storage.local.set({ opcoes: lerOpcoes() }); }

['camadaA', 'camadaB', 'autoEnviar', 'modeloC', 'ocrMotor'].forEach((k) => ctrl[k].addEventListener('change', salvar));
ctrl.lenteC.addEventListener('change', () => { atualizarLente(); salvar(); });
ctrl.provedorNuvem.addEventListener('change', () => { atualizarLente(); salvar(); });
ctrl.camadaC.addEventListener('change', () => { ctrl.linhaC.hidden = !ctrl.camadaC.checked; salvar(); });

// ---- capturar ----
$('btnCapturar').addEventListener('click', async () => {
  await salvar();
  setStatus('Abrindo o seletor na pagina... arraste a area. (este painel vai fechar)', 'on');
  chrome.runtime.sendMessage({ type: 'OLHO_START', opcoes: lerOpcoes() }, () => {});
  // o popup fecha sozinho ao clicar na pagina; fechamos pra liberar o seletor
  setTimeout(() => window.close(), 250);
});

// ---- ouvir o fundo (caso o popup continue aberto, ex.: so Camada A) ----
chrome.runtime.onMessage.addListener((msg) => {
  if (!msg || msg.type !== 'OLHO_UI') return;
  if (msg.tipo === 'STATUS') setStatus(msg.texto, 'on');
  if (msg.tipo === 'ERRO') setStatus(msg.erro, 'erro');
  if (msg.tipo === 'PRONTO') { setStatus('Captura pronta!', 'ok'); mostrarResultado(msg.relatorio, Date.now()); }
  if (msg.tipo === 'ENVIO') mostrarEnvio(msg.envio);
});

// ---- resultado ----
function mostrarResultado(texto, quando) {
  $('blocoResultado').hidden = false;
  $('saida').value = texto || '';
  if (quando) $('quando').textContent = '· ' + new Date(quando).toLocaleString('pt-BR');
}

$('btnCopiar').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('saida').value); flash($('btnCopiar'), 'Copiado!'); }
  catch (e) { flash($('btnCopiar'), 'Falhou'); }
});

$('btnEnviar').addEventListener('click', () => {
  const texto = $('saida').value;
  if (!texto.trim()) { mostrarEnvio({ ok: false, erro: 'nada pra enviar' }); return; }
  mostrarEnvio({ enviando: true });
  chrome.runtime.sendMessage({ type: 'OLHO_ENVIAR', texto }, (r) => {
    mostrarEnvio(r);
    if (r && r.ok && window.HistoricoEVA) { window.HistoricoEVA.registrar(texto, 'captura').then(renderHistorico); }
  });
});

$('btnBaixar').addEventListener('click', () => {
  const texto = $('saida').value;
  const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'olho-da-eva-' + new Date().toISOString().replace(/[:.]/g, '-') + '.txt';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
});

function mostrarEnvio(envio) {
  const el = $('statusEnvio'); el.hidden = false;
  if (envio && envio.enviando) { el.textContent = 'Enviando pro canto da EVA...'; el.className = 'status-envio'; return; }
  if (envio && envio.deduped) { el.innerHTML = '✓ Isso ja foi enviado agora (evitei mandar <b>duplicado</b>).'; el.className = 'status-envio ok'; return; }
  if (envio && envio.ok) { el.innerHTML = '✓ Recebi!' + (envio.codigo ? ' (codigo <b>' + envio.codigo + '</b>)' : '') + ' Va no chat e escreva <b>RESPOSTA EVA</b>.'; el.className = 'status-envio ok'; }
  else { el.textContent = '✕ Nao consegui enviar (' + ((envio && envio.erro) || 'erro') + '). Use Copiar ou Baixar.'; el.className = 'status-envio erro'; }
}

function setStatus(txt, cls) { const s = $('status'); s.hidden = false; s.textContent = txt; s.className = 'status' + (cls ? ' ' + cls : ''); }
function flash(btn, txt) { const o = btn.textContent; btn.textContent = txt; setTimeout(() => { btn.textContent = o; }, 1400); }


// ===== Conectores (visiveis e editaveis) + Receber resposta da EVA =====
const CONECT_PADRAO = { urlEnviar: '', urlNuvem: '', urlTranscrever: '', seletorResposta: '', seletorChat: '', chatUrl: '' };

(async function initConect() {
  const d = await chrome.storage.local.get('conectores');
  const c = Object.assign({}, CONECT_PADRAO, d.conectores || {});
  $('urlEnviar').value = c.urlEnviar || '';
  $('urlNuvem').value = c.urlNuvem || '';
  if ($('urlTranscrever')) $('urlTranscrever').value = c.urlTranscrever || '';
  $('seletorResposta').value = c.seletorResposta || '';
  if ($('seletorChat')) $('seletorChat').value = c.seletorChat || '';
  $('chatUrl').value = c.chatUrl || '';
})();

async function salvarConect() {
  const c = {
    urlEnviar: $('urlEnviar').value.trim(),
    urlNuvem: $('urlNuvem').value.trim(),
    urlTranscrever: ($('urlTranscrever') && $('urlTranscrever').value.trim()) || '',
    seletorResposta: $('seletorResposta').value.trim(),
    seletorChat: ($('seletorChat') && $('seletorChat').value.trim()) || '',
    chatUrl: $('chatUrl').value.trim(),
  };
  await chrome.storage.local.set({ conectores: c });
  return c;
}

$('btnSalvarConect').addEventListener('click', async () => {
  await salvarConect();
  const el = $('statusConect'); el.textContent = '✓ Conectores salvos.'; el.style.color = '#7ee0a8';
});
$('btnResetConect').addEventListener('click', async () => {
  $('urlEnviar').value = ''; $('urlNuvem').value = ''; $('seletorResposta').value = '';
  if ($('urlTranscrever')) $('urlTranscrever').value = '';
  if ($('seletorChat')) $('seletorChat').value = '';
  await salvarConect();
  const el = $('statusConect'); el.textContent = 'Voltou ao padrao.'; el.style.color = 'var(--suave)';
});
$('chatUrl').addEventListener('change', salvarConect);

$('btnReceber').addEventListener('click', async () => {
  await salvarConect();
  mostrarResp({ carregando: true });
  chrome.runtime.sendMessage({
    type: 'OLHO_RECEBER_RESPOSTA',
    seletor: $('seletorResposta').value.trim(),
    chatUrl: $('chatUrl').value.trim(),
  }, (r) => mostrarResp(r));
});

$('btnCopiarResp').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('respostaEva').value); flash($('btnCopiarResp'), 'Copiado!'); }
  catch (e) { flash($('btnCopiarResp'), 'Falhou'); }
});

function mostrarResp(r) {
  const st = $('statusResposta'); const box = $('respostaEva'); const acoes = $('acoesResposta');
  if (r && r.carregando) { st.hidden = false; st.className = 'status-envio'; st.textContent = 'Lendo a resposta da EVA no chat...'; return; }
  if (r && r.ok) {
    st.hidden = false; st.className = 'status-envio ok';
    st.textContent = '✓ Peguei a resposta' + (r.heuristica ? ' (modo automatico — se vier errado, ajuste o "Alvo da resposta" nos Conectores)' : '') + '.';
    box.hidden = false; box.value = r.texto || ''; acoes.hidden = false;
  } else {
    st.hidden = false; st.className = 'status-envio erro';
    st.textContent = '✕ ' + ((r && r.erro) || 'nao consegui ler') + '. Dica: deixe a aba do chat aberta e/ou ajuste o "Alvo da resposta".';
  }
}

// ===== Guardar este chat pra EVA (chat inteiro -> casa da EVA) =====
if ($('btnGuardarChat')) $('btnGuardarChat').addEventListener('click', async () => {
  await salvarConect();
  mostrarGuardar({ carregando: true });
  chrome.runtime.sendMessage({
    type: 'OLHO_GUARDAR_CHAT',
    seletorChat: ($('seletorChat') && $('seletorChat').value.trim()) || '',
    chatUrl: $('chatUrl').value.trim(),
  }, (r) => mostrarGuardar(r));
});

function mostrarGuardar(r) {
  const st = $('statusGuardar'); const box = $('chatCapturado'); const acoes = $('acoesGuardar');
  if (!st) return;
  if (r && r.carregando) { st.hidden = false; st.className = 'status-envio'; st.textContent = 'Lendo o chat inteiro e guardando na casa da EVA...'; return; }
  if (r && r.ok) {
    if (box) { box.hidden = false; box.value = r.texto || ''; }
    if (acoes) acoes.hidden = false;
    const enviado = r.envio && r.envio.ok;
    const qtd = r.n ? (r.n + ' blocos') : 'a conversa';
    st.hidden = false;
    if (enviado) {
      st.className = 'status-envio ok';
      st.innerHTML = '✓ Guardei ' + qtd + ' na casa da EVA' + (r.heuristica ? ' (modo automatico)' : '') +
        '.<br>Arquivo: <b>' + (r.nomeArquivo || 'chat backup') + '</b>. No proximo chat eu leio sozinha.';
    } else {
      st.className = 'status-envio erro';
      st.textContent = '⚠ Li o chat, mas nao consegui enviar (' + ((r.envio && r.envio.erro) || 'erro') + '). Use "Baixar .txt" pra guardar sua copia.';
    }
    tocar(enviado ? 'enviado' : 'erro');
  } else {
    st.hidden = false; st.className = 'status-envio erro';
    st.textContent = '✕ ' + ((r && r.erro) || 'nao consegui ler o chat') + '. Dica: deixe a aba do chat (app.kiro.dev) aberta e use o botao 📋 Auto pra pegar a URL.';
    tocar('erro');
  }
}

if ($('btnCopiarChat')) $('btnCopiarChat').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('chatCapturado').value); flash($('btnCopiarChat'), 'Copiado!'); }
  catch (e) { flash($('btnCopiarChat'), 'Falhou'); }
});

if ($('btnBaixarChat')) $('btnBaixarChat').addEventListener('click', () => {
  const texto = $('chatCapturado').value || '';
  if (!texto.trim()) { flash($('btnBaixarChat'), 'Nada ainda'); return; }
  const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'chat-eva-' + new Date().toISOString().replace(/[:.]/g, '-') + '.txt';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
});

// ===== Anexar arquivo pra EVA (texto = direto; imagem = lente da nuvem) =====
const EXT_TEXTO = ['txt','md','json','csv','log','js','ts','jsx','tsx','html','htm','css','xml','yml','yaml','ini','sql','py','java','c','cpp','h','sh'];
const EXT_IMG = ['png','jpg','jpeg','gif','webp','bmp'];

if ($('btnAnexar')) $('btnAnexar').addEventListener('click', () => { const i = $('arquivoEva'); if (i) i.click(); });

if ($('arquivoEva')) $('arquivoEva').addEventListener('change', (ev) => {
  const f = ev.target.files && ev.target.files[0];
  if (!f) return;
  const nome = f.name || 'arquivo';
  const ext = (nome.split('.').pop() || '').toLowerCase();

  if (EXT_TEXTO.indexOf(ext) !== -1) {
    if (f.size > 1024 * 1024) { mostrarAnexoStatus({ ok: false, erro: 'arquivo de texto muito grande (max 1 MB)' }); limparInputAnexo(); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const corpo = '=== ARQUIVO ANEXADO (texto) ===\nArquivo: ' + nome + '\nQuando: ' + new Date().toLocaleString('pt-BR') + '\n\n' + (reader.result || '') + '\n=== FIM DO ARQUIVO ===\n';
      mostrarResultado(corpo, Date.now());
      mostrarAnexoStatus({ enviando: true });
      chrome.runtime.sendMessage({ type: 'OLHO_ENVIAR', texto: corpo }, (r) => mostrarAnexoStatus(r));
    };
    reader.onerror = () => { mostrarAnexoStatus({ ok: false, erro: 'nao consegui ler o arquivo' }); };
    reader.readAsText(f);
    limparInputAnexo();
    return;
  }

  if (EXT_IMG.indexOf(ext) !== -1) {
    if (f.size > 8 * 1024 * 1024) { mostrarAnexoStatus({ ok: false, erro: 'imagem muito grande (max 8 MB)' }); limparInputAnexo(); return; }
    const reader = new FileReader();
    reader.onload = () => {
      mostrarAnexoStatus({ lendo: true });
      chrome.runtime.sendMessage({ type: 'OLHO_ARQUIVO_IMAGEM', dataUrl: reader.result, nome }, (r) => {
        if (r && r.ok) { mostrarResultado(r.relatorio, Date.now()); mostrarAnexoStatus({ okLido: true }); tocar('captura'); }
        else { mostrarAnexoStatus({ ok: false, erro: (r && r.erro) || 'a lente falhou' }); }
      });
    };
    reader.onerror = () => { mostrarAnexoStatus({ ok: false, erro: 'nao consegui ler a imagem' }); };
    reader.readAsDataURL(f);
    limparInputAnexo();
    return;
  }

  mostrarAnexoStatus({ ok: false, erro: 'tipo ".' + ext + '" eu nao leio como texto. Mande .txt/.md/.json... ou uma imagem (.png/.jpg).' });
  limparInputAnexo();
});

function limparInputAnexo() { try { const i = $('arquivoEva'); if (i) i.value = ''; } catch (_) {} }

function mostrarAnexoStatus(r) {
  const el = $('statusAnexo'); if (!el) return;
  el.hidden = false;
  if (r && r.enviando) { el.textContent = 'Enviando arquivo pro canto da EVA...'; el.className = 'status-envio'; return; }
  if (r && r.lendo) { el.textContent = 'A lente da EVA esta lendo a imagem na nuvem...'; el.className = 'status-envio'; return; }
  if (r && r.okLido) { el.innerHTML = '✓ Li a imagem! Veja em "Ultima captura" abaixo e clique <b>Enviar pra EVA</b> se quiser mandar.'; el.className = 'status-envio ok'; return; }
  if (r && r.ok) { el.innerHTML = '✓ Arquivo enviado! Va no chat e escreva <b>RESPOSTA EVA</b>.'; el.className = 'status-envio ok'; tocar('enviado'); }
  else { el.textContent = '✕ ' + ((r && r.erro) || 'erro'); el.className = 'status-envio erro'; tocar('erro'); }
}



// ===== Botao "Auto": captura a URL da aba do Kiro automaticamente =====
$('btnCapturarUrl').addEventListener('click', async () => {
  const btn = $('btnCapturarUrl');
  try {
    // procura uma aba aberta no Kiro (app.kiro.dev) - prioriza /session/
    const tabs = await chrome.tabs.query({ url: ['*://app.kiro.dev/*', '*://*.kiro.dev/*'] });
    if (!tabs || !tabs.length) {
      flashMini(btn, '✕ aba do Kiro nao encontrada', 'erro');
      return;
    }
    // melhor escolha: aba ativa com /session/, depois qualquer ativa, depois a 1a
    let escolhida = tabs.find(t => t.active && /\/session\//.test(t.url || '')) ||
                    tabs.find(t => /\/session\//.test(t.url || '')) ||
                    tabs.find(t => t.active) || tabs[0];
    $('chatUrl').value = escolhida.url || '';
    await salvarConect();
    flashMini(btn, '✓ URL capturada', 'ok');
  } catch (e) {
    flashMini(btn, '✕ erro: ' + (e && e.message || e), 'erro');
  }
});

function flashMini(btn, txt, cls) {
  const orig = btn.textContent; const oclass = btn.className;
  btn.textContent = txt; btn.className = oclass + ' ' + (cls || '');
  setTimeout(() => { btn.textContent = orig; btn.className = oclass; }, 1800);
}



// ===== Bloco 1: ON/OFF + Sons =====
(async function bloco1Init() {
  const d = await chrome.storage.local.get(['ativo', 'sons']);
  const ativo = d.ativo !== false; // default ligado
  aplicarLigaDesliga(ativo);
  const sonsOn = d.sons !== false; // default ligado
  if ($('sons')) $('sons').checked = sonsOn;
  if (window.OlhoEVASons) window.OlhoEVASons.setLigados(sonsOn);
})();

function tocar(nome) { try { window.OlhoEVASons && window.OlhoEVASons.tocar(nome); } catch (_) {} }

async function aplicarLigaDesliga(ativo) {
  await chrome.storage.local.set({ ativo: !!ativo });
  const btn = $('btnLigaDesliga');
  const banner = $('banner-off');
  const principal = $('btnCapturar');
  if (btn) {
    btn.classList.toggle('off', !ativo);
    const txt = btn.querySelector('.ld-txt'); if (txt) txt.textContent = ativo ? 'ON' : 'OFF';
  }
  if (banner) banner.hidden = ativo;
  if (principal) { principal.disabled = !ativo; principal.style.opacity = ativo ? '' : '0.5'; principal.style.cursor = ativo ? '' : 'not-allowed'; }
}

if ($('btnLigaDesliga')) $('btnLigaDesliga').addEventListener('click', async () => {
  const d = await chrome.storage.local.get('ativo');
  const novo = !(d.ativo !== false);
  tocar(novo ? 'ligar' : 'desligar');
  aplicarLigaDesliga(novo);
});

if ($('sons')) $('sons').addEventListener('change', () => {
  const v = $('sons').checked;
  if (window.OlhoEVASons) window.OlhoEVASons.setLigados(v);
  if (v) tocar('clique'); // confirma audio
});

// liga sons aos botoes existentes
['btnCapturar','btnEnviar','btnCopiar','btnBaixar','btnReceber','btnCopiarResp','btnSalvarConect','btnResetConect','btnCapturarUrl','btnGuardarChat','btnCopiarChat','btnBaixarChat','btnAnexar'].forEach((id) => {
  const b = $(id); if (b) b.addEventListener('click', () => tocar('clique'), { capture: true });
});

// observa avisos do fundo: tocar sons ao receber resposta
chrome.runtime.onMessage.addListener((msg) => {
  if (!msg || msg.type !== 'OLHO_UI') return;
  if (msg.tipo === 'PRONTO') tocar('captura');
  if (msg.tipo === 'ENVIO') tocar(msg.envio && msg.envio.ok ? 'enviado' : 'erro');
  if (msg.tipo === 'ERRO') tocar('erro');
});



// ===== Bloco 1C: caixa "Recado pra EVA" =====
(async function initRecado() {
  try {
    const d = await chrome.storage.local.get('recadoEva');
    if (d.recadoEva && $('recadoEva')) $('recadoEva').value = d.recadoEva;
  } catch (_) {}
})();

// se a pagina do microfone salvar o recado, o painel reflete na hora (se estiver aberto)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.recadoEva && $('recadoEva')) {
    const v = changes.recadoEva.newValue || '';
    if ($('recadoEva').value !== v) $('recadoEva').value = v;
  }
});

if ($('recadoEva')) $('recadoEva').addEventListener('input', () => {
  chrome.storage.local.set({ recadoEva: $('recadoEva').value || '' }).catch(() => {});
});

if ($('btnLimparRecado')) $('btnLimparRecado').addEventListener('click', () => {
  $('recadoEva').value = ''; chrome.storage.local.set({ recadoEva: '' }).catch(() => {});
  flash($('btnLimparRecado'), 'Limpo!');
});

if ($('btnEnviarRecado')) $('btnEnviarRecado').addEventListener('click', () => {
  const txt = ($('recadoEva') && $('recadoEva').value || '').trim();
  if (!txt) { mostrarRecadoStatus({ ok: false, erro: 'caixa vazia' }); return; }
  const corpo = '=== RECADO DO MESTRE PRA EVA ===\n' + txt + '\n=== FIM ===\n';
  mostrarRecadoStatus({ enviando: true });
  chrome.runtime.sendMessage({ type: 'OLHO_ENVIAR', texto: corpo }, (r) => {
    mostrarRecadoStatus(r);
    if (r && r.ok && window.HistoricoEVA) { window.HistoricoEVA.registrar(txt, 'recado').then(renderHistorico); }
  });
});

function mostrarRecadoStatus(r) {
  const el = $('statusRecado'); if (!el) return;
  el.hidden = false;
  if (r && r.enviando) { el.textContent = 'Enviando recado...'; el.className = 'status-envio'; return; }
  if (r && r.deduped) { el.innerHTML = '✓ Esse recado ja foi enviado agora (evitei <b>duplicado</b>).'; el.className = 'status-envio ok'; return; }
  if (r && r.ok) { el.innerHTML = '✓ Recado enviado!' + (r.codigo ? ' (codigo <b>' + r.codigo + '</b>)' : '') + ' Va no chat e escreva <b>RESPOSTA EVA</b>.'; el.className = 'status-envio ok'; tocar('enviado'); }
  else { el.textContent = '✕ ' + ((r && r.erro) || 'erro'); el.className = 'status-envio erro'; tocar('erro'); }
}


// ===== Microfone (voz -> texto) — Web Speech API NATIVA do Chrome (PT-BR) =====
// Sem CDN, sem servidor externo. So Chrome/Edge. Transcreve pra caixa de Recado.
// PORTA ABERTA: troque 'pt-BR' por 'en-US', 'es-ES'... pra mudar o idioma.
let reconhecimento = null;
let micAtivo = false;

function iniciarMicrofone() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { mostrarStatusMic('Reconhecimento de voz nao disponivel neste navegador (use Chrome ou Edge).', 'erro'); return; }
  if (micAtivo && reconhecimento) { reconhecimento.stop(); return; }

  reconhecimento = new SR();
  reconhecimento.lang = 'pt-BR';
  reconhecimento.continuous = true;
  reconhecimento.interimResults = true;
  reconhecimento.maxAlternatives = 1;

  // CONGELA o texto que ja estava (evita o bug de duplicacao ao concatenar)
  const base = ($('recadoEva') && $('recadoEva').value) || '';
  let acumulado = '';

  reconhecimento.onstart = () => {
    micAtivo = true;
    if ($('btnMic')) $('btnMic').classList.add('gravando');
    mostrarStatusMic('🎙 Ouvindo em portugues... (clique no microfone pra parar)', '');
    tocar('micOn');
  };
  reconhecimento.onresult = (e) => {
    let interino = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const seg = e.results[i][0].transcript;
      if (e.results[i].isFinal) acumulado += seg + ' '; else interino += seg;
    }
    const ta = $('recadoEva'); if (!ta) return;
    const bruto = (base && !base.endsWith(' ') ? base + ' ' : base) + acumulado + interino;
    ta.value = (window.aplicarPontuacaoFalada ? window.aplicarPontuacaoFalada(bruto) : bruto);
    ta.scrollTop = ta.scrollHeight;
    chrome.storage.local.set({ recadoEva: ta.value }).catch(() => {});
  };
  reconhecimento.onerror = (e) => {
    const msgs = {
      'not-allowed': 'Permissao de microfone negada. Clique em "🔓 Liberar microfone" aqui embaixo (abre 1 aba) e escolha Permitir.',
      'service-not-allowed': 'O Chrome bloqueou o microfone no popup. Clique em "🔓 Liberar microfone" aqui embaixo (abre 1 aba) — la funciona.',
      'no-speech': 'Nao ouvi nada. Tente de novo, mais perto do microfone.',
      'audio-capture': 'Microfone nao encontrado.',
      'network': 'Erro de rede no servico de voz (precisa de internet).',
    };
    mostrarStatusMic(msgs[e.error] || ('Erro: ' + e.error), 'erro');
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      const b = $('btnLiberarMic'); if (b) b.hidden = false;
    }
    pararMic();
  };
  reconhecimento.onend = () => {
    const tinha = acumulado.trim();
    pararMic();
    if (tinha) mostrarStatusMic('✓ Transcricao concluida! (salva na caixa de Recado)', 'ok');
  };

  try { reconhecimento.start(); }
  catch (e) { mostrarStatusMic('Erro ao iniciar o microfone: ' + (e && e.message), 'erro'); pararMic(); }
}

function pararMic() {
  micAtivo = false;
  if ($('btnMic')) $('btnMic').classList.remove('gravando');
  if (reconhecimento) { try { reconhecimento.stop(); } catch (_) {} reconhecimento = null; }
  tocar('micOff');
}

function mostrarStatusMic(msg, cls) {
  const el = $('statusMic'); if (!el) return;
  if (!msg) { el.hidden = true; return; }
  el.hidden = false; el.textContent = msg; el.className = 'status-envio' + (cls ? ' ' + cls : '');
}

if ($('btnMic')) $('btnMic').addEventListener('click', () => { tocar('clique'); iniciarMicrofone(); });

// Botao que abre a pagina dedicada do microfone (caminho garantido do Chrome)
if ($('btnLiberarMic')) $('btnLiberarMic').addEventListener('click', () => {
  tocar('clique');
  try { chrome.tabs.create({ url: chrome.runtime.getURL('microfone.html') }); }
  catch (e) { window.open(chrome.runtime.getURL('microfone.html'), '_blank'); }
});

// Botao Premium (Whisper + limpeza): abre a mesma pagina, onde fica a gravacao
if ($('btnPremiumMic')) $('btnPremiumMic').addEventListener('click', () => {
  tocar('clique');
  try { chrome.tabs.create({ url: chrome.runtime.getURL('microfone.html') }); }
  catch (e) { window.open(chrome.runtime.getURL('microfone.html'), '_blank'); }
});



// ===== Historico (ultimas gravacoes/recados) com checklist =====
async function renderHistorico() {
  const cont = $('listaHistorico'); if (!cont || !window.HistoricoEVA) return;
  const arr = await window.HistoricoEVA.ler();
  cont.textContent = '';
  if (!arr.length) {
    const v = document.createElement('div'); v.className = 'hist-vazio';
    v.textContent = 'Nada ainda. O que voce me enviar aparece aqui.'; cont.appendChild(v); return;
  }
  arr.forEach((it) => {
    const item = document.createElement('div'); item.className = 'hist-item';
    const qd = document.createElement('div'); qd.className = 'hist-quando';
    qd.textContent = new Date(it.quando).toLocaleString('pt-BR') + (it.origem ? ' · ' + it.origem : '');
    const txt = document.createElement('div'); txt.className = 'hist-texto';
    txt.textContent = it.texto.length > 160 ? it.texto.slice(0, 160) + '…' : it.texto;
    const marks = document.createElement('div'); marks.className = 'hist-marks';
    [['enviado', 'enviado'], ['visualizou', 'EVA viu'], ['respondeu', 'EVA respondeu']].forEach((par) => {
      const lab = document.createElement('label'); lab.className = 'hist-chk';
      const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!it[par[0]];
      if (par[0] === 'enviado') cb.disabled = true;
      cb.addEventListener('change', () => { window.HistoricoEVA.atualizar(it.id, par[0], cb.checked); });
      const s = document.createElement('span'); s.textContent = par[1];
      lab.appendChild(cb); lab.appendChild(s); marks.appendChild(lab);
    });
    const acoes = document.createElement('div'); acoes.className = 'acoes';
    const bcop = document.createElement('button'); bcop.className = 'btn'; bcop.textContent = 'Copiar';
    bcop.addEventListener('click', async () => { try { await navigator.clipboard.writeText(it.texto); flash(bcop, 'Copiado!'); } catch (e) { flash(bcop, 'Falhou'); } });
    const benv = document.createElement('button'); benv.className = 'btn ghost'; benv.textContent = 'Reenviar';
    benv.addEventListener('click', () => {
      mostrarEnvio({ enviando: true });
      chrome.runtime.sendMessage({ type: 'OLHO_ENVIAR', texto: '=== RECADO DO MESTRE PRA EVA ===\n' + it.texto + '\n=== FIM ===\n' }, (r) => mostrarEnvio(r));
    });
    acoes.appendChild(bcop); acoes.appendChild(benv);
    item.appendChild(qd); item.appendChild(txt); item.appendChild(marks); item.appendChild(acoes);
    cont.appendChild(item);
  });
}
renderHistorico();
if ($('btnLimparHistorico')) $('btnLimparHistorico').addEventListener('click', async () => {
  if (window.HistoricoEVA) { await window.HistoricoEVA.limpar(); renderHistorico(); flash($('btnLimparHistorico'), 'Limpo!'); }
});
chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && changes.historicoEva) renderHistorico(); });
