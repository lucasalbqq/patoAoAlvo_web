# Pato ao Alvo --- Documento Mestre do Projeto

## 1. Visão geral

**Nome oficial:** Pato ao Alvo

**Tipo:** jogo 2D casual de tiro com arco, focado em partidas rápidas e
progressão simples.

**Plataforma inicial:** navegador (Web), com desenvolvimento usando PHP
no backend.

**Objetivo do projeto:** criar um jogo simples, divertido e rápido de
evoluir, com uma experiência semelhante em simplicidade e acessibilidade
aos jogos casuais 2D populares, mas com identidade visual e mecânicas
próprias.

### Conceito

O jogador controla um arqueiro que precisa mirar e disparar flechas
contra **Patos-Alvo** que aparecem e se movimentam pelo cenário.

Quanto mais Patos-Alvo o jogador acerta, maior sua pontuação e maior a
quantidade de moedas obtida. As moedas podem ser usadas para comprar
melhorias de arco e flecha.

O jogo deve ser fácil de entender nos primeiros segundos, mas ter
progressão suficiente para incentivar novas partidas.

------------------------------------------------------------------------

# 2. Identidade do jogo

## Nome

**Pato ao Alvo**

O nome deve aparecer de forma consistente em:

-   Logo
-   Tela inicial
-   Menu
-   Loja
-   Tela de vitória
-   Tela de Game Over
-   Título da página
-   Metadados básicos do projeto

Não utilizar mais o nome anterior "MathuPomo".

## Tema visual

O jogo deve ter aparência:

-   2D
-   Cartoon
-   Colorida
-   Alegre
-   Simples
-   Com personagens carismáticos
-   Com contornos bem definidos
-   Fácil de reconhecer em telas pequenas
-   Inspirada em jogos casuais, sem copiar personagens ou artes de jogos
    existentes

### Direção artística

O visual de referência definido para o projeto possui:

-   Cenários naturais com céu azul, montanhas, árvores, água e
    plataformas de terra/grama.
-   Arqueiro com aparência aventureira e simpática.
-   Patos com formas arredondadas e expressões exageradas.
-   Arcos visualmente diferentes conforme o nível.
-   Flechas correspondentes a cada arco.
-   Moedas douradas.
-   Interface com botões grandes e fáceis de tocar/clicar.
-   Efeitos de partículas para tiros e acertos.

------------------------------------------------------------------------

# 3. Personagens

## 3.1 Arqueiro

O personagem principal é um arqueiro.

Ele precisa ter, no mínimo, estas animações/estados:

1.  Parado
2.  Preparando o tiro
3.  Puxando o arco
4.  Mirando
5.  Disparando
6.  Recuando após o disparo
7.  Animação de movimento, se o design final utilizar movimentação
8.  Vitória
9.  Derrota

O personagem deve permanecer visualmente consistente em todas as telas.

------------------------------------------------------------------------

# 4. Inimigos --- Patos-Alvo

Os inimigos principais são chamados de **Patos-Alvo**.

Eles são patos estilizados em formato cartoon.

Os Patos-Alvo devem parecer claramente patos, mas podem possuir cores,
roupas, acessórios e expressões diferentes.

## Tipos iniciais

O jogo deve começar com uma quantidade pequena de tipos e permitir
expansão futura.

### Pato Comum

-   Mais frequente.
-   Velocidade normal.
-   Recompensa básica.

### Pato Azul

-   Mais rápido.
-   Recompensa maior.

### Pato Vermelho

-   Mais agressivo/desafiador.
-   Pode possuir movimento mais imprevisível.
-   Recompensa maior.

### Pato Roxo

-   Mais resistente ou mais difícil de acertar.
-   Recompensa maior.

### Pato Dourado

-   Raro.
-   Recompensa alta em moedas.

### Pato Rei

-   Muito raro.
-   Pode funcionar como alvo especial ou mini-boss.
-   Recompensa muito alta.

### Pato Fantasma

-   Tipo especial opcional.
-   Pode possuir comportamento ou aparência diferente.

### Pato Ninja

-   Tipo especial opcional.
-   Pode ser mais rápido e difícil de acertar.

