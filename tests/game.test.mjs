import assert from 'node:assert/strict';
import test from 'node:test';
import { Duck } from '../public/js/entities/Duck.js';

globalThis.window = {
    __GAME_CONFIG__: {
        title: 'Pato ao Alvo',
        version: '1.0.0',
        roundDuration: 60,
        bows: Object.fromEntries(Array.from({ length: 10 }, (_, index) => {
            const level = index + 1;
            return [level, {
                name: level === 1 ? 'Arco de Madeira' : `Arco ${level}`,
                arrowName: level === 1 ? 'Flecha de Madeira' : `Flecha ${level}`,
                price: level === 1 ? 0 : level * 100,
                damage: Math.ceil(level / 2),
                precision: 1 + level * .05,
                range: 1 + level * .05,
                arrowSpeed: 1 + level * .02,
                shotsPerSecond: .7 + level * .1,
                color: '#b96832',
                specialEffect: level >= 5 ? 'planned' : 'none',
                specialEffectEnabled: false,
            }];
        })),
        ducks: {
            common: {
                name: 'Pato Comum',
                points: 10,
                coins: 10,
            },
        },
    },
};

const { Game } = await import('../public/js/game.js');

const canvasStub = {
    width: 1280,
    height: 720,
    getContext: () => ({}),
};

test('o disparo integra arqueiro, arco e flecha', () => {
    const game = new Game(canvasStub);
    game.state.archer.setAimTarget(1000, 200);
    game.state.archer.beginDraw();
    game.state.archer.setCharge(.75);

    game.fireArrow();

    assert.equal(game.state.shots, 1);
    assert.equal(game.state.arrows.length, 1);
    assert.equal(game.state.arrows[0].bowLevel, 1);
    assert.equal(game.state.arrows[0].damage, 1);
});

test('a cadência do arco limita disparos por segundo', () => {
    let currentTime = 1000;
    const game = new Game(canvasStub, { now: () => currentTime });

    assert.equal(game.fireArrow(), true);
    currentTime = 1500;
    assert.equal(game.fireArrow(), false);
    assert.equal(game.state.shots, 1);
    currentTime = 2250;
    assert.equal(game.fireArrow(), true);
    assert.equal(game.state.shots, 2);
});

test('um arco salvo inválido volta com segurança ao arco básico', () => {
    const game = new Game(canvasStub, { currentBow: '__proto__' });

    assert.equal(game.state.currentBow, 1);
    assert.equal(game.state.bow.name, 'Arco de Madeira');
});

test('derrubar um pato integra colisão, pontos, moedas e HUD', () => {
    const updates = [];
    const game = new Game(canvasStub, {
        initialCoins: 50,
        onStatsChange: (stats) => updates.push(stats),
    });
    game.state.ducks = [new Duck({
        x: 500,
        y: 200,
        speed: 0,
        health: 1,
        points: 10,
        coins: 10,
    })];
    game.state.arrows = [{
        previousX: 300,
        previousY: 200,
        x: 600,
        y: 200,
        damage: 1,
        active: true,
    }];

    game.resolveCollisions();

    assert.equal(game.state.score, 10);
    assert.equal(game.state.coinsEarned, 10);
    assert.equal(game.state.totalCoins, 60);
    assert.equal(game.state.rewardPopups.length, 1);
    assert.equal(updates.at(-1).score, 10);
});

test('o fim do tempo encerra controles e entrega o resultado', () => {
    const results = [];
    const game = new Game(canvasStub, { onRoundEnd: (result) => results.push(result) });
    game.setDemoRunning(true);
    game.roundSystem.duration = .1;
    game.roundSystem.timeRemaining = .1;

    const ended = game.updateRound(.2);

    assert.equal(ended, true);
    assert.equal(game.state.demoRunning, false);
    assert.equal(game.state.roundStatus, 'finished');
    assert.equal(results.length, 1);
    assert.equal(results[0].score, 0);
});

test('a loja compra em sequência e permite equipar os dez arcos', () => {
    const game = new Game(canvasStub, { initialCoins: 10000 });

    assert.equal(game.setCurrentBow(10), false);
    assert.equal(game.buyBow(3).reason, 'previous-bow-required');
    for (let level = 2; level <= 10; level += 1) {
        assert.equal(game.buyBow(level).success, true);
    }
    assert.equal(game.state.totalCoins, 4600);
    assert.equal(game.setCurrentBow(10), true);
    assert.equal(game.state.currentBow, 10);
    assert.equal(game.state.bow.damage, 5);
});

test('a loja não compra sem saldo e não permite compras durante a partida', () => {
    const game = new Game(canvasStub, { initialCoins: 199 });

    const insufficient = game.buyBow(2);
    assert.equal(insufficient.success, false);
    assert.equal(insufficient.reason, 'insufficient-coins');
    assert.equal(game.state.totalCoins, 199);

    game.setDemoRunning(true);
    assert.equal(game.buyBow(2).reason, 'round-running');
});

test('a flecha produz splash ao cruzar a área de água', () => {
    const game = new Game(canvasStub, { random: () => .5 });
    game.state.arrows = [{
        previousY: 540,
        y: 560,
        x: 600,
        active: true,
        canHitWater: true,
    }];

    game.resolveEnvironmentCollisions();

    assert.equal(game.state.arrows.length, 0);
    assert.equal(game.particleSystem.particles.length, 16);
    assert.ok(game.particleSystem.particles.every((particle) => particle.shape === 'drop'));
});

test('tiro reto ou para cima não atinge a água ao cair pela gravidade', () => {
    const game = new Game(canvasStub, { random: () => .5 });
    game.state.arrows = [
        { previousY: 540, y: 560, x: 600, active: true, canHitWater: false },
        { previousY: 545, y: 565, x: 700, active: true, canHitWater: false },
    ];

    game.resolveEnvironmentCollisions();

    assert.equal(game.state.arrows.length, 2);
    assert.equal(game.particleSystem.particles.length, 0);
});

test('a dispersão do arco não transforma um tiro reto em tiro para a água', () => {
    const game = new Game(canvasStub, { random: () => 1 });
    game.state.archer.aimAngle = 0;
    game.state.archer.charge = 1;

    game.fireArrow();

    assert.ok(game.state.arrows[0].launchAngle > 0, 'A dispersão deve inclinar a trajetória neste cenário.');
    assert.equal(game.state.arrows[0].canHitWater, false);
});

test('o teclado move a mira e dispara com espaço', () => {
    const game = new Game(canvasStub, { random: () => .5 });
    const event = (code, overrides = {}) => ({
        code,
        repeat: false,
        preventDefault() {},
        ...overrides,
    });
    game.setDemoRunning(true);
    const initialX = game.state.archer.aimTarget.x;

    game.handleKeyDown(event('ArrowRight'));
    assert.ok(game.state.archer.aimTarget.x > initialX);

    game.handleKeyDown(event('Space'));
    assert.equal(game.state.activePointerId, 'keyboard');
    game.handleKeyUp(event('Space'));
    assert.equal(game.state.activePointerId, null);
    assert.equal(game.state.shots, 1);
    assert.equal(game.state.arrows.length, 1);
});

test('movimento reduzido diminui o teto de partículas', () => {
    const game = new Game(canvasStub, { reducedMotion: true });

    assert.equal(game.particleSystem.maxParticles, 70);
});
