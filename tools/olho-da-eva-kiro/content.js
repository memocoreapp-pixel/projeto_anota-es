// Olho da EVA - seletor na pagina + CAMADA A (esqueleto: DOM + acessibilidade)
// FLUXO EM 2 PASSOS:
//   PASSO 1 (selecionar): arraste para marcar a area que quero que a EVA enxergue.
//   PASSO 2 (anotar): marque com o pincel verde / retangulo / texto, escreva um
//   recado, e clique "Capturar e mandar pra EVA". So entao a captura acontece.
(function () {
  if (window.__OLHO_EVA_ATIVO) return;
  window.__OLHO_EVA_ATIVO = true;

  var dpr = window.devicePixelRatio || 1;
  var opcoes = { camadaA: true, camadaB: true, camadaC: false };
  var enviado = false; // trava anti-duplo-envio (reinicia a cada captura)
  var fase = 'selecionar'; // 'selecionar' | 'anotar'
  var rectSel = null;      // area escolhida no passo 1

  // ---------- ferramentas de anotacao (pincel verde fluo, retangulo, texto) ----------
  var canvas = document.createElement('canvas');
  canvas.className = 'olho-eva-canvas';
  var cctx = null;
  var ferramenta = 'pincel'; // 'nenhuma' | 'pincel' | 'retangulo' | 'texto'
  var desenhando = false; var pa = null;
  var caixaRetangulo = null;
  var corPincel = '#39ff14'; // verde fluo
  var tamanhoPincel = 6; // medio

  var overlay = document.createElement('div');
  overlay.className = 'olho-eva-overlay';
  var dica = document.createElement('div');
  dica.className = 'olho-eva-dica';
  dica.innerHTML = '<span class="olho-eva-mini"></span><span id="olhoDicaTxt">Arraste para marcar a area que quero que eu <b>enxergue</b>  •  ESC cancela</span>';
  var caixa = document.createElement('div');
  caixa.className = 'olho-eva-caixa'; caixa.style.display = 'none';
  var dim = document.createElement('div');
  dim.className = 'olho-eva-dim'; dim.style.display = 'none';

  // barra de ferramentas (aparece SO no passo 2)
  var ferr = document.createElement('div');
  ferr.className = 'olho-eva-ferr'; ferr.style.display = 'none';
  ferr.innerHTML =
    '<button data-f="pincel" class="ativa" title="Pincel verde fluo (rabiscar)">✏️</button>' +
    '<button data-f="retangulo" title="Retangulo">▭</button>' +
    '<button data-f="texto" title="Escrever texto">A</button>' +
    '<button data-f="apagar" title="Apagar marcacoes">🧽</button>' +
    '<span class="sep"></span>' +
    '<span class="tam-rot">Tamanho:</span>' +
    '<button data-tam="3" class="tam" title="Fino">•</button>' +
    '<button data-tam="6" class="tam ativa" title="Medio">●</button>' +
    '<button data-tam="12" class="tam" title="Grosso">⬤</button>';

  // painel de confirmacao (recado + botoes) - aparece SO no passo 2
  var painel = document.createElement('div');
  painel.className = 'olho-eva-painel'; painel.style.display = 'none';
  painel.innerHTML =
    '<div class="olho-eva-painel-ttl">📝 O que quer que eu enxergue/enfatize aqui?</div>' +
    '<textarea class="olho-eva-recado" rows="3" placeholder="Escreva um recado pra EVA (opcional): o que destacar, sua duvida, o que relatar..."></textarea>' +
    '<div class="olho-eva-painel-bts">' +
    '  <button class="olho-eva-ok">📸 Capturar e mandar pra EVA</button>' +
    '  <button class="olho-eva-refazer">↺ Refazer selecao</button>' +
    '  <button class="olho-eva-cancelar">Cancelar</button>' +
    '</div>';

  function montar() {
    document.documentElement.appendChild(overlay);
    document.documentElement.appendChild(dica);
    // canvas pra desenho ocupa a tela toda
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:2147483646;pointer-events:none';
    document.documentElement.appendChild(canvas);
    cctx = canvas.getContext('2d');
    cctx.scale(dpr, dpr); // desenhar em coordenadas de tela (CSS px)
    document.documentElement.appendChild(caixa);
    document.documentElement.appendChild(dim);
    document.documentElement.appendChild(ferr);
    document.documentElement.appendChild(painel);
    setupFerramentas();
    setupPainel();
    iniciarSelecao();
  }
  function destruir() {
    [overlay, dica, ferr, canvas, caixa, dim, painel].forEach(function (n) { if (n && n.parentNode) n.parentNode.removeChild(n); });
    window.removeEventListener('keydown', onKey, true);
    window.__OLHO_EVA_ATIVO = false;
  }
  function onKey(e) { if (e.key === 'Escape') { e.preventDefault(); destruir(); } }
  window.addEventListener('keydown', onKey, true);

  function setDica(html) { var s = document.getElementById('olhoDicaTxt'); if (s) s.innerHTML = html; }

  // ---------- PASSO 1: selecionar a area ----------
  function iniciarSelecao() {
    fase = 'selecionar';
    overlay.style.display = 'block';
    overlay.style.pointerEvents = 'auto';
    ferr.style.display = 'none';
    painel.style.display = 'none';
    caixa.style.display = 'none';
    dim.style.display = 'none';
    canvas.style.pointerEvents = 'none';
    if (cctx) cctx.clearRect(0, 0, canvas.width, canvas.height);
    setDica('Passo 1 de 2: <b>arraste</b> para marcar a area que quero que eu enxergue  •  ESC cancela');
  }

  var ativo = false, ix = 0, iy = 0;
  overlay.addEventListener('mousedown', function (e) {
    if (fase !== 'selecionar' || e.button !== 0) return;
    ativo = true; ix = e.clientX; iy = e.clientY;
    caixa.style.display = 'block'; dim.style.display = 'block';
    pos(ix, iy, 0, 0);
  });
  overlay.addEventListener('mousemove', function (e) {
    if (!ativo || fase !== 'selecionar') return;
    var x = Math.min(e.clientX, ix), y = Math.min(e.clientY, iy);
    var w = Math.abs(e.clientX - ix), h = Math.abs(e.clientY - iy);
    pos(x, y, w, h);
  });
  overlay.addEventListener('mouseup', function (e) {
    if (!ativo || fase !== 'selecionar') return; ativo = false;
    var x = Math.min(e.clientX, ix), y = Math.min(e.clientY, iy);
    var w = Math.abs(e.clientX - ix), h = Math.abs(e.clientY - iy);
    if (w < 8 || h < 8) { caixa.style.display = 'none'; dim.style.display = 'none'; return; }
    entrarAnotacao({ x: x, y: y, w: w, h: h });
  });
  function pos(x, y, w, h) {
    caixa.style.left = x + 'px'; caixa.style.top = y + 'px';
    caixa.style.width = w + 'px'; caixa.style.height = h + 'px';
    dim.style.left = (x) + 'px'; dim.style.top = Math.max(0, y - 20) + 'px';
    dim.textContent = Math.round(w) + ' x ' + Math.round(h);
  }

  // ---------- PASSO 2: anotar + escrever recado ----------
  function entrarAnotacao(rect) {
    rectSel = rect; fase = 'anotar';
    // o overlay para de capturar (senao rouba o mouse do canvas/botoes)
    overlay.style.pointerEvents = 'none';
    caixa.style.display = 'block'; dim.style.display = 'block';
    pos(rect.x, rect.y, rect.w, rect.h);
    // canvas vai pro topo da pilha de desenho e passa a receber o mouse
    document.documentElement.appendChild(canvas);
    ferramenta = 'pincel';
    canvas.style.pointerEvents = 'auto';
    ferr.style.display = 'flex';
    painel.style.display = 'block';
    ferr.querySelectorAll('button[data-f]').forEach(function (x) { x.classList.toggle('ativa', x.getAttribute('data-f') === 'pincel'); });
    setDica('Passo 2 de 2: marque em <b>verde</b> DENTRO da area, escreva o recado e clique <b>Capturar</b>  •  ESC cancela');
  }

  function setupPainel() {
    painel.querySelector('.olho-eva-ok').addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      if (rectSel) finalizar(rectSel);
    });
    painel.querySelector('.olho-eva-refazer').addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      iniciarSelecao(); // mantem o texto do recado
    });
    painel.querySelector('.olho-eva-cancelar').addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      destruir();
    });
  }

  function setupFerramentas() {
    ferr.querySelectorAll('button[data-f]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var f = b.getAttribute('data-f');
        if (f === 'apagar') { cctx.clearRect(0, 0, canvas.width, canvas.height); return; }
        ferramenta = f;
        ferr.querySelectorAll('button[data-f]').forEach(function (x) { x.classList.toggle('ativa', x === b); });
        canvas.style.pointerEvents = (f === 'nenhuma') ? 'none' : 'auto';
      });
    });
    ferr.querySelectorAll('button[data-tam]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        tamanhoPincel = parseInt(b.getAttribute('data-tam'), 10) || 6;
        ferr.querySelectorAll('button[data-tam]').forEach(function (x) { x.classList.toggle('ativa', x === b); });
      });
    });
    canvas.addEventListener('mousedown', function (e) {
      if (fase !== 'anotar') return;
      desenhando = true; pa = { x: e.clientX, y: e.clientY };
      if (ferramenta === 'pincel') {
        cctx.strokeStyle = corPincel; cctx.lineWidth = tamanhoPincel; cctx.lineCap = 'round'; cctx.lineJoin = 'round';
        cctx.shadowColor = corPincel; cctx.shadowBlur = Math.max(4, tamanhoPincel);
        cctx.beginPath(); cctx.moveTo(pa.x, pa.y);
      } else if (ferramenta === 'retangulo') {
        caixaRetangulo = { x: pa.x, y: pa.y };
      } else if (ferramenta === 'texto') {
        var txt = prompt('Texto pra escrever no print:');
        desenhando = false;
        if (txt) {
          cctx.shadowColor = 'rgba(0,0,0,0.6)'; cctx.shadowBlur = 6;
          cctx.fillStyle = corPincel;
          var px = Math.max(14, tamanhoPincel * 3);
          cctx.font = 'bold ' + px + 'px system-ui,sans-serif';
          cctx.fillText(txt, pa.x, pa.y);
        }
      }
    });
    canvas.addEventListener('mousemove', function (e) {
      if (!desenhando || fase !== 'anotar') return;
      if (ferramenta === 'pincel') { cctx.lineTo(e.clientX, e.clientY); cctx.stroke(); }
    });
    canvas.addEventListener('mouseup', function (e) {
      if (!desenhando || fase !== 'anotar') return;
      desenhando = false;
      if (ferramenta === 'retangulo' && caixaRetangulo) {
        var x = Math.min(caixaRetangulo.x, e.clientX), y = Math.min(caixaRetangulo.y, e.clientY);
        var w = Math.abs(e.clientX - caixaRetangulo.x), h = Math.abs(e.clientY - caixaRetangulo.y);
        cctx.strokeStyle = corPincel; cctx.lineWidth = tamanhoPincel; cctx.shadowColor = corPincel; cctx.shadowBlur = Math.max(4, tamanhoPincel);
        cctx.strokeRect(x, y, w, h);
        caixaRetangulo = null;
      }
    });
  }

  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg && msg.type === 'OLHO_ARMAR' && msg.opcoes) opcoes = Object.assign(opcoes, msg.opcoes);
  });

  function recadoAtual() {
    var ta = painel.querySelector('.olho-eva-recado');
    return (ta && ta.value || '').trim();
  }

  function finalizar(rect) {
    var recado = recadoAtual();
    var meta = {
      titulo: document.title || '',
      url: location.href,
      area: Math.round(rect.w) + 'x' + Math.round(rect.h) + ' px',
    };
    var esqueleto = '';
    try { if (opcoes.camadaA) esqueleto = lerEsqueleto(rect); } catch (e) { esqueleto = '(falha ao ler esqueleto: ' + (e && e.message) + ')'; }

    var precisaFoto = !!(opcoes.camadaB || opcoes.camadaC);
    if (!precisaFoto) {
      enviarPipeline({ meta: meta, esqueleto: esqueleto, cropDataUrl: null, recado: recado });
      return;
    }
    // esconder a UI pra foto sair limpa (mantem o CANVAS de marcacoes pra aparecerem na foto)
    overlay.style.display = 'none'; caixa.style.display = 'none'; dim.style.display = 'none';
    dica.style.display = 'none'; ferr.style.display = 'none'; painel.style.display = 'none';
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      chrome.runtime.sendMessage({ type: 'OLHO_CAPTURE' }, function (resp) {
        if (!resp || resp.erro || !resp.dataUrl) {
          enviarPipeline({ meta: meta, esqueleto: esqueleto, cropDataUrl: null, recado: recado, aviso: 'nao consegui fotografar a area: ' + ((resp && resp.erro) || '') });
          return;
        }
        recortar(resp.dataUrl, rect, function (cropDataUrl) {
          enviarPipeline({ meta: meta, esqueleto: esqueleto, cropDataUrl: cropDataUrl, recado: recado });
        });
      });
    }); });
  }

  function recortar(dataUrl, rect, cb) {
    var img = new Image();
    img.onload = function () {
      var sx = Math.round(rect.x * dpr), sy = Math.round(rect.y * dpr);
      var sw = Math.round(rect.w * dpr), sh = Math.round(rect.h * dpr);
      var c = document.createElement('canvas'); c.width = sw; c.height = sh;
      c.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      try { cb(c.toDataURL('image/png')); } catch (e) { cb(null); }
    };
    img.onerror = function () { cb(null); };
    img.src = dataUrl;
  }

  function enviarPipeline(dados) {
    if (enviado) return; // trava anti-duplo-envio
    enviado = true;
    chrome.runtime.sendMessage({
      type: 'OLHO_PIPELINE',
      meta: dados.meta, esqueleto: dados.esqueleto, cropDataUrl: dados.cropDataUrl,
      recado: dados.recado || '', opcoes: opcoes,
    }, function () {});
    toast('Olho da EVA: capturei! Abra o painel da extensao pra ver/enviar.');
    setTimeout(destruir, 80);
  }

  function toast(txt) {
    try {
      var t = document.createElement('div');
      t.textContent = txt;
      t.style.cssText = 'position:fixed;bottom:22px;left:50%;transform:translateX(-50%);z-index:2147483647;background:linear-gradient(135deg,#6D5DF6,#13245c);color:#fff;font:600 13px system-ui;padding:12px 18px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.5)';
      document.documentElement.appendChild(t);
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 4200);
    } catch (e) {}
  }

  // ================= CAMADA A: esqueleto (DOM + acessibilidade) =================
  function lerEsqueleto(rect) {
    var vx1 = rect.x, vy1 = rect.y, vx2 = rect.x + rect.w, vy2 = rect.y + rect.h;
    var todos = document.body ? document.body.querySelectorAll('*') : [];
    var dentro = [];
    var MAX_ELEM = 600;
    for (var i = 0; i < todos.length && dentro.length < MAX_ELEM; i++) {
      var el = todos[i];
      if (!visivel(el)) continue;
      var r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // intersecta a area marcada?
      if (r.right < vx1 || r.left > vx2 || r.bottom < vy1 || r.top > vy2) continue;
      dentro.push({ el: el, r: r });
    }

    var textos = [];      // textos visiveis
    var interativos = []; // botoes, links, campos
    var imagens = [];     // imagens com alt
    var titulos = [];     // h1..h6 / role=heading
    var vistosTexto = {};

    dentro.forEach(function (o) {
      var el = o.el, tag = el.tagName.toLowerCase();
      var role = papel(el);

      // titulos
      if (/^h[1-6]$/.test(tag) || role === 'heading') {
        var th = texto(el);
        if (th) titulos.push((tag.match(/^h[1-6]$/) ? tag.toUpperCase() : 'TITULO') + ': ' + corta(th, 160));
      }
      // interativos
      if (tag === 'a' || tag === 'button' || role === 'button' || role === 'link' || tag === 'input' || tag === 'textarea' || tag === 'select' || el.getAttribute('role') === 'tab' || el.getAttribute('role') === 'menuitem') {
        var nome = nomeAcessivel(el);
        var extra = '';
        if (tag === 'a' && el.getAttribute('href')) extra = ' -> ' + corta(el.getAttribute('href'), 90);
        if (tag === 'input') extra = ' [campo ' + (el.getAttribute('type') || 'text') + (el.placeholder ? ', dica="' + corta(el.placeholder, 50) + '"' : '') + (el.value ? ', valor="' + corta(el.value, 50) + '"' : '') + ']';
        if (tag === 'textarea') extra = ' [area de texto' + (el.placeholder ? ', dica="' + corta(el.placeholder, 50) + '"' : '') + ']';
        var linha = (rotuloTag(tag, el, role)) + ': ' + (nome || '(sem nome acessivel)') + extra;
        if (interativos.indexOf(linha) === -1) interativos.push(linha);
      }
      // imagens
      if (tag === 'img') {
        var alt = el.getAttribute('alt');
        imagens.push('IMG: ' + (alt ? '"' + corta(alt, 120) + '"' : '(sem alt/descricao)') + (el.currentSrc || el.src ? ' [' + arquivo(el.currentSrc || el.src) + ']' : ''));
      }
      if (role === 'img' && tag !== 'img') {
        var lab = nomeAcessivel(el);
        if (lab) imagens.push('IMG(' + tag + '): "' + corta(lab, 120) + '"');
      }
    });

    // textos visiveis (folhas com texto proprio)
    dentro.forEach(function (o) {
      var el = o.el;
      var proprio = textoProprio(el);
      if (proprio && proprio.length >= 2) {
        var k = proprio.slice(0, 80);
        if (!vistosTexto[k]) { vistosTexto[k] = 1; textos.push(corta(proprio, 240)); }
      }
    });

    // estilo-chave de alguns elementos de destaque (contexto de design)
    var estilos = [];
    var destaque = dentro.filter(function (o) {
      var t = o.el.tagName.toLowerCase();
      return /^h[1-6]$/.test(t) || t === 'button' || t === 'a';
    }).slice(0, 8);
    destaque.forEach(function (o) {
      var cs = getComputedStyle(o.el);
      estilos.push(o.el.tagName.toLowerCase() + ' "' + corta(texto(o.el) || nomeAcessivel(o.el) || '', 40) + '" -> cor:' + cs.color + ' fundo:' + corFundo(o.el) + ' fonte:' + cs.fontSize + '/' + cs.fontWeight);
    });

    var out = [];
    if (titulos.length) { out.push('TITULOS:'); out.push.apply(out, dedup(titulos).slice(0, 30).map(pre)); out.push(''); }
    if (textos.length) { out.push('TEXTOS VISIVEIS (de cima pra baixo):'); out.push.apply(out, textos.slice(0, 120).map(pre)); out.push(''); }
    if (interativos.length) { out.push('ELEMENTOS INTERATIVOS (botoes/links/campos):'); out.push.apply(out, dedup(interativos).slice(0, 80).map(pre)); out.push(''); }
    if (imagens.length) { out.push('IMAGENS:'); out.push.apply(out, dedup(imagens).slice(0, 40).map(pre)); out.push(''); }
    if (estilos.length) { out.push('ESTILO-CHAVE (cores/fontes p/ contexto de design):'); out.push.apply(out, estilos.map(pre)); out.push(''); }
    out.push('(esqueleto resumido: ' + dentro.length + ' elementos na area)');
    return out.join('\n');
  }

  // ---------- helpers da Camada A ----------
  function visivel(el) {
    var cs;
    try { cs = getComputedStyle(el); } catch (e) { return false; }
    if (!cs) return false;
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    return true;
  }
  function papel(el) {
    var r = el.getAttribute && el.getAttribute('role');
    if (r) return r.toLowerCase();
    var t = el.tagName.toLowerCase();
    var mapa = { a: el.getAttribute && el.getAttribute('href') ? 'link' : '', button: 'button', nav: 'navigation', main: 'main', header: 'banner', footer: 'contentinfo', h1: 'heading', h2: 'heading', h3: 'heading', h4: 'heading', h5: 'heading', h6: 'heading', img: 'img', ul: 'list', ol: 'list', li: 'listitem', input: 'textbox', textarea: 'textbox', select: 'combobox', form: 'form', table: 'table' };
    return mapa[t] || '';
  }
  function rotuloTag(tag, el, role) {
    if (tag === 'a') return 'LINK';
    if (tag === 'button' || role === 'button') return 'BOTAO';
    if (tag === 'input') return 'CAMPO';
    if (tag === 'textarea') return 'AREA-TEXTO';
    if (tag === 'select') return 'SELETOR';
    if (role === 'tab') return 'ABA';
    if (role === 'menuitem') return 'MENU';
    return tag.toUpperCase();
  }
  function nomeAcessivel(el) {
    var v = el.getAttribute && (el.getAttribute('aria-label') || el.getAttribute('alt') || el.getAttribute('title'));
    if (v) return v.trim();
    var lb = el.getAttribute && el.getAttribute('aria-labelledby');
    if (lb) {
      var refs = lb.split(/\s+/).map(function (id) { var n = document.getElementById(id); return n ? texto(n) : ''; }).filter(Boolean);
      if (refs.length) return refs.join(' ').trim();
    }
    var t = texto(el);
    return t ? t.trim() : '';
  }
  function texto(el) { return (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function textoProprio(el) {
    var s = '';
    for (var i = 0; i < el.childNodes.length; i++) {
      var n = el.childNodes[i];
      if (n.nodeType === 3) s += n.nodeValue;
    }
    return s.replace(/\s+/g, ' ').trim();
  }
  function corFundo(el) {
    var n = el, cs;
    for (var i = 0; i < 6 && n; i++) {
      cs = getComputedStyle(n);
      if (cs && cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') return cs.backgroundColor;
      n = n.parentElement;
    }
    return '(transparente)';
  }
  function arquivo(u) { try { var p = new URL(u, location.href).pathname.split('/'); return p[p.length - 1] || u; } catch (e) { return corta(u, 40); } }
  function corta(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n) + '…' : s; }
  function pre(s) { return '  • ' + s; }
  function dedup(a) { var seen = {}, out = []; a.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } }); return out; }

  montar();
})();