**Importante:** os tipos especiais não precisam estar todos disponíveis
na primeira versão. A primeira versão deve priorizar um jogo jogável e
simples.

------------------------------------------------------------------------

# 5. Comportamento dos Patos-Alvo

Os patos devem aparecer na área de jogo e atravessar ou ocupar regiões
do cenário.

Comportamentos possíveis:

-   Voar horizontalmente.
-   Subir.
-   Descer.
-   Mudar levemente de direção.
-   Aparecer em alturas diferentes.
-   Acelerar em tipos mais difíceis.
-   Fazer movimentos especiais em tipos raros.

Cada pato deve possuir:

-   Posição X/Y
-   Velocidade
-   Direção
-   Tipo
-   Vida ou resistência, quando aplicável
-   Valor de pontuação
-   Valor de recompensa
-   Estado de animação
-   Estado de vida/morte

------------------------------------------------------------------------

# 6. Sistema de tiro

O jogador deve mirar e disparar uma flecha.

## Fluxo básico

1.  O jogador aponta.
2.  O sistema calcula a direção da flecha.
3.  O jogador dispara.
4.  A flecha recebe velocidade.
5.  A flecha percorre o cenário.
6.  O sistema verifica colisão.
7.  Se atingir um Pato-Alvo:
    -   reproduzir efeito de impacto;
    -   aumentar pontuação;
    -   conceder moedas;
    -   executar animação do pato;
    -   remover o pato ou diminuir sua vida.
8.  Se errar:
    -   a flecha continua seu trajeto;
    -   pode sair da tela;
    -   pode desaparecer após determinado tempo/distância.

------------------------------------------------------------------------

# 7. Física da flecha

A primeira versão pode utilizar física simplificada.

Cada flecha deve possuir:

-   posição;
-   velocidade horizontal;
-   velocidade vertical;
-   gravidade;
-   direção;
-   dano;
-   alcance máximo;
-   tipo de flecha.

A trajetória pode utilizar uma curva parabólica simples.

Não é necessário implementar física extremamente realista na primeira
versão.

O objetivo é que o tiro seja:

-   fácil de entender;
-   previsível;
-   divertido;
-   responsivo.

------------------------------------------------------------------------

# 8. Sistema de pontuação

Cada Pato-Alvo possui um valor de pontos.

Exemplo inicial:

  Pato         Pontos
  ---------- --------
  Comum            10
  Azul             15
  Vermelho         20
  Roxo             30
  Dourado          50
  Rei             100

Esses valores devem ficar configuráveis no código para facilitar
balanceamento.

A pontuação da partida começa em zero.

A cada acerto:

`pontuação += valor_do_pato`

------------------------------------------------------------------------

# 9. Sistema de moedas

O jogador ganha moedas ao acertar Patos-Alvo.

As moedas são a principal moeda de progressão.

Exemplo inicial:

  Pato         Moedas
  ---------- --------
  Comum            10
  Azul             15
  Vermelho         20
  Roxo             30
  Dourado          50
  Rei             100

Os valores devem ser configuráveis.

As moedas devem aparecer:

-   Durante a partida, no HUD.
-   Na loja.
-   Após a partida.
-   No menu principal, quando houver saldo persistente.

------------------------------------------------------------------------

# 10. Progressão de arcos

O jogo terá **exatamente 4 níveis de arco** na versão definida do
projeto.

Não criar uma progressão infinita de arcos.

## Arco nível 1 --- Básico

-   Equipamento inicial.
-   Dano básico.
-   Precisão básica.
-   Alcance básico.
-   Flecha básica.

## Arco nível 2 --- Melhorado

-   Mais precisão.
-   Maior alcance.
-   Melhor desempenho geral.
-   Flecha melhorada.

## Arco nível 3 --- Épico

-   Grande melhoria de precisão.
-   Maior alcance.
-   Maior dano.
-   Flecha épica.

## Arco nível 4 --- Lendário

-   Melhor arco disponível.
-   Maior precisão.
-   Maior alcance.
-   Maior dano.
-   Flecha lendária.

### Regra

O jogador começa com o Arco Nível 1.

