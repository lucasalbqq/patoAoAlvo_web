<?php

declare(strict_types=1);

$gameConfig = require dirname(__DIR__) . '/config/game.php';
$encodedConfig = json_encode(
    $gameConfig,
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR
);
?>
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#073b64">
    <meta name="description" content="Pato ao Alvo — um jogo casual de arco e flecha para toda a família.">
    <title><?= htmlspecialchars($gameConfig['title'], ENT_QUOTES, 'UTF-8') ?></title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="preload" href="/assets/backgrounds/vale-do-alvo.png" as="image">
    <link rel="preload" href="/assets/sprites/arqueiro.png" as="image">
    <link rel="preload" href="/assets/sprites/arqueiro-preparando.png" as="image">
    <link rel="preload" href="/assets/sprites/arqueiro-puxando.png" as="image">
    <link rel="preload" href="/assets/sprites/arqueiro-carga-maxima.png" as="image">
    <link rel="preload" href="/assets/sprites/patos.png" as="image">
    <link rel="preload" href="/assets/sprites/patos-asas-altas.png" as="image">
    <link rel="preload" href="/assets/ui/logo-placa.png" as="image">
    <link rel="preload" href="/assets/ui/painel-vitoria.png" as="image">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <main class="game-shell" aria-label="Pato ao Alvo">
        <canvas id="game-canvas" width="1280" height="720" tabindex="0" aria-label="Cenário do jogo Pato ao Alvo. Use as setas ou WASD para mirar e espaço para disparar."></canvas>

        <header class="topbar">
            <div class="brand-mini" aria-label="Pato ao Alvo">
                <span class="brand-mini__duck">🦆</span>
                <span>Pato ao Alvo</span>
            </div>
            <div class="record-card">
                <span>🏆 Melhor</span>
                <strong id="best-score">0</strong>
            </div>
            <div class="coin-card">
                <span class="coin-icon">●</span>
                <strong id="total-coins">0</strong>
            </div>
        </header>

        <section id="menu-screen" class="screen screen--menu" aria-labelledby="game-title">
            <p class="creator-credit">by Davi Ramos de Souza</p>

            <div class="logo" role="img" aria-label="Logo Pato ao Alvo">
                <span class="logo__pato">Pato</span>
                <span class="logo__ao">ao</span>
                <span class="logo__alvo">Alvo</span>
            </div>

            <p class="tagline">Mire com calma. Acerte em cheio!</p>

            <nav class="menu-actions" aria-label="Menu principal">
                <button id="play-button" class="game-button game-button--play" type="button">
                    <span aria-hidden="true">▶</span> Jogar
                </button>
                <div class="menu-actions__secondary">
                    <button id="settings-button" class="icon-button" type="button" title="Configurações" aria-label="Abrir configurações">
                        ⚙️ <span>Ajustes</span>
                    </button>
                    <button id="training-button" class="icon-button" type="button" title="Ver diário de treino" aria-label="Ver diário de treino">
                        🏆 <span>Treino</span>
                    </button>
                    <button id="shop-button" class="icon-button" type="button" title="Abrir loja de arcos" aria-label="Abrir loja de arcos">
                        🛒 <span>Loja</span>
                    </button>
                </div>
            </nav>
        </section>

        <section id="demo-hud" class="demo-hud" hidden aria-label="Demonstração do cenário">
            <div class="hud-pill"><span>🎯</span><span>Pontos</span><strong id="round-score">0</strong></div>
            <div class="hud-pill"><span class="coin-icon">●</span><span>Partida</span><strong id="round-coins">0</strong></div>
            <div class="hud-pill"><span>⏱️</span><strong id="round-time">60</strong><span>s</span></div>
            <div class="hud-pill hud-pill--difficulty"><strong id="difficulty-label">Tranquilo</strong></div>
            <div class="hud-pill"><span>🏹</span><strong id="equipped-bow-name">Arco de Madeira</strong></div>
            <button id="back-button" class="game-button game-button--small" type="button">← Menu</button>
            <p class="demo-tip">Mouse/toque: segure e solte · Teclado: setas/WASD + espaço</p>
        </section>

        <section id="result-screen" class="screen screen--result" hidden aria-labelledby="result-title" aria-live="polite">
            <div class="result-card">
                <p class="result-card__eyebrow">Tempo encerrado!</p>
                <h2 id="result-title">VOCÊ VENCEU!</h2>
                <div class="result-score">
                    <span>Pontuação</span>
                    <strong id="result-score">0</strong>
                </div>
                <div class="result-grid">
                    <div><span>Moedas</span><strong id="result-coins">0</strong></div>
                    <div><span>Melhor</span><strong id="result-best">0</strong></div>
                    <div><span>Acertos</span><strong id="result-hits">0</strong></div>
                    <div><span>Precisão</span><strong id="result-accuracy">0%</strong></div>
                </div>
                <p id="result-feedback" class="result-feedback">Continue treinando!</p>
                <div class="result-actions">
                    <button id="replay-button" class="game-button game-button--play result-actions__play" type="button">▶ Continuar</button>
                    <button id="result-shop-button" class="game-button game-button--small" type="button">🏹 Loja</button>
                    <button id="result-menu-button" class="game-button game-button--small" type="button">← Menu</button>
                </div>
            </div>
        </section>

        <section id="training-screen" class="screen screen--training" hidden aria-labelledby="training-title">
            <div class="training-panel">
                <div class="training-heading">
                    <div>
                        <p>Acompanhe sua evolução</p>
                        <h2 id="training-title">Diário de Treino</h2>
                    </div>
                    <button id="training-close-button" class="game-button game-button--small" type="button">← Menu</button>
                </div>

                <div class="training-summary" aria-label="Resumo das últimas partidas">
                    <div><span>Partidas</span><strong id="training-rounds">0</strong></div>
                    <div><span>Média</span><strong id="training-average-score">0</strong></div>
                    <div><span>Precisão</span><strong id="training-average-accuracy">0%</strong></div>
                    <div><span>Acertos</span><strong id="training-total-hits">0</strong></div>
                    <div><span>Arco favorito</span><strong id="training-favorite-bow">Arco de Madeira</strong></div>
                </div>

                <div class="training-history-wrap">
                    <h3>Últimas partidas</h3>
                    <ol id="training-history" class="training-history"></ol>
                    <p id="training-empty" class="training-empty">Jogue uma partida para começar seu diário.</p>
                </div>

                <div class="training-actions">
                    <small>Os dados ficam somente neste navegador.</small>
                    <button id="training-clear-button" class="game-button game-button--small" type="button">Limpar diário</button>
                </div>
            </div>
        </section>

        <section id="arsenal-screen" class="screen screen--arsenal" hidden aria-labelledby="arsenal-title">
            <div class="arsenal-panel">
                <div class="arsenal-heading">
                    <div>
                        <p>Melhore seu equipamento</p>
                        <h2 id="arsenal-title">Arcos e Flechas</h2>
                    </div>
                    <div class="shop-balance"><span class="coin-icon">●</span><strong id="shop-balance">0</strong></div>
                    <button id="arsenal-close-button" class="game-button game-button--small" type="button">← Menu</button>
                </div>
                <div id="arsenal-list" class="arsenal-list"></div>
                <p class="arsenal-note">São 10 níveis comprados em sequência. Efeitos elementais especiais chegarão em uma atualização futura.</p>
            </div>
        </section>

        <section id="settings-screen" class="screen screen--settings" hidden aria-labelledby="settings-title">
            <div class="settings-panel">
                <div class="settings-panel__icon" aria-hidden="true">🎵</div>
                <p>Som do jogo</p>
                <h2 id="settings-title">Configurações</h2>

                <label class="volume-control" for="volume-slider">
                    <span>Volume geral</span>
                    <strong id="volume-value">65%</strong>
                </label>
                <input id="volume-slider" type="range" min="0" max="100" step="1" value="65">

                <label class="sound-toggle">
                    <span>🎶 Música</span>
                    <input id="music-toggle" type="checkbox" checked>
                </label>
                <label class="sound-toggle">
                    <span>🏹 Efeitos sonoros</span>
                    <input id="effects-toggle" type="checkbox" checked>
                </label>

                <div class="settings-actions">
                    <button id="mute-button" class="game-button game-button--small" type="button">🔊 Silenciar</button>
                    <button id="settings-close-button" class="game-button game-button--play settings-actions__close" type="button">Pronto</button>
                </div>
                <small>O navegador libera o áudio após o primeiro clique ou toque.</small>
            </div>
        </section>

        <div id="toast" class="toast" role="status" aria-live="polite"></div>
        <aside class="orientation-notice" aria-label="Orientação recomendada">
            <span aria-hidden="true">📱↻</span>
            <strong>Gire o celular</strong>
            <small>O jogo funciona melhor na horizontal.</small>
        </aside>
        <h1 id="game-title" class="sr-only">Pato ao Alvo</h1>
    </main>

    <script>window.__GAME_CONFIG__ = <?= $encodedConfig ?>;</script>
    <script type="module" src="/js/main.js"></script>
</body>
</html>
