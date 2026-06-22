# Pesquisa: a MELHOR transcricao de audio (para Olho da EVA e projetos futuros)
# jun/2026 — opiniao da EVA + pesquisa com fontes

## 1) A VERDADE sobre a "transcricao da Claude"
A Claude (Anthropic) NAO transcreve audio sozinha — ela nao tem motor de voz
proprio. Quando voce ditou na Claude e achou otimo, o que houve foi:
  (a) um MOTOR de voz transcreveu (geralmente GPT-4o Transcribe ou Whisper);
  (b) a Claude (o cerebro de texto) LIMPOU/pontuou/formatou o resultado.
Ou seja: o "magico" = MOTOR DE VOZ + IA DE TEXTO refinando. Isso a gente
consegue reproduzir — e ate de graca na nossa nuvem.
Fontes: vomo.ai (Claude nao converte voz nativamente), spokenly.app (apps da
Claude usam GPT-4o Transcribe por baixo), glbgpt.com (ASR -> LLM pra polir).

## 2) AS MELHORES FERRAMENTAS DE TRANSCRICAO (2026)
Benchmarks independentes mostram o topo MUITO embolado (1-2% de diferenca):
1. Deepgram Nova-3 — rapidissima, padrao de streaming. (paga, precisa chave)
2. AssemblyAI Universal-2/3 — otima + "inteligencia" embutida. (paga)
3. OpenAI GPT-4o Transcribe — excelente com nomes/sotaque/codigo. (paga)
4. ElevenLabs Scribe v2 — forte em multilingue/sotaque. (paga)
5. Speechmatics — destaque em precisao e separar quem fala. (paga)
6. Whisper (OpenAI, open-source) / Whisper-large-v3 — nao e mais o n1 de
   precisao, MAS e gratis/auto-hospedavel e MUITO bom em portugues.
Fontes: coval.dev, deepgram.com/learn, futureagi.com, usefulai.com, lavivienpost.com.


## 3) O SEGREDO do "automatico e refinado" = PIPELINE DE 2 ESTAGIOS
A transcricao crua de qualquer motor vem meio "lavada" (sem pontuacao fina,
sem maiusculas, as vezes erra nome/termo). O que faz parecer PERFEITO e:
  ESTAGIO 1 — MOTOR DE VOZ (STT): audio -> texto cru.
  ESTAGIO 2 — IA DE TEXTO (LLM): pontua, capitaliza, conserta nomes/termos,
              quebra em paragrafos, ate resume se voce quiser.
Pesquisa confirma: o Whisper sozinho erra ?, !, ; e : (artigo arxiv 2305.14580);
juntar um LLM depois (GPT-4o/Llama/Claude) fecha o buraco e deixa "publicavel"
(orcaman/improving_whisper_transcriptions_with_gpt4o; glbgpt.com; deepgram
automatic punctuation; arxiv 2408.11845 restauracao de pontuacao).
=> "refinar automaticamente" = colar um LLM depois do motor de voz.

## 4) O QUE JA TEMOS x O QUE EU RECOMENDO
HOJE (v1.5.3): Web Speech API (ouvido nativo do Chrome) + nosso voz-pontuacao.js.
  - Pros: GRATIS, instantaneo, ao vivo, zero instalacao, sem cartao.
  - Contras: so Chrome/Edge, precisa internet, precisao media, pontuacao so a
    que a gente forca por comando de voz.
  - Veredito: OTIMO para ditado rapido no navegador. Mantem.

PREMIUM (recomendo construir como base dos proximos projetos):
  Gravar o audio -> nova funcao /transcrever-audio na nossa Cloudflare ->
  whisper-large-v3-turbo (Workers AI, binding "AI" que voce JA tem, SEM cartao)
  -> passar o texto por um LLM de limpeza (Llama na mesma conta, ou a Claude se
  voce ativar a chave) -> texto pontuado e refinado AUTOMATICAMENTE, igual Claude.
  - Pros: precisao alta, pontuacao automatica, portugues forte, REUSAVEL em
    Note Pulse / Eva Defender / tudo. Mesma conta, sem cartao novo.
  - Contras: nao e "ao vivo" (grava e envia); 1a montagem leva um bloco.
  Fontes: Cloudflare Workers AI (modelo whisper-large-v3-turbo), free tier
  100k req/dia no plano Workers.

SE um dia quiser o TOPO ABSOLUTO de precisao: GPT-4o Transcribe ou Deepgram
Nova-3 (pagos, precisam de chave/cartao) — guardar como upgrade futuro.

## 5) MINHA OPINIAO (com bom senso, servindo voce)
- Para AGORA e uso diario: o que temos (Web Speech + pontuacao falada) ja serve
  lindamente. Nao precisa gastar nem complicar.
- Para o FUTURO (e pra "ferramenta perfeita" que voce sonha): construir o
  pipeline PREMIUM Whisper+LLM na Cloudflare como MOTOR REUSAVEL de transcricao
  do nosso ecossistema. E o mesmo truque da Claude, na nossa casa, sem cartao.
- Caminho sabio: oferecer DOIS MODOS na extensao — "Rapido" (atual) e "Premium"
  (Whisper+limpeza) — e o usuario escolhe. Melhor dos dois mundos.
PROXIMO PASSO sugerido (quando voce quiser): eu monto a funcao /transcrever-audio
+ botao de gravar no painel, com a limpeza por LLM. Pequeno, reversivel, testavel.