Para desbloquear o próximo arco, precisa pagar moedas.

Sugestão inicial de preços:

  Arco                Preço
  ----------- -------------
  Básico             Grátis
  Melhorado      300 moedas
  Épico          800 moedas
  Lendário      1500 moedas

Os preços devem ficar configuráveis para balanceamento.

------------------------------------------------------------------------

# 11. Flechas

Cada arco deve possuir uma flecha visualmente correspondente.

## Flecha nível 1 --- Básica

-   Madeira.
-   Ponta simples.
-   Dano básico.

## Flecha nível 2 --- Melhorada

-   Visual mais elaborado.
-   Maior velocidade ou estabilidade.
-   Dano maior.

## Flecha nível 3 --- Épica

-   Visual dourado/energizado.
-   Maior velocidade.
-   Maior dano.

## Flecha nível 4 --- Lendária

-   Visual roxo/mágico.
-   Maior velocidade.
-   Maior alcance.
-   Maior dano.

A flecha equipada deve mudar automaticamente de acordo com o arco
selecionado.

------------------------------------------------------------------------

# 12. Atributos dos arcos

Cada arco deve ter atributos configuráveis:

-   `damage`
-   `precision`
-   `range`
-   `arrowSpeed`
-   `price`

Exemplo conceitual:

``` text
Arco 1:
dano = 1
precisão = 1.0
alcance = 1.0
velocidade = 1.0

Arco 2:
dano = 2
precisão = 1.15
alcance = 1.20
velocidade = 1.10

Arco 3:
dano = 3
precisão = 1.30
alcance = 1.45
velocidade = 1.25

Arco 4:
dano = 4
precisão = 1.50
alcance = 1.75
velocidade = 1.40
```

Os valores acima são apenas valores iniciais de balanceamento.

------------------------------------------------------------------------

# 13. Loja

A loja permite comprar e equipar os quatro arcos.

A loja deve mostrar:

-   Nome do arco.
-   Nível.
-   Imagem do arco.
-   Imagem da flecha.
-   Dano.
-   Precisão.
-   Alcance.
-   Velocidade.
-   Preço.
-   Estado:
    -   Equipado
    -   Comprar
    -   Bloqueado
    -   Disponível

## Regras

O jogador não pode comprar um arco se não possuir moedas suficientes.

Ao comprar um arco:

1.  Subtrair moedas.
2.  Marcar o arco como desbloqueado.
3.  Permitir equipá-lo.
4.  Salvar a progressão.

------------------------------------------------------------------------

# 14. Gameplay principal

A partida deve ser simples.

## Início

1.  Jogador clica em "Jogar".
2.  O cenário é carregado.
3.  O arqueiro aparece.
4.  Os Patos-Alvo começam a surgir.
5.  O contador começa.

## Durante a partida

O jogador:

-   mira;
-   dispara;
-   acerta patos;
-   ganha pontos;
-   ganha moedas;
-   tenta melhorar sua distância/pontuação.

## Fim da partida

A partida termina quando a condição definida pelo modo de jogo for
atingida.

A primeira versão pode utilizar uma destas condições:

### Opção recomendada para MVP

Partida por tempo.

Exemplo:

-   60 segundos por partida.
-   Quanto mais patos acertar, maior a pontuação.
-   Ao acabar o tempo, mostrar resultado.

A duração deve ser configurável.

------------------------------------------------------------------------

# 15. Distância / recorde

O jogo pode apresentar uma métrica chamada **Melhor Distância**.

Exemplo:

`342 m`

Essa métrica deve representar uma progressão/recorde configurável do
jogo, e não necessariamente uma distância física real.

O sistema deve armazenar:

-   distância atual;
-   melhor distância;
-   pontuação atual;
-   melhor pontuação.

------------------------------------------------------------------------

# 16. HUD

Durante a partida, o HUD deve mostrar:

-   🪙 Moedas
-   ❤️ Vida, caso o sistema de vida seja utilizado
-   🎯 Pontuação
-   📏 Distância/recorde
-   Arco equipado
-   Indicador de carregamento/mira, quando necessário
-   Tempo restante, caso o modo por tempo seja utilizado

