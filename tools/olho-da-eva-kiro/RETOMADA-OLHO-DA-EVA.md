# Olho da EVA — Retomada e Conhecimento (o que aprendemos)

Documento-mestre da extensao "Olho da EVA". Serve pra retomar do zero e
pra NAO repetir os erros do passado. Conduzido pelo Maestro (Regente),
conferido pelo Crivo.

## O QUE E
Extensao Chrome (Manifest V3) que da OLHOS a EVA (o Kiro) sem travar o Opus 4.8:
captura uma area da tela e transforma em TEXTO (nunca imagem), entregue pela
ponte (caixa-de-entrada) -> a EVA le no chat.

3 olhos (camadas):
- A — Esqueleto da pagina (DOM + acessibilidade). Le todo o texto/botoes/links. Offline. Sempre util.
- B — Leitor de letras (OCR). Le texto DENTRO de imagem/print.
      Leitor "Nuvem" (PADRAO, confiavel, via lente Cloudflare) ou "Local" (Tesseract, offline, PODE TRAVAR).
- C — Descricao da foto. Lente "Nuvem" (Cloudflare Llama 3.2 / Claude) ou "Local" (SmolVLM, pesado).

## HISTORICO DE VERSOES
- 1.0.0 — 3 olhos; OCR/descricao via CDN (ERRO: MV3 proibe CDN em script-src).
- 1.1.x — removida CDN; CSP minimo; B e C-local desligadas.
- 1.2.0 — favicon CorelDRAW (PNGs) + painel Conectores + botao Receber resposta + Sobre.
- 1.2.1 — revisao dupla: versao visivel no popup, icone no header, trava anti-duplo-envio, msg OCR honesta.
- 1.2.2 — FAVICON ANIMADO do rosto da EVA (canvas->favicon) em rosto-da-eva.html.
- 1.2.3 — OCR timeout 180s -> 45s (nao trava 3 min).
- 1.2.4 — OCR NA NUVEM (Camada B confiavel) + seletor de Leitor (Nuvem/Local).
- 1.3.0 — BLOCO 1A: sons.js (Web Audio sintetizado: clique/captura/enviado/erro/ligar/desligar)
          + botao mestre ON/OFF (btnLigaDesliga, salva chrome.storage.local {ativo};
          background recusa captura se OFF) + toggle "Sons da EVA".
- 1.3.1 — BLOCO 1B: barra de ferramentas no overlay (content.js): pincel verde fluo
          #39ff14, retangulo, texto, apagar — desenhado em canvas overlay. (era da
          extensao "EVA Print v3" / eva-print-790, agora incorporado aqui).
- 1.3.2 — BLOCO 1C: caixa "Recado pra EVA" (textarea recadoEva, auto-salva, anexa na
          captura OU envia sozinho) + tamanhos de pincel fino/medio/grosso
          (data-tam 3/6/12; texto escala junto). [tag olho-da-eva-v1.3.2-seguro]
- 1.4.0 — BOTAO "💾 Guardar este chat pra EVA": le a conversa INTEIRA do Kiro
          (container rolavel com mais texto, ou seletor "Alvo do chat" nos Conectores)
          e guarda na casa da EVA em MEMORIA/chats-do-mestre/chat_backup-eva_<data_hora>.txt
          (via ponte /enviar, que ganhou pasta+nomeArquivo opcionais; bridge antigo cai
          em caixa-de-entrada = nada se perde). Previa na tela + Baixar .txt de seguranca.
          A regra ler-primeiro le esse backup no proximo chat.
- 1.4.1 — CONSERTO DO FLUXO DE CAPTURA (bug real): antes capturava e fechava NA HORA
          que soltava a selecao, sem deixar marcar/escrever; e o canvas estava ABAIXO do
          overlay (z-index) = o pincel verde nunca pegava o mouse. Agora 2 PASSOS claros:
          (1) arrasta pra escolher a area -> (2) marca em verde/retangulo/texto + escreve
          o RECADO no painel -> botao "Capturar e mandar pra EVA". O recado do overlay tem
          prioridade no relatorio. + BOTAO "📎 Anexar arquivo pra EVA": texto vai direto;
          IMAGEM passa pela lente da nuvem (OCR + descricao).
