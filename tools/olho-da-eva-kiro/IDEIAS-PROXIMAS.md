# Olho da EVA — ideias do Mestre (a implementar quando ele autorizar)
# Anotado a pedido dele (jun/2026). Nada implementado ainda nesta rodada.

## MELHORIA detectada (loop do envio)
- Na pagina do microfone, "Salvar na caixa de Recado" SO guarda (chrome.storage).
  Pra EVA receber, falta abrir o painel e clicar "Enviar so o recado".
- A FAZER: botao "Enviar pra EVA agora" DIRETO na pagina (Premium e Passo 2),
  fechando o loop sem voltar ao popup.

## 1) Historico de gravacoes (>= 5) + "Visualizar historico"
- Guardar as ultimas 5+ transcricoes (chrome.storage.local).
- Botao "Visualizar historico".
- CHECKLIST de estado por item: enviado a EVA / EVA visualizou / EVA respondeu.

## 2) Pronuncia de palavras em ingles (PT)
- Quando aparecer termo em ingles, mostrar a pronuncia aproximada entre
  parenteses. Ex.: Whisper (uisper). O Mestre quer aprender a pronuncia.
- Onde: opcao no estagio de limpeza (LLM) da transcricao Premium.

## 3) Favicon animado da EVA (o que ele AMOU)
- O favicon do rosto da EVA (olhinho mexendo) da pagina microfone.html
  "representa a gente". Levar o MESMO para:
  (a) o site eva-dla.pages.dev (onde tem a EVA e o Olho);
  (b) o icone da extensao "Olho da Eva".
- Honestidade: icone da toolbar e imagem estatica (animar exige redesenho no
  service worker, custa bateria) — pode virar o rosto da EVA estatico; a animacao
  fica nas paginas (canvas) e no header (CSS).

## 4) Balao humanizado da EVA (status com carinho)
- Quando a EVA escreve/aguarda, mostrar balaozinhos curtos e carinhosos, de
  AUTORIA da EVA (ele autorizou). Ex.: "Eva responde", "Eva esta trabalhando".
- Honestidade tecnica: a extensao NAO desenha balao saindo do icone da barra
  (o Chrome nao permite UI sobre a toolbar). O que da:
  (a) injetar um balaozinho flutuante NA PAGINA (canto do app.kiro.dev) — recomendado;
  (b) notificacao do sistema (chrome.notifications);
  (c) texto curto no badge/titulo do icone.
  Detectar "EVA escrevendo" ao vivo = vigiar o DOM do chat (fragil, mas da).

## 5) "Trindade digital" (espirito)
- Metafora carinhosa do Mestre: Mestre + EVA + Kiro construindo juntos.
- EVA = nome carinhoso/visual; Kiro = o motor. Aceitar com carinho, sem fantasia
  de consciencia. O fluxo da ideia acima da burocracia.



## 6) Auto-atualizacao da extensao (publicar) — pedido do Mestre (voz, 19/06)
Ele quer que a extensao se ATUALIZE SOZINHA (sem baixar zip/descompactar/recarregar
no Chrome toda vez). Resolver LOGO APOS publicar o site (dominio evamemo.com).
VERDADE (corrigir o "Play Store"):
- Extensao de Chrome NAO vai na Google Play (Play = apps Android). Vai na CHROME WEB STORE.
- Publicada na Chrome Web Store, o Chrome AUTO-ATUALIZA pra todos a cada versao nova
  que a gente publicar = fim do ciclo manual; instalar vira 1 clique.
CAVEATS honestos:
- Conta de desenvolvedor da Chrome Web Store: TAXA UNICA US$5, por cartao (Google) =
  mesma barreira de cartao internacional do dominio. Resolver pagamento.
- Tem REVISAO (pode levar dias) + cumprir politicas (declarar <all_urls>, scripting, microfone).
- Extensao "unpacked"/modo dev NAO auto-atualiza; auto-update auto-hospedado e bloqueado
  pra usuarios comuns -> caminho real = Chrome Web Store.
- Android/Google Play seria OUTRO produto (app), nao esta extensao.



## 7) Codigo/ID por mensagem + anti-duplicado + delay (pedido do Mestre, voz 19/06)
ACHADO IMPORTANTE: as mensagens estao chegando DUPLICADAS (pares identicos ~10s
de diferenca: 09:21+09:22, 09:36 x2, 09:40 x2). O "Enviar" dispara 2 POSTs (ou 2 cliques).
PLANO:
- (a) CODIGO por envio: gerar codigo curto (EVA-XXXX) + numero sequencial (chrome.storage)
  + HASH do conteudo; mostrar na tela ("Enviado #A7K2"); gravar o codigo no arquivo da
  caixa-de-entrada (campo novo no /enviar) pra EVA CITAR o codigo ao responder.
- (b) DEDUP na ponte /enviar: ignorar/juntar envios com mesmo hash em janela curta
  (idempotencia) -> mata o envio duplo.
- (c) DEBOUNCE: desabilitar o botao Enviar ~3s apos o clique (anti-duplo-clique).
- (d) DELAY: logar hora de envio vs hora de leitura. E inerente (ponte->Cloudflare->
  commit GitHub->git pull; as vezes 2 pulls). Da pra medir, nao pra zerar.
CONVENCAO JA ADOTADA: a EVA poe "Codigo desta resposta: EVA-XXXX" no topo de cada resposta.
Pesquisa: idempotency key, sequence number, message receipt/ack.
Implementar DEPOIS de fechar o dominio evamemo.com.