A interface deve ser simples e não esconder os Patos-Alvo.

------------------------------------------------------------------------

# 17. Sistema de vida

O sistema pode utilizar uma quantidade simples de vidas.

Exemplo:

❤️ ❤️ ❤️

O jogador pode perder vida caso:

-   deixe passar determinados alvos;
-   seja atingido por um tipo especial;
-   falhe em uma mecânica específica.

Para o MVP, esse sistema pode ser opcional.

------------------------------------------------------------------------

# 18. Efeitos visuais

O jogo deve ter efeitos simples e leves.

## Ao disparar

-   pequeno efeito de movimento;
-   som de arco;
-   trilha ou efeito da flecha, se desejado.

## Ao acertar

-   partículas;
-   pequena explosão/cartoon;
-   penas;
-   brilho;
-   número de pontos;
-   moedas aparecendo.

## Ao acertar na água

-   efeito de splash.

## Ao derrubar um pato

-   animação de queda.

## Ao ganhar

-   partículas;
-   moedas;
-   animação de vitória.

------------------------------------------------------------------------

# 19. Sons

A arquitetura deve permitir sons desde o início, mesmo que os arquivos
sejam adicionados depois.

Sons previstos:

-   Clique de botão.
-   Disparo do arco.
-   Flecha voando.
-   Acerto.
-   Pato atingido.
-   Pato caindo.
-   Moeda ganha.
-   Compra na loja.
-   Compra bloqueada por falta de dinheiro.
-   Vitória.
-   Game Over.

Todos os sons devem poder ser substituídos facilmente por arquivos reais
posteriormente.

------------------------------------------------------------------------

# 20. Cenários

O cenário inicial deve ter:

-   céu azul;
-   nuvens;
-   montanhas;
-   árvores;
-   gramado;
-   plataformas de terra;
-   água;
-   alvos de madeira;
-   elementos decorativos.

O cenário deve ser separado em camadas para permitir movimento/parallax
futuramente.

Estrutura sugerida:

1.  Fundo distante
2.  Montanhas
3.  Árvores
4.  Elementos intermediários
5.  Gameplay
6.  Efeitos
7.  HUD

------------------------------------------------------------------------

# 21. Telas do jogo

## 21.1 Tela inicial

Elementos:

-   Logo "Pato ao Alvo"
-   Botão "Jogar"
-   Botão "Loja"
-   Botão "Configurações"
-   Botão "Conquistas", se implementado
-   Melhor pontuação
-   Moedas atuais

## 21.2 Tela de jogo

Elementos:

-   Cenário
-   Arqueiro
-   Patos
-   Flechas
-   HUD
-   Pontuação
-   Moedas
-   Tempo, se utilizado

## 21.3 Loja

Mostrar os quatro arcos.

## 21.4 Tela de vitória / resultado

Mostrar:

-   "Você venceu!" ou "Fim da partida"
-   Pontuação
-   Moedas ganhas
-   Melhor pontuação
-   Melhor distância
-   Botão "Jogar novamente"
-   Botão "Loja"
-   Botão "Menu"

## 21.5 Game Over

Mostrar:

-   "Game Over"
-   Pontuação
-   Moedas
-   Melhor pontuação
-   Melhor distância
-   Botão "Tentar novamente"
-   Botão "Menu"

------------------------------------------------------------------------

# 22. Controles

## Desktop

Mouse:

-   Mover mouse = mirar.
-   Clique/pressionar = preparar/disparar.
-   Soltar = disparar, caso o sistema use carregamento.

## Mobile

Toque e arraste:

-   Arrastar = mirar.
-   Soltar = disparar.

O sistema deve ser preparado para funcionar tanto com mouse quanto com
toque.

------------------------------------------------------------------------

# 23. Arquitetura técnica

## Frontend

O jogo deve rodar no navegador.

Tecnologias sugeridas:

-   HTML5
-   CSS3
-   JavaScript
-   Canvas 2D

PHP será utilizado como backend para persistência e serviços do jogo.

### Importante

PHP não deve tentar desenhar os elementos do jogo quadro a quadro.