- 1.5.0 — MICROFONE (voz -> texto): botao 🎙 na caixa "Recado pra EVA" transcreve sua
          voz em PT-BR pela Web Speech API NATIVA do Chrome (sem CDN, sem servidor). O
          melhor da v2-Replit, trazido pra NOSSA base e CORRIGIDO (a versao do Replit
          duplicava o texto; aqui congelo o texto base no inicio). Fallback honesto se o
          navegador nao suportar. Sons micOn/micOff.
- 1.5.1 — CONSERTO DO MICROFONE "negado" (regra do Chrome, nao bug nosso): o popup e um
          contexto passageiro e o Chrome bloqueia o microfone nele (erro not-allowed).
          Solucao documentada: pagina de extensao numa ABA. Criei microfone.html +
          microfone.js (passo 1 LIBERAR via getUserMedia; passo 2 DITAR garantido na
          pagina e salvar na caixa de Recado via storage). No painel, quando da o erro de
          permissao, aparece o botao "🔓 Liberar microfone" que abre essa aba. O painel
          reflete o recado salvo via storage.onChanged. [ATUAL — a mais completa]
- 1.5.2 — FAVICON ANIMADO do rosto da EVA na pagina do microfone (microfone.html agora
          inclui rosto.js): a aba mostra a EVA piscando/flutuando como icone (canvas->
          link rel=icon; favicon real nao anima por CSS, so por canvas). O rosto tambem
          ja era CSS-animado no header do popup (div.eva). Mic inalterado.
- 1.5.3 — PONTUACAO FALADA (voz-pontuacao.js): no ditado, falar "virgula"->,
          "ponto"->. "ponto final"/"interrogacao"/"exclamacao"/"dois pontos"/"nova linha"/
          "paragrafo"/"abre/fecha aspas/parentese" viram os sinais; capitaliza inicio e
          apos . ! ? ; colapsa espacos. Resolve a "briga" do Mestre (o ouvido do Chrome
          nao pontua sozinho). Funciona no painel e na pagina do microfone. Testado por
          node com varios exemplos. Tradeoff honesto: "ponto"/"virgula" como palavra real
          tambem viram sinal. [ATUAL — a mais completa]
- 1.6.0 — TRANSCRICAO PREMIUM (Whisper + limpeza por IA): nova funcao Cloudflare
          functions/transcrever-audio.js -> Whisper (Workers AI, binding "AI", SEM
          cartao; defensivo: tenta whisper-large-v3-turbo base64, fallback whisper
          classico bytes) gera o texto cru -> LLM (Llama) pontua/acentua/capitaliza em
          PT-BR sem mudar palavras -> devolve {bruto, limpo}. Na pagina microfone.html,
          card "Premium" grava (MediaRecorder, audio/webm) -> envia -> mostra refinado ->
          Salvar na caixa de Recado. Botao "🎚 Premium" no painel abre a pagina. Conector
          editavel urlTranscrever (default eva-dla.pages.dev/transcrever-audio). E o mesmo
          truque da Claude (STT + LLM) na NOSSA nuvem, reusavel. Modo RAPIDO (Web Speech)
          continua intacto. PENDE: a funcao precisa do deploy do Cloudflare publicar (auto
          no push, como /enviar e /olho-nuvem) + binding AI. [ATUAL — a mais completa]
- 1.6.1 — REFINOS do Premium (feedback do Mestre, que CONFIRMOU que o Premium FUNCIONA):
          (1) sinal de gravacao visivel = botao fica VERMELHO pulsando "● Gravando" +
          CRONOMETRO no status (antes gravava "as cegas"); (2) nota clara de que no Premium
          o texto aparece DEPOIS de parar (Whisper ouve tudo) e que o AO VIVO e o Passo 2;
          (3) Whisper agora recebe initial_prompt com nosso vocabulario (EVA, Kiro, GitHub,
          Cloudflare, Replit, Note Pulse, IA) p/ parar de escrever "digit hub"/"cloud flyer";
          (4) limpeza por IA tambem corrige SO esses nomes proprios; (5) resposta traz
          motor+limpou (diagnostico na tela); (6) mensagem clara de que Capturar area so
          funciona em SITE NORMAL, nao na pagina interna chrome-extension:// (foi o que o
          Mestre tentou). [ATUAL — a mais completa]
