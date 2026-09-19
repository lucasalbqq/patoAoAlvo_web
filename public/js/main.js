import { GAME_CONFIG } from './config.js';
import { Game } from './game.js';
import { AudioSystem } from './systems/AudioSystem.js';
import { BalanceTracker } from './systems/BalanceTracker.js';

const elements = {
    canvas: document.querySelector('#game-canvas'),
    menu: document.querySelector('#menu-screen'),
    demoHud: document.querySelector('#demo-hud'),
    play: document.querySelector('#play-button'),
    back: document.querySelector('#back-button'),
    shop: document.querySelector('#shop-button'),
    settings: document.querySelector('#settings-button'),
    toast: document.querySelector('#toast'),
    bestScore: document.querySelector('#best-score'),
    totalCoins: document.querySelector('#total-coins'),
    roundScore: document.querySelector('#round-score'),
    roundCoins: document.querySelector('#round-coins'),
    roundTime: document.querySelector('#round-time'),
    difficulty: document.querySelector('#difficulty-label'),
    resultScreen: document.querySelector('#result-screen'),
    resultScore: document.querySelector('#result-score'),
    resultCoins: document.querySelector('#result-coins'),
    resultBest: document.querySelector('#result-best'),
    resultHits: document.querySelector('#result-hits'),
    resultAccuracy: document.querySelector('#result-accuracy'),
    replay: document.querySelector('#replay-button'),
    resultShop: document.querySelector('#result-shop-button'),
    resultMenu: document.querySelector('#result-menu-button'),
    arsenalScreen: document.querySelector('#arsenal-screen'),
    arsenalList: document.querySelector('#arsenal-list'),
    arsenalClose: document.querySelector('#arsenal-close-button'),
    equippedBowName: document.querySelector('#equipped-bow-name'),
    shopBalance: document.querySelector('#shop-balance'),
    settingsScreen: document.querySelector('#settings-screen'),
    settingsClose: document.querySelector('#settings-close-button'),
    volumeSlider: document.querySelector('#volume-slider'),
    volumeValue: document.querySelector('#volume-value'),
    musicToggle: document.querySelector('#music-toggle'),
    effectsToggle: document.querySelector('#effects-toggle'),
    muteButton: document.querySelector('#mute-button'),
    training: document.querySelector('#training-button'),
    trainingScreen: document.querySelector('#training-screen'),
    trainingClose: document.querySelector('#training-close-button'),
    trainingClear: document.querySelector('#training-clear-button'),
    trainingRounds: document.querySelector('#training-rounds'),
    trainingAverageScore: document.querySelector('#training-average-score'),
    trainingAverageAccuracy: document.querySelector('#training-average-accuracy'),
    trainingTotalHits: document.querySelector('#training-total-hits'),
    trainingFavoriteBow: document.querySelector('#training-favorite-bow'),
    trainingHistory: document.querySelector('#training-history'),
    trainingEmpty: document.querySelector('#training-empty'),
    resultFeedback: document.querySelector('#result-feedback'),
};

const storageKey = 'pato-ao-alvo:progress';
const audioStorageKey = 'pato-ao-alvo:audio';
const trainingStorageKey = 'pato-ao-alvo:training';
const progress = loadProgress();
const audio = new AudioSystem(loadAudioSettings());
const balanceTracker = new BalanceTracker(loadTrainingHistory());
const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const game = new Game(elements.canvas, {
    currentBow: progress.currentBow,
    unlockedBows: progress.unlockedBows,
    initialCoins: progress.coins,
    onStatsChange: updateStats,
    onRoundUpdate: updateRoundHud,
    onRoundEnd: showResult,
    onBowChange: updateBow,
    onSound: (name) => audio.play(name),
    reducedMotion,
});
let toastTimeout;

renderArsenal();

elements.bestScore.textContent = progress.bestScore.toLocaleString('pt-BR');
elements.totalCoins.textContent = progress.coins.toLocaleString('pt-BR');

elements.play.addEventListener('click', startRound);
elements.replay.addEventListener('click', startRound);

elements.back.addEventListener('click', showMenu);
elements.resultMenu.addEventListener('click', showMenu);
elements.training.addEventListener('click', openTraining);
elements.trainingClose.addEventListener('click', showMenu);
elements.trainingClear.addEventListener('click', clearTraining);
document.addEventListener('pointerdown', () => void audio.unlock(), { once: true });
document.addEventListener('click', (event) => {
    if (event.target.closest?.('button')) {
        audio.play('click');
    }
});
document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape' && (game.state.demoRunning
        || !elements.resultScreen.hidden
        || !elements.arsenalScreen.hidden
        || !elements.settingsScreen.hidden
        || !elements.trainingScreen.hidden)) {
        event.preventDefault();
        showMenu();
    }
});
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        audio.stopMusic();
    } else if (game.state.demoRunning) {
        audio.startMusic();
    }
});