A renderização em tempo real deve ficar no JavaScript/Canvas.

PHP deve cuidar de:

-   API;
-   persistência;
-   configurações;
-   progresso;
-   pontuações;
-   moedas persistentes, se desejado;
-   loja/progresso;
-   autenticação futuramente, caso seja necessária.

------------------------------------------------------------------------

# 24. Arquitetura sugerida de pastas

``` text
pato-ao-alvo/
│
├── public/
│   ├── index.php
│   ├── game.php
│   ├── assets/
│   │   ├── images/
│   │   ├── sprites/
│   │   ├── backgrounds/
│   │   ├── bows/
│   │   ├── arrows/
│   │   ├── ducks/
│   │   ├── ui/
│   │   ├── effects/
│   │   └── audio/
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── main.js
│       ├── game.js
│       ├── renderer.js
│       ├── input.js
│       ├── physics.js
│       ├── collision.js
│       ├── entities/
│       │   ├── Archer.js
│       │   ├── Duck.js
│       │   ├── Arrow.js
│       │   └── Bow.js
│       ├── systems/
│       │   ├── SpawnSystem.js
│       │   ├── ScoreSystem.js
│       │   ├── CoinSystem.js
│       │   ├── UpgradeSystem.js
│       │   └── AudioSystem.js
│       └── ui/
│           ├── HUD.js
│           ├── Menu.js
│           ├── Shop.js
│           └── ResultScreen.js
│
├── src/
│   ├── Config/
│   ├── Controllers/
│   ├── Services/
│   ├── Models/
│   └── Repositories/
│
├── api/
│   ├── game/
│   ├── player/
│   ├── shop/
│   └── score/
│
├── config/
│   └── game.php
│
├── database/
│   └── schema.sql
│
├── tests/
│
├── composer.json
├── .env.example
├── .gitignore
└── README.md
```

Essa estrutura pode ser simplificada durante o MVP, desde que a
separação entre frontend do jogo e backend PHP seja mantida.

------------------------------------------------------------------------

# 25. Estado do jogo

Criar um estado centralizado.

Exemplo:

``` javascript
gameState = {
    running: false,
    paused: false,
    score: 0,
    coins: 0,
    timeRemaining: 60,
    distance: 0,
    bestScore: 0,
    bestDistance: 0,
    currentBow: 1,
    unlockedBows: [1],
    ducks: [],
    arrows: []
};
```

Não espalhar estado crítico por dezenas de arquivos.

------------------------------------------------------------------------

# 26. Configuração central

Criar uma configuração central para facilitar balanceamento.

Exemplo:

``` javascript
GAME_CONFIG = {
    roundDuration: 60,

    bows: {
        1: {
            name: "Básico",
            price: 0,
            damage: 1,
            precision: 1.0,
            range: 1.0,
            arrowSpeed: 1.0
        },

        2: {
            name: "Melhorado",
            price: 300,
            damage: 2,
            precision: 1.15,
            range: 1.20,
            arrowSpeed: 1.10
        },

        3: {
            name: "Épico",
            price: 800,
            damage: 3,
            precision: 1.30,
            range: 1.45,
            arrowSpeed: 1.25
        },

        4: {
            name: "Lendário",
            price: 1500,
            damage: 4,
            precision: 1.50,
            range: 1.75,
            arrowSpeed: 1.40
        }
    }
};
```

Os valores devem ser fáceis de alterar.

------------------------------------------------------------------------

# 27. Persistência

A progressão deve poder ser salva.

Para a primeira versão, existem duas possibilidades:

### MVP local

Usar `localStorage` para:

-   moedas;
-   arcos desbloqueados;
-   arco equipado;
-   melhor pontuação;
-   melhor distância;
-   configurações.

### Backend PHP

Quando houver necessidade de persistência em servidor:

-   PHP + banco de dados;
-   API JSON;
-   salvar progresso do jogador;
-   salvar pontuações.

A arquitetura deve permitir migrar do localStorage para PHP sem
reescrever o jogo inteiro.

------------------------------------------------------------------------

# 28. API PHP

Criar endpoints simples e claros.

Exemplos:

``` text
GET  /api/player/state
POST /api/player/state
POST /api/game/result
GET  /api/shop/bows
POST /api/shop/buy-bow
POST /api/shop/equip-bow
```

As APIs devem retornar JSON.

Exemplo:

``` json
{
    "success": true,
    "coins": 450,
    "currentBow": 2,
    "unlockedBows": [1, 2]
}
```

------------------------------------------------------------------------

# 29. Segurança

Mesmo sendo um jogo simples, o backend não deve confiar cegamente no
navegador.

Nunca considerar como verdade absoluta valores enviados pelo JavaScript
como:

-   moedas;
-   preço;
-   dano;
-   recompensa;
-   pontuação;
-   arco comprado.

O servidor deve validar operações importantes.

Exemplo:

O cliente solicita:

``` text
comprar arco 3
```

O PHP consulta o preço oficial do arco 3 no servidor e verifica o saldo
antes de efetuar a compra.

------------------------------------------------------------------------

# 30. Banco de dados

Se for utilizado banco de dados, uma estrutura inicial pode conter:

### players

``` text
id
username
coins
current_bow
best_score
best_distance
created_at
updated_at
```

### player_bows

``` text
id
player_id
bow_level
unlocked_at
```

### game_results

``` text
id
player_id
score
coins_earned
distance
created_at
```

O banco deve ser simples no MVP.

------------------------------------------------------------------------

# 31. Performance

O jogo deve ser leve.

Regras:

-   Não criar milhares de objetos por segundo.
-   Reutilizar objetos de flechas quando possível.
-   Remover entidades fora da área de jogo.
-   Evitar operações pesadas dentro do loop principal.
-   Carregar imagens antes de iniciar a partida.
-   Utilizar spritesheets quando fizer sentido.
-   Limitar efeitos de partículas.
-   Utilizar `requestAnimationFrame`.

O objetivo é funcionar bem em computadores simples e celulares.

------------------------------------------------------------------------

# 32. Game Loop

O loop principal deve seguir aproximadamente:

``` text
ler entrada
↓
atualizar tempo
↓
atualizar jogador
↓
atualizar patos
↓
atualizar flechas
↓
aplicar física
↓
verificar colisões
↓
processar pontuação/moedas
↓
atualizar partículas
↓
renderizar
```

Separar atualização da renderização sempre que possível.

------------------------------------------------------------------------

# 33. Colisões

A primeira versão pode utilizar colisões simples.

Por exemplo:

-   círculo contra círculo;
-   retângulo contra retângulo;
-   círculo contra retângulo.

Não é necessário implementar pixel-perfect collision no MVP.

O ponto de colisão deve considerar uma área um pouco menor que o sprite
para tornar o jogo justo.

------------------------------------------------------------------------

# 34. Sistema de spawn

Criar um `SpawnSystem`.

Responsabilidades:

-   decidir quando um pato aparece;
-   escolher o tipo;
-   definir posição;
-   definir direção;
-   definir velocidade;
-   controlar dificuldade.

A dificuldade pode aumentar progressivamente:

``` text
Início:
- patos comuns
- velocidade baixa

Meio:
- patos mais rápidos
- mais variedade

Final:
- tipos especiais
- maior velocidade
- padrões de movimento mais difíceis
```

------------------------------------------------------------------------

# 35. Dificuldade

A dificuldade deve aumentar sem ficar injusta.

Fatores possíveis:

-   quantidade de patos;
-   velocidade;
-   frequência;
-   altura;
-   padrões de movimento;
-   tipos especiais.

Não aumentar tudo ao mesmo tempo.

------------------------------------------------------------------------

# 36. Design de experiência

O jogador deve conseguir:

1.  Abrir o jogo.
2.  Entender o objetivo.
3.  Começar uma partida.
4.  Acertar um pato rapidamente.
5.  Ganhar moedas.
6.  Voltar à loja.
7.  Comprar/equipar um arco.
8.  Jogar novamente.

Esse ciclo é o núcleo do jogo:

``` text
JOGAR
  ↓
ACERTAR PATOS
  ↓
GANHAR MOEDAS
  ↓
COMPRAR MELHORIAS
  ↓
FICAR MAIS FORTE
  ↓
JOGAR NOVAMENTE
```