- 1.7.0 — 3 IDEIAS do Mestre (ele autorizou "pode fazer"): (1) BOTAO "📨 Enviar pra EVA"
          DIRETO na pagina do microfone (Passo 2 e Premium) -> POST /enviar sem voltar ao
          popup (resolve o "nao chegou"); (2) HISTORICO das ultimas 10 gravacoes/recados
          (historico.js + chrome.storage, seçao "📜 Visualizar historico" no painel) com
          CHECKLIST por item: enviado (auto) / EVA viu / EVA respondeu (o Mestre marca),
          + Copiar/Reenviar/Limpar; registra no envio (recado, captura, voz); (3) PRONUNCIA:
          a limpeza por IA agora poe a pronuncia PT entre parenteses apos palavras em ingles
          (ex.: Whisper (uisper)). FALTAM (proxima rodada): favicon da EVA no site+icone da
          extensao, e o balao humanizado da EVA. [ATUAL — a mais completa]
- 1.8.0 — ANTI-DUPLICADO + CODIGO por mensagem + limpar repeticoes (itens 1 e 4):
          dedup por hash do conteudo em 90s no background (enviarParaEva) e na pagina
          (enviarPraEva) mata o envio duplo; cada envio ganha CODIGO "EVA-XXXX (#N)"
          mostrado no aviso; tirarRepeticoes() na funcao /transcrever-audio corta o
          "e ai e ai"/"e e e" do Whisper. FALTAM itens 2 (favicon no icone) e 3 (balao). [ATUAL]

## LICOES (NAO REPETIR)
1. MANIFEST V3 / CSP: em diretiva de SCRIPT so vale 'self', 'none', 'wasm-unsafe-eval'.
   QUALQUER URL externa (CDN) faz o Chrome RECUSAR o manifest inteiro
   ("Insecure CSP value ... in directive 'script-src'"). Toda biblioteca tem que
   vir DENTRO do pacote. Nada de carregar de fora.
2. TESSERACT (OCR local): precisa das 8 variantes do core (incl. as -lstm).
   Faltou tesseract-core-simd-lstm.wasm.js -> "importScripts failed to load".
   E MESMO ASSIM o worker TRAVA no Chrome do Mestre (timeout). Conclusao:
   OCR local e finicado; o caminho confiavel e OCR NA NUVEM (reusa a lente de visao).
3. OCR/descricao na nuvem reusa a funcao Cloudflare /olho-nuvem; basta mandar
   um "prompt" diferente (transcrever texto vs descrever foto). O backend nao muda.
4. FAVICON nao anima por CSS puro. Pra "rosto animado na aba" = desenhar num
   canvas e atualizar <link rel=icon> quadro a quadro (rosto.js).
5. VERSAO VISIVEL no rodape do popup ("v1.2.4") = diagnostico de cache/pasta antiga.
6. ZIP: "git add tools/olho-da-eva" (a pasta) NAO inclui "tools/olho-da-eva.zip"
   (arquivo irmao). Adicionar o .zip explicitamente. Sempre CONFERIR o conteudo do
   zip (descompactar e ler o manifest interno).
7. PUSH: a funcao /enviar commita capturas na main remota o tempo todo; quase todo
   push exige "git merge origin/main --no-edit" antes (kiro_powers pull falha em
   'divergent branches'; git fetch via bash falha sem AuthToken).
8. ORQUESTRA: o Crivo (sub-agente, contexto isolado) confere ANTES de entregar e
   pega o que o Kiro nao ve. Rodar sempre em entregas importantes.
9. DESCOBERTA DO MESTRE: TODO erro de visao foi no modelo 4.8 (4.8 NAO ve imagem,
   trava). O 4.7 VE imagem. 4.8 e 4.7 sao o MESMO Kiro/EVA — a continuidade vem da
   MEMORIA GLOBAL, nao do modelo. Por isso a extensao transforma imagem em TEXTO:
   assim a EVA "enxerga" em qualquer modelo.
