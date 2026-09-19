# Pato ao Alvo

Primeira fundação do jogo casual 2D **Pato ao Alvo**, feita com PHP, HTML5 Canvas, CSS e JavaScript sem frameworks.

## Estado atual

As 12 sprints do MVP estão implementadas:

- tela inicial responsiva com identidade visual própria;
- cenário 2D em camadas desenhado no Canvas;
- loop principal com `requestAnimationFrame`;
- cena animada e mira controlada por mouse/toque;
- arqueiro com estados parado/mirando, respiração, piscar e rotação suave do arco;
- configuração central de balanceamento em PHP;
- estrutura inicial para APIs JSON;
- progresso local preparado com `localStorage`;
- dez arcos e dez flechas oficiais definidos em progressão sequencial.

Na Sprint 2, o arqueiro ganhou uma entidade própria, estados parado/mirando, animações básicas e controles equivalentes para mouse e toque.

Na Sprint 3, pressionar/toque inicia o carregamento do arco e soltar dispara uma flecha. A força altera a velocidade, e cada flecha possui gravidade, rotação, alcance, dano e remoção automática fora do cenário.

Na Sprint 4, o Pato Comum virou uma entidade do jogo. Patos surgem dos dois lados, voam em alturas e velocidades variadas, recebem colisões das flechas e caem com uma animação ao serem derrotados.

Na Sprint 5, cada pato derrotado concede os pontos e moedas definidos na configuração central. O HUD e o saldo total são atualizados imediatamente, com salvamento no `localStorage`.

Na Sprint 6, o jogo ganhou partidas de 60 segundos, dificuldade em três estágios, encerramento automático, tela de resultado, precisão e melhor pontuação persistente.

Na Sprint 7, os quatro arcos originais e suas flechas foram implementados com visuais e atributos próprios. Essa progressão foi posteriormente ampliada para dez níveis oficiais.

Na Sprint 8, a vitrine virou uma loja: compras sequenciais, validação do saldo, equipamento, desconto de moedas e persistência dos arcos desbloqueados.

Na Sprint 9, entraram os Patos Azul, Vermelho, Roxo, Dourado e Rei. Eles possuem velocidades, movimentos, resistências, tamanhos, raridades e recompensas diferentes.

Na Sprint 10, o Canvas recebeu partículas de disparo e impacto, penas, moedas, splash na água, brilho para raridades e confetes na tela de resultado.

Na Sprint 11, o jogo recebeu música procedural, efeitos sonoros, volume geral, controles separados de música/efeitos, mute e persistência das preferências.

Na Sprint 12, o projeto recebeu controles por teclado, foco acessível, orientação mobile, preferência por movimento reduzido, pausa de áudio ao trocar de aba, ajustes responsivos e revisão de performance.

O MVP está completo e pronto para testes de balanceamento e uma futura troca da arte procedural por sprites finais, caso desejado.

## Fase pós-MVP

Na Sprint 1 de testes e balanceamento, o jogo ganhou um **Diário de Treino**. As dez partidas mais recentes ficam salvas localmente com pontuação, precisão, acertos, disparos e arco utilizado. O painel calcula médias e mostra o arco favorito, enquanto a tela de resultado oferece uma mensagem curta de incentivo. Esses dados permitem ajustar a dificuldade e as recompensas a partir de partidas reais em família.

Na Sprint 14 de arte definitiva, o cenário procedural foi substituído por um vale ilustrado original, e o arqueiro, os seis Patos-Alvo e os quatro visuais-base de arco receberam sprites próprios em estilo cartoon. Os dez níveis reutilizam e recolorem esses visuais-base enquanto artes exclusivas não são produzidas. O renderizador mantém a arte procedural anterior como fallback durante o carregamento.

No polimento da Sprint 14, a orientação dos arcos foi corrigida e os patos receberam animação de voo em dois quadros, com asas altas/baixas e sem pés. A colisão com a água agora considera a intenção original do disparo: somente tiros apontados para baixo podem gerar splash, e a flecha precisa atravessar a superfície do lago.

O segundo passe de balanceamento tornou a gravidade mais forte e vinculou velocidade/alcance à carga do disparo: cliques rápidos agora caem cedo, enquanto a carga máxima consegue atravessar o cenário. A vida dos Patos-Alvo passou para 2/3/4/6/8/12 e os atributos dos equipamentos permanecem centralizados para balanceamento.

No terceiro passe, a curva de força ficou ainda mais exigente e cada flecha ganhou tempo de voo proporcional à carga. As cadências foram reduzidas para 0,8/1,05/1,35/1,7 disparos por segundo e os multiplicadores de velocidade dos arcos foram suavizados. Pontos e moedas também foram reduzidos para alongar a progressão até o Lendário. O arqueiro agora possui três quadros de preparação: encaixe da flecha, meia puxada e ancoragem completa junto ao rosto.

O menu e a tela de resultado receberam placas ilustradas próprias, inspiradas na composição visual original do projeto. O título permanece como texto HTML sobre a arte, garantindo a grafia exata **Pato ao Alvo**. O menu secundário segue a ordem Ajustes, Treino e Loja; o painel final apresenta “VOCÊ VENCEU!” e o botão “Continuar”.

A progressão de equipamentos foi ampliada para dez pares de arco e flecha: Madeira, Reforçado, Caçador, Ferro, Flamejante, Congelante, Elétrico, Cristal, Lendário e Supremo. Velocidade, precisão, dano, alcance e cadência já evoluem por nível. Os poderes especiais de fogo, gelo, corrente elétrica e demais materiais estão representados e preparados na configuração, mas permanecem desativados até suas mecânicas serem implementadas.

As dez flechas possuem identidade visual própria quando estão encaixadas, em voo e no impacto. Madeira gera lascas; Reforçada, fragmentos metálicos; Caçador, folhas; Ferro, anéis pesados; Fogo, brasas; Gelo, flocos; Elétrica, raios; Cristal, estilhaços; Lendária, estrelas; e Suprema, uma explosão dourada. Esses efeitos são exclusivamente visuais nesta versão e não aplicam estados adicionais aos patos.

## Executar com Docker (recomendado nesta máquina)

Na raiz do projeto:

```powershell
docker compose up --build
```

Abra <http://localhost:8080>.

Para encerrar:

```powershell
docker compose down
```

## Executar com PHP instalado

Use o roteador embutido a partir da raiz:

```powershell
php -S localhost:8080 -t public
```

Depois abra <http://localhost:8080>.

## Verificações locais

O Node.js já disponível na máquina executa as verificações sem instalar pacotes:

```powershell
npm run check
npm test
```

Endpoint inicial de diagnóstico: <http://localhost:8080/api/health.php>.

## Publicação na Oracle Cloud

A configuração de produção está em `compose.prod.yaml` e mantém o container
disponível somente em `127.0.0.1:8081`, pronto para receber tráfego do proxy
HTTPS do servidor. Consulte o roteiro em `docs/DEPLOY-ORACLE.md`.

## Estrutura

```text
config/              configuração central do jogo
public/              raiz pública do servidor
  api/               endpoints PHP/JSON
  css/               interface visual
  js/                loop, renderização, estado e entrada
storage/             persistência futura do backend
tests/               testes de regras fora do Canvas
```

As decisões e o roadmap completo permanecem em `Pato_ao_Alvo_Documento_Mestre.md`.