------------------------------------------------------------------------

# 37. MVP --- primeira versão jogável

O Codex deve priorizar uma versão mínima funcional antes de adicionar
recursos extras.

## O MVP deve conter

-   Tela inicial.
-   Botão Jogar.
-   Cenário 2D.
-   Arqueiro.
-   Mira.
-   Disparo.
-   Flecha.
-   Física básica.
-   Pelo menos um Pato-Alvo.
-   Colisão.
-   Pontuação.
-   Moedas.
-   Game Over/resultado.
-   Um sistema simples de partidas.
-   Quatro arcos definidos no código.
-   Loja básica.
-   Compra de arco.
-   Equipar arco.
-   Flecha correspondente ao arco.
-   Salvamento local.
-   Suporte básico a mouse.
-   Suporte básico a toque.

## Não colocar no MVP

-   Multiplayer.
-   Sistema complexo de contas.
-   Ranking online.
-   dezenas de inimigos.
-   centenas de fases.
-   sistema de clãs.
-   anúncios.
-   microtransações.
-   física extremamente realista.
-   editor de fases.

Primeiro fazer o jogo funcionar.

------------------------------------------------------------------------

# 38. Fases de desenvolvimento

## Sprint 1 --- Fundação

Criar:

-   projeto PHP;
-   estrutura de pastas;
-   página inicial;
-   Canvas;
-   CSS base;
-   JavaScript base;
-   configuração do jogo;
-   loop principal.

**Resultado:** projeto abre no navegador e possui um Canvas funcionando.

------------------------------------------------------------------------

## Sprint 2 --- Arqueiro e mira

Criar:

-   arqueiro;
-   posição;
-   mira;
-   controles mouse;
-   controles touch;
-   animação básica.

**Resultado:** jogador consegue mirar.

------------------------------------------------------------------------

## Sprint 3 --- Flecha

Criar:

-   Arrow;
-   disparo;
-   trajetória;
-   gravidade;
-   velocidade;
-   alcance;
-   desaparecimento fora da área.

**Resultado:** jogador consegue atirar.

------------------------------------------------------------------------

## Sprint 4 --- Primeiro Pato-Alvo

Criar:

-   Pato Comum;
-   spawn;
-   movimento;
-   animação;
-   colisão com flecha;
-   morte.

**Resultado:** jogador consegue acertar o primeiro pato.

------------------------------------------------------------------------

## Sprint 5 --- Pontuação e moedas

Criar:

-   score system;
-   coin system;
-   recompensas;
-   HUD.

**Resultado:** acertar patos gera pontos e moedas.

------------------------------------------------------------------------

## Sprint 6 --- Partida completa

Criar:

-   início da partida;
-   tempo;
-   dificuldade progressiva;
-   fim da partida;
-   tela de resultado;
-   melhor pontuação.

**Resultado:** ciclo completo de jogo.

------------------------------------------------------------------------

## Sprint 7 --- Quatro arcos e quatro flechas

Criar:

-   Arco Básico;
-   Arco Melhorado;
-   Arco Épico;
-   Arco Lendário;
-   flecha correspondente a cada arco;
-   atributos configuráveis.

**Resultado:** sistema de progressão funcionando.

------------------------------------------------------------------------

## Sprint 8 --- Loja

Criar:

-   loja;
-   preços;
-   compra;
-   equipar;
-   bloqueio por falta de moedas;
-   persistência.

**Resultado:** jogador consegue evoluir.

------------------------------------------------------------------------

## Sprint 9 --- Variedade de Patos-Alvo

Adicionar:

-   Pato Azul;
-   Pato Vermelho;
-   Pato Roxo;
-   Pato Dourado;
-   Pato Rei.

Depois, se necessário:

-   Pato Fantasma;
-   Pato Ninja.

------------------------------------------------------------------------

## Sprint 10 --- Arte e efeitos

Adicionar:

-   sprites finais;
-   cenários;
-   animações;
-   partículas;
-   efeitos de impacto;
-   efeitos de água;
-   ícones;
-   interface final.

