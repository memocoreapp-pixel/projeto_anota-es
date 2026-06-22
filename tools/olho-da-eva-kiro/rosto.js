// Olho da EVA - estrelas do ceu + FAVICON ANIMADO do rosto da EVA.
// (favicon nao anima por CSS puro: o jeito real e desenhar o rosto num canvas
//  e atualizar o <link rel=icon> quadro a quadro. E o que fazemos aqui, leve.)
(function () {
  // ---------- estrelinhas do ceu ----------
  var ceu = document.getElementById('ceu');
  if (ceu) {
    for (var i = 0; i < 40; i++) {
      var s = document.createElement('span');
      s.className = 'estrela';
      s.style.left = (Math.random() * 100) + '%';
      s.style.top = (Math.random() * 100) + '%';
      s.style.animationDelay = (Math.random() * 3.5) + 's';
      if (Math.random() > 0.7) s.style.background = '#bcd6ff';
      ceu.appendChild(s);
    }
    var cad = document.createElement('span');
    cad.className = 'cadente';
    ceu.appendChild(cad);
  }

  // ---------- favicon animado: EVA piscando e flutuando na aba ----------
  var S = 64;
  var cv = document.createElement('canvas');
  cv.width = S; cv.height = S;
  var ctx = cv.getContext('2d');

  var link = document.querySelector('link[rel~="icon"]');
  if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
  link.type = 'image/png';

  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  var t0 = Date.now();
  function frame() {
    var t = (Date.now() - t0) / 1000;
    ctx.clearRect(0, 0, S, S);

    // fundo noite arredondado
    var g = ctx.createLinearGradient(0, 0, 0, S);
    g.addColorStop(0, '#0a1430'); g.addColorStop(1, '#13245c');
    ctx.fillStyle = g; rr(2, 2, S - 4, S - 4, 16); ctx.fill();
    // brilho roxo no topo
    var rad = ctx.createRadialGradient(S / 2, S * 0.22, 2, S / 2, S * 0.22, S * 0.75);
    rad.addColorStop(0, 'rgba(109,93,246,0.5)'); rad.addColorStop(1, 'rgba(109,93,246,0)');
    ctx.fillStyle = rad; rr(2, 2, S - 4, S - 4, 16); ctx.fill();

    // flutuacao
    var bob = Math.sin(t * 1.6) * 2;
    ctx.save();
    ctx.translate(S / 2, S / 2 + bob);

    // corpo branco
    var bg = ctx.createLinearGradient(0, -22, 0, 24);
    bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, '#d7def0');
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.ellipse(0, 0, 20, 24, 0, 0, Math.PI * 2); ctx.fill();

    // visor escuro
    ctx.fillStyle = '#0b1020';
    rr(-15, -10, 30, 18, 8); ctx.fill();

    // olhos roxos (piscam de vez em quando)
    var cyc = t % 4.2;
    var blink = (cyc > 4.0) ? Math.max(0.08, 1 - (cyc - 4.0) / 0.2) : 1;
    ctx.fillStyle = '#6D5DF6';
    ctx.save(); ctx.translate(-6.5, -1); ctx.scale(1, blink); ctx.beginPath(); ctx.arc(0, 0, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(6.5, -1); ctx.scale(1, blink); ctx.beginPath(); ctx.arc(0, 0, 3.6, 0, Math.PI * 2); ctx.fill(); ctx.restore();

    // 3 luzes do peito pulsando
    for (var k = 0; k < 3; k++) {
      var pl = 0.35 + 0.65 * Math.abs(Math.sin(t * 2 + k * 0.6));
      ctx.fillStyle = 'rgba(109,93,246,' + pl.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(-7 + k * 7, 15, 1.8, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();

    try { link.href = cv.toDataURL('image/png'); } catch (e) {}
  }

  frame();
  setInterval(frame, 110); // ~9 quadros/s: suave e leve
})();
