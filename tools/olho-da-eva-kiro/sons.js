// Olho da EVA - SONS (Web Audio API, sintetizados, sem arquivo de audio).
// Cada som e gerado na hora; respeita a preferencia "sons" salva (default ligado).
(function () {
  let ac = null;       // AudioContext criado sob demanda (politicas de autoplay)
  let ligados = true;  // espelhado de chrome.storage

  function ctx() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; } }
    return ac;
  }

  function tom(freq, duracaoMs, volume, tipo) {
    if (!ligados) return;
    const a = ctx(); if (!a) return;
    try {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = tipo || 'sine';
      o.frequency.value = freq;
      const t0 = a.currentTime;
      const v = (volume == null ? 0.10 : volume);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(v, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duracaoMs / 1000);
      o.connect(g).connect(a.destination);
      o.start(t0);
      o.stop(t0 + duracaoMs / 1000 + 0.02);
    } catch (e) { /* silencio em caso de bloqueio */ }
  }

  // sons da paleta da EVA - curtos, suaves
  const Sons = {
    clique:   () => tom(880, 60, 0.06, 'sine'),
    captura:  () => { tom(660, 80, 0.10, 'sine'); setTimeout(() => tom(990, 110, 0.10, 'sine'), 80); },
    enviado:  () => { tom(740, 90, 0.10, 'sine'); setTimeout(() => tom(988, 130, 0.12, 'sine'), 90); setTimeout(() => tom(1318, 160, 0.10, 'sine'), 200); },
    erro:     () => { tom(220, 200, 0.10, 'square'); },
    ligar:    () => { tom(550, 80, 0.08, 'sine'); setTimeout(() => tom(880, 120, 0.10, 'sine'), 80); },
    desligar: () => { tom(660, 80, 0.08, 'sine'); setTimeout(() => tom(330, 140, 0.08, 'sine'), 80); },
    micOn:    () => { tom(620, 70, 0.09, 'sine'); setTimeout(() => tom(930, 90, 0.10, 'sine'), 70); },
    micOff:   () => { tom(500, 90, 0.08, 'sine'); },
  };

  async function carregarPref() {
    try { const d = await chrome.storage.local.get('sons'); ligados = d.sons !== false; } catch (e) {}
  }
  function setLigados(v) { ligados = !!v; chrome.storage.local.set({ sons: ligados }).catch(() => {}); }
  function isLigado() { return ligados; }

  carregarPref();
  window.OlhoEVASons = { tocar: (nome) => Sons[nome] && Sons[nome](), setLigados, isLigado, carregarPref };
})();