------------------------------------------------------------------------

## Sprint 11 --- Áudio

Adicionar:

-   música;
-   efeitos;
-   controle de volume;
-   mute.

------------------------------------------------------------------------

## Sprint 12 --- Polimento

Corrigir:

-   bugs;
-   colisões;
-   responsividade;
-   performance;
-   telas pequenas;
-   controles mobile;
-   carregamento;
-   feedback visual.

------------------------------------------------------------------------

# 39. Regras importantes para o Codex

O Codex deve seguir estas regras durante o desenvolvimento:

1.  Não mudar o nome do jogo.
2.  O nome oficial é **Pato ao Alvo**.
3.  Não criar uma quinta evolução de arco.
4.  O sistema oficial possui 4 níveis de arco.
5.  Cada arco possui sua própria flecha.
6.  Não adicionar funcionalidades grandes sem necessidade.
7.  Priorizar o MVP jogável.
8.  Manter valores de balanceamento centralizados.
9.  Evitar código duplicado.
10. Manter responsabilidades separadas.
11. Criar código simples e legível.
12. Não colocar lógica de jogo importante diretamente em HTML.
13. Usar JavaScript/Canvas para gameplay.
14. Usar PHP para backend e persistência.
15. APIs devem utilizar JSON.
16. Validar no servidor qualquer operação relacionada a moedas e
    compras.
17. Preparar o projeto para expansão futura.
18. Não substituir a identidade visual do jogo por assets genéricos sem
    necessidade.
19. O jogo deve funcionar em desktop e mobile.
20. Cada sprint deve deixar o projeto executável.

------------------------------------------------------------------------

# 40. Critério de conclusão

O projeto inicial será considerado funcional quando:

-   o jogador abrir o jogo;
-   clicar em Jogar;
-   mirar;
-   disparar uma flecha;
-   acertar um Pato-Alvo;
-   receber pontos;
-   receber moedas;
-   terminar uma partida;
-   visualizar o resultado;
-   entrar na loja;
-   comprar um arco;
-   equipar o arco;
-   voltar para a partida;
-   perceber a diferença de desempenho do novo arco;
-   jogar novamente.

------------------------------------------------------------------------

# 41. Próximas expansões possíveis

Depois do MVP, o projeto pode receber:

-   novos cenários;
-   novas espécies de Patos-Alvo;
-   eventos;
-   desafios diários;
-   conquistas;
-   ranking;
-   contas de usuário;
-   salvamento online;
-   novos modos de jogo;
-   chefes;
-   obstáculos;
-   diferentes condições climáticas;
-   sistema de combos;
-   tiro perfeito;
-   recompensas por sequência de acertos.

Esses recursos não devem atrasar a primeira versão jogável.

------------------------------------------------------------------------

# 42. Princípio central do projeto

**Pato ao Alvo deve ser simples de começar, divertido de jogar e
satisfatório de evoluir.**

O núcleo da experiência é:

> **Mirar → Atirar → Acertar → Ganhar moedas → Melhorar o arco → Atirar
> melhor → Buscar uma pontuação maior.**

O desenvolvimento deve sempre proteger esse ciclo.

------------------------------------------------------------------------

# 43. Instrução inicial para o Codex

Ao iniciar o desenvolvimento, o Codex deve:

1.  Ler este documento inteiro.
2.  Criar a estrutura inicial do projeto.
3.  Escolher uma implementação simples e adequada para PHP + HTML5
    Canvas + JavaScript.
4.  Não tentar desenvolver todas as funcionalidades de uma vez.
5.  Começar pelo Sprint 1.
6.  Ao concluir cada sprint, verificar se o projeto continua executável.
7.  Implementar testes básicos para a lógica que possa ser testada fora
    do Canvas.
8.  Manter o código preparado para os próximos sprints.
9.  Não remover funcionalidades já implementadas sem justificativa.
10. Ao encontrar uma decisão não especificada, escolher a solução mais
    simples que preserve o conceito do jogo e documentar a decisão.

**Objetivo imediato:** colocar uma primeira versão jogável no navegador
o mais rápido possível e evoluí-la incrementalmente.