function startRound() {
    elements.menu.classList.add('is-hidden');
    elements.resultScreen.hidden = true;
    elements.arsenalScreen.hidden = true;
    elements.settingsScreen.hidden = true;
    elements.trainingScreen.hidden = true;
    elements.demoHud.hidden = false;
    game.setDemoRunning(true);
    audio.startMusic();
    elements.canvas.focus({ preventScroll: true });
}

function showMenu() {
    audio.stopMusic();
    game.setDemoRunning(false);
    elements.demoHud.hidden = true;
    elements.resultScreen.hidden = true;
    elements.arsenalScreen.hidden = true;
    elements.settingsScreen.hidden = true;
    elements.trainingScreen.hidden = true;
    elements.menu.classList.remove('is-hidden');
    elements.play.focus({ preventScroll: true });
}

elements.shop.addEventListener('click', openShop);
elements.resultShop.addEventListener('click', openShop);

function openShop() {
    audio.stopMusic();
    elements.menu.classList.add('is-hidden');
    elements.resultScreen.hidden = true;
    elements.arsenalScreen.hidden = false;
    elements.settingsScreen.hidden = true;
    elements.trainingScreen.hidden = true;
    refreshShopCards();
    elements.arsenalClose.focus({ preventScroll: true });
}
elements.arsenalClose.addEventListener('click', showMenu);
elements.settings.addEventListener('click', openSettings);
elements.settingsClose.addEventListener('click', showMenu);
elements.volumeSlider.addEventListener('input', () => {
    audio.setVolume(Number(elements.volumeSlider.value) / 100);
    syncAudioControls();
    saveAudioSettings();
});
elements.musicToggle.addEventListener('change', () => {
    audio.setMusicEnabled(elements.musicToggle.checked);
    saveAudioSettings();
});
elements.effectsToggle.addEventListener('change', () => {
    audio.setEffectsEnabled(elements.effectsToggle.checked);
    saveAudioSettings();
});
elements.muteButton.addEventListener('click', () => {
    audio.setMuted(!audio.muted);
    syncAudioControls();
    saveAudioSettings();
});

syncAudioControls();

game.start();

function loadProgress() {
    const initial = {
        coins: 0,
        currentBow: 1,
        unlockedBows: [1],
        bestScore: 0,
        bestDistance: 0,
    };

    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (!saved || typeof saved !== 'object') {
            return initial;
        }

        const merged = { ...initial, ...saved };
        const currentBow = Number(merged.currentBow);

        const highestBowLevel = Math.max(...Object.keys(GAME_CONFIG.bows).map(Number));

        return {
            ...merged,
            coins: toNonNegativeInteger(merged.coins),
            currentBow: Number.isInteger(currentBow) && currentBow >= 1 && currentBow <= highestBowLevel
                ? currentBow
                : 1,
            bestScore: toNonNegativeInteger(merged.bestScore),
            bestDistance: toNonNegativeInteger(merged.bestDistance),
            unlockedBows: Array.isArray(merged.unlockedBows) ? merged.unlockedBows : [1],
        };
    } catch {
        return initial;
    }
}

function loadAudioSettings() {
    const defaults = {
        volume: .65,
        muted: false,
        musicEnabled: true,
        effectsEnabled: true,
    };

    try {
        const saved = JSON.parse(localStorage.getItem(audioStorageKey));
        return saved && typeof saved === 'object' ? { ...defaults, ...saved } : defaults;
    } catch {
        return defaults;
    }
}

