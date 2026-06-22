// Olho da EVA - MOTOR (offscreen)
// CAMADA B: OCR (leitor de letras) com Tesseract.js EMPACOTADO LOCAL.
// Tudo dentro da extensao (Manifest V3 nao deixa carregar de CDN).
// CAMADA C-LOCAL: ainda nao empacotada (proxima rodada se necessario).
//
// Este arquivo roda em motor.html (offscreen), onde Tesseract.js esta
// disponivel como variavel global "Tesseract" (carregado via <script>).

let _ocrWorker = null;
let _ocrLang = '';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || msg.target !== 'offscreen' || msg.type !== 'MOTOR_PROCESSAR') return false;
  processar(msg).then((r) => sendResponse(r)).catch((e) => sendResponse({ ok: false, erro: String((e && e.message) || e) }));
  return true; // resposta assincrona
});

async function processar(msg) {
  const avisos = [];
  let ocrText = '';
  let caption = '';

  // ---------- CAMADA B: OCR ----------
  if (msg.fazerOCR) {
    try {
      ocrText = await rodarOCR(msg.cropDataUrl, msg.idiomaOCR || 'por+eng');
    } catch (e) {
      var em = String((e && e.message) || e);
      if (/importScripts|failed to load|wasm/i.test(em)) {
        em += ' | DICA: parece versao ANTIGA sem os arquivos do OCR. Reinstale a v1.2.1 (remover + apagar pasta velha + carregar de novo).';
      }
      avisos.push('OCR (Camada B) falhou: ' + em);
    }
  }

  // ---------- CAMADA C-LOCAL: indisponivel nesta versao ----------
  if (msg.fazerVLM) {
    avisos.push('Lente C-LOCAL (SmolVLM) indisponivel nesta versao - use a lente C-NUVEM (Cloudflare) que ja funciona muito bem.');
  }

  return { ok: true, ocrText, caption, avisos };
}

// ===================== CAMADA B: Tesseract LOCAL =====================
async function rodarOCR(dataUrl, lang) {
  if (!dataUrl) throw new Error('sem recorte de imagem');
  if (typeof Tesseract === 'undefined') throw new Error('Tesseract nao carregou (lib/tesseract/tesseract.min.js)');

  // caminhos locais (chrome-extension://...)
  const baseLib = chrome.runtime.getURL('lib/tesseract/');
  const opts = {
    workerPath: baseLib + 'worker.min.js',
    corePath: baseLib,           // pasta com tesseract-core(.wasm.js / .wasm)
    langPath: baseLib,           // pasta com {por,eng}.traineddata
    workerBlobURL: false,        // usa o worker direto da extensao (compativel com MV3)
    cacheMethod: 'none',         // nao tenta gravar IndexedDB cache (evita erro)
    gzip: false,                 // nossas .traineddata estao descompactadas
  };

  if (!_ocrWorker || _ocrLang !== lang) {
    if (_ocrWorker) { try { await _ocrWorker.terminate(); } catch (_) {} }
    _ocrWorker = await Tesseract.createWorker(lang, 1, opts);
    _ocrLang = lang;
  }

  const { data } = await _ocrWorker.recognize(dataUrl);
  const txt = (data && data.text ? data.text : '').replace(/\n{3,}/g, '\n\n').trim();
  return txt;
}