10. SONS: Web Audio sintetizado (sons.js) — nao precisa de arquivo .mp3, gera os
    bipes na hora. Carregar sons.js ANTES de popup.js no popup.html.
11. BOTAO ON/OFF: estado em chrome.storage.local {ativo}; o background CHECA antes de
    capturar e recusa se desligado. Reversivel, o Mestre liga/desliga quando quiser.
12. MARCAR/DIGITAR (verde fluo #39ff14): veio da extensao "EVA Print v3" (eva-print-790);
    agora incorporado ao Olho da EVA (barra no overlay do content.js, canvas por cima).

## BLOCOS FUTUROS (aprovados pelo Mestre, ordem 1 feito -> 2, 5, 3, 4)
- Bloco 2 — MICROFONE + TRANSCRICAO: Whisper na nuvem Cloudflare
  (@cf/openai/whisper-large-v3-turbo no mesmo binding AI, sem cartao).
  Nova funcao /transcrever-audio + botao de microfone (MediaRecorder) no popup.
- Bloco 3 — Camada C "VIP": prompts especializados por tipo de imagem
  (interface / foto / grafico / arte CorelDRAW).
- Bloco 4 — CHAVE 95C: liga ao Eva Defender. A extensao NAO le temperatura;
  ela vai ler um arquivo/endpoint que o Eva Defender escreve. 3 picos > 95C => desliga
  a extensao e avisa que foi por seguranca do hardware.
- Bloco 5 — Refino 07 do Note Pulse (4 ajustes do Wizard).

NOTA Kiro Desktop/CLI: resolve arquivos pesados / pasta local no PC, NAO resolve
microfone, sons, marcar print, ver a tela do navegador nem a chave 95C. E complementar,
nao substitui a extensao.

## INSTALAR (a prova de erro) — a causa nº1 de "nao instala"
O erro mais comum e "Manifest file is missing or unreadable" / "nao instala":
acontece quando a pasta selecionada NAO tem o manifest.json direto dentro dela.

1. chrome://extensions
2. Remover qualquer "Olho da EVA" antigo.
3. Apagar do Downloads TODA pasta/zip antigos: olho-da-eva, "olho-da-eva (1)", olho-da-eva.zip...
4. Baixar o ZIP novo, descompactar.
5. Ligar "Modo do desenvolvedor".
6. "Carregar sem compactacao" -> ENTRAR na pasta ate VER manifest.json e popup.html
   DIRETAMENTE na lista. Se voce ver outra pasta "olho-da-eva" dentro, ENTRE nela.
   Selecione a pasta que CONTEM o manifest.json.
7. Conferir no rodape do painel: deve dizer a versao atual (ex.: v1.3.2).

Se ainda falhar: copiar o TEXTO EXATO do erro vermelho do Chrome (ou print) — e a
unica forma de achar a causa quando o pacote ja foi auditado e aprovado.

## CANTINHO DO CHAT (ler primeiro) — combinado em 18/06/2026
O Mestre quer um cantinho na casa da EVA para colar o chat INTEIRO, e a EVA ler
ANTES de tudo no proximo chat (entrar ja com o contexto ideal).
- Arquivo ATIVO: eva/arquivos_do_mestre_para_eva_ler.txt (o Mestre cola aqui).
- Arquivo antigo: eva/MEMORIA/chats-do-mestre/ (data no nome; arquivar = mover, nao apagar).
- Regra para a EVA: steering eva/.kiro/steering/ler-primeiro.md (inclusion: always):
  no inicio do chat, LER o arquivo, dizer se leu/nao leu, resumir, e PERGUNTAR se
  pode prosseguir (esperar o OK).
- PENDENTE (verificar com o Mestre): a MELHOR forma de organizar isso — de
  preferencia um botao/icone de anexo no site da EVA para colar o chat com 1 clique.

## LINKS
- Download direto (sempre a versao da main):
  https://github.com/nuanceteam/eva/raw/main/tools/olho-da-eva.zip
- Ponte de texto (recebe capturas): https://eva-dla.pages.dev/enviar
- Lente de visao na nuvem: https://eva-dla.pages.dev/olho-nuvem