function loadTrainingHistory() {
    try {
        const saved = JSON.parse(localStorage.getItem(trainingStorageKey));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

function openSettings() {
    audio.stopMusic();
    elements.menu.classList.add('is-hidden');
    elements.resultScreen.hidden = true;
    elements.arsenalScreen.hidden = true;
    elements.settingsScreen.hidden = false;
    elements.trainingScreen.hidden = true;
    syncAudioControls();
    elements.volumeSlider.focus({ preventScroll: true });
}

function syncAudioControls() {
    elements.volumeSlider.value = Math.round(audio.volume * 100);
    elements.volumeValue.textContent = `${Math.round(audio.volume * 100)}%`;
    elements.musicToggle.checked = audio.musicEnabled;
    elements.effectsToggle.checked = audio.effectsEnabled;
    elements.muteButton.textContent = audio.muted ? '🔇 Ativar som' : '🔊 Silenciar';
    elements.muteButton.setAttribute('aria-pressed', String(audio.muted));
}

function saveAudioSettings() {
    try {
        localStorage.setItem(audioStorageKey, JSON.stringify(audio.getSettings()));
    } catch {
        // As preferências permanecem ativas durante a sessão.
    }
}

function toNonNegativeInteger(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? Math.floor(number) : 0;
}

function updateStats({ score, coinsEarned, totalCoins }) {
    elements.roundScore.textContent = score.toLocaleString('pt-BR');
    elements.roundCoins.textContent = coinsEarned.toLocaleString('pt-BR');
    elements.totalCoins.textContent = totalCoins.toLocaleString('pt-BR');
    elements.shopBalance.textContent = totalCoins.toLocaleString('pt-BR');
    progress.coins = totalCoins;
    refreshShopCards();

    saveProgress();
}

function updateRoundHud({ timeRemaining, difficulty }) {
    elements.roundTime.textContent = timeRemaining.toLocaleString('pt-BR');
    elements.difficulty.textContent = difficulty;
    elements.roundTime.closest('.hud-pill').classList.toggle('is-urgent', timeRemaining <= 10);
}

function updateBow({ level, bow, unlockedBows }) {
    elements.equippedBowName.textContent = bow.name;
    progress.currentBow = level;
    progress.unlockedBows = [...unlockedBows];
    saveProgress();
    refreshShopCards();
}

function renderArsenal() {
    Object.entries(GAME_CONFIG.bows).forEach(([level, bow]) => {
        const card = document.createElement('article');
        card.className = `arsenal-card arsenal-card--${level}`;
        card.dataset.level = level;
        card.style.setProperty('--bow-color', bow.color);
        card.style.setProperty('--bow-sprite-filter', bow.spriteFilter ?? 'none');

        const icon = document.createElement('div');
        icon.className = 'arsenal-card__icon';
        const spriteFrame = Math.min(4, Math.max(1, Number(bow.spriteFrame) || 1));
        icon.style.backgroundPosition = `${((spriteFrame - 1) / 3) * 100}% center`;
        icon.setAttribute('aria-hidden', 'true');

        const title = document.createElement('h3');
        title.textContent = bow.name;

        const description = document.createElement('p');
        description.textContent = bow.description;

        const arrow = document.createElement('div');
        arrow.className = 'arsenal-card__arrow';
        arrow.innerHTML = `<strong>${bow.arrowName}</strong><span>${bow.effectLabel}</span>`;

        const price = document.createElement('div');
        price.className = 'arsenal-card__price';
        price.textContent = Number(bow.price) === 0 ? 'Inicial' : `● ${bow.price.toLocaleString('pt-BR')}`;

        const attributes = document.createElement('div');
        attributes.className = 'arsenal-card__attributes';
        attributes.innerHTML = `
            <span>Dano <strong>${bow.damage}</strong></span>
            <span>Precisão <strong>${Math.round(bow.precision * 100)}%</strong></span>
            <span>Alcance <strong>${Math.round(bow.range * 100)}%</strong></span>
            <span>Velocidade <strong>${Math.round(bow.arrowSpeed * 100)}%</strong></span>
            <span>Cadência <strong>${Number(bow.shotsPerSecond).toLocaleString('pt-BR')}/s</strong></span>
        `;

        const button = document.createElement('button');
        button.className = 'game-button arsenal-card__button';
        button.type = 'button';
        button.textContent = 'Carregando';
        button.addEventListener('click', () => handleBowAction(Number(level)));

        card.append(icon, title, arrow, description, price, attributes, button);
        elements.arsenalList.append(card);
    });

    refreshShopCards();
}

function handleBowAction(level) {
    if (progress.unlockedBows.includes(level)) {
        if (game.setCurrentBow(level)) {
            showToast(`${GAME_CONFIG.bows[level].name} equipado! 🏹`);
        }
        return;
    }

    const result = game.buyBow(level);

    if (result.success) {
        audio.play('buy');
        showToast(`${GAME_CONFIG.bows[level].name} desbloqueado! 🎉`);
    } else if (result.reason === 'insufficient-coins') {
        audio.play('blocked');
        showToast(`Faltam ${(result.price - result.balance).toLocaleString('pt-BR')} moedas.`);
    } else if (result.reason === 'previous-bow-required') {
        audio.play('blocked');
        showToast('Desbloqueie o arco anterior primeiro.');
    }
}

function refreshShopCards() {
    if (!elements.arsenalList.children.length) {
        return;
    }

    elements.arsenalList.querySelectorAll('[data-level]').forEach((card) => {
        const level = Number(card.dataset.level);
        const bow = GAME_CONFIG.bows[level];
        const equipped = progress.currentBow === level;
        const unlocked = progress.unlockedBows.includes(level);
        const previousUnlocked = level === 1 || progress.unlockedBows.includes(level - 1);
        const button = card.querySelector('button');

        card.classList.toggle('is-equipped', equipped);
        card.classList.toggle('is-locked', !unlocked && !previousUnlocked);
        card.classList.toggle('is-available', !unlocked && previousUnlocked);

        if (equipped) {
            button.textContent = 'Equipado';
            button.disabled = true;
        } else if (unlocked) {
            button.textContent = 'Equipar';
            button.disabled = false;
        } else if (previousUnlocked) {
            button.textContent = `Comprar · ${bow.price.toLocaleString('pt-BR')}`;
            button.disabled = false;
        } else {
            button.textContent = 'Bloqueado';
            button.disabled = true;
        }
    });
}

function showResult({ score, coinsEarned, hits, shots }) {
    audio.stopMusic();
    progress.bestScore = Math.max(progress.bestScore, score);
    saveProgress();

    elements.bestScore.textContent = progress.bestScore.toLocaleString('pt-BR');
    elements.resultScore.textContent = score.toLocaleString('pt-BR');
    elements.resultCoins.textContent = coinsEarned.toLocaleString('pt-BR');
    elements.resultBest.textContent = progress.bestScore.toLocaleString('pt-BR');
    elements.resultHits.textContent = hits.toLocaleString('pt-BR');
    const trainingEntry = balanceTracker.record({
        score,
        coinsEarned,
        hits,
        shots,
        bowLevel: game.state.currentBow,
    });
    elements.resultAccuracy.textContent = `${trainingEntry.accuracy}%`;
    elements.resultFeedback.textContent = balanceTracker.getFeedback(trainingEntry);
    saveTrainingHistory();
    elements.demoHud.hidden = true;
    elements.resultScreen.hidden = false;
    elements.replay.focus({ preventScroll: true });
}

function openTraining() {
    audio.stopMusic();
    elements.menu.classList.add('is-hidden');
    elements.resultScreen.hidden = true;
    elements.arsenalScreen.hidden = true;
    elements.settingsScreen.hidden = true;
    elements.trainingScreen.hidden = false;
    renderTraining();
    elements.trainingClose.focus({ preventScroll: true });
}

function renderTraining() {
    const summary = balanceTracker.getSummary();
    elements.trainingRounds.textContent = summary.rounds.toLocaleString('pt-BR');
    elements.trainingAverageScore.textContent = summary.averageScore.toLocaleString('pt-BR');
    elements.trainingAverageAccuracy.textContent = `${summary.averageAccuracy}%`;
    elements.trainingTotalHits.textContent = summary.totalHits.toLocaleString('pt-BR');
    elements.trainingFavoriteBow.textContent = GAME_CONFIG.bows[summary.favoriteBow]?.name ?? 'Arco de Madeira';
    elements.trainingHistory.replaceChildren();
    elements.trainingEmpty.hidden = balanceTracker.history.length > 0;

    balanceTracker.history.forEach((entry, index) => {
        const item = document.createElement('li');
        const bowName = GAME_CONFIG.bows[entry.bowLevel]?.name ?? 'Arco de Madeira';
        item.innerHTML = `
            <span class="training-history__position">#${index + 1}</span>
            <span><strong>${entry.score.toLocaleString('pt-BR')} pts</strong><small>${bowName}</small></span>
            <span><strong>${entry.accuracy}%</strong><small>precisão</small></span>
            <span><strong>${entry.hits}/${entry.shots}</strong><small>acertos/tiros</small></span>
        `;
        elements.trainingHistory.append(item);
    });
}

function clearTraining() {
    if (balanceTracker.history.length === 0) {
        showToast('O diário já está vazio.');
        return;
    }

    balanceTracker.clear();
    saveTrainingHistory();
    renderTraining();
    showToast('Diário de treino limpo.');
}

function saveTrainingHistory() {
    try {
        localStorage.setItem(trainingStorageKey, JSON.stringify(balanceTracker));
    } catch {
        // O histórico permanece disponível durante a sessão.
    }
}

function saveProgress() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
        // O jogo continua funcionando mesmo quando o armazenamento está bloqueado.
    }
}

function showToast(message) {
    clearTimeout(toastTimeout);
    elements.toast.textContent = message;
    elements.toast.classList.add('is-visible');
    toastTimeout = setTimeout(() => elements.toast.classList.remove('is-visible'), 2400);
}

console.info(`${GAME_CONFIG.title} v${GAME_CONFIG.version} iniciado.`);
