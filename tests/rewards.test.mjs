import assert from 'node:assert/strict';
import test from 'node:test';
import { CoinSystem } from '../public/js/systems/CoinSystem.js';
import { ScoreSystem } from '../public/js/systems/ScoreSystem.js';

test('o sistema de pontos acumula a recompensa oficial do pato', () => {
    const system = new ScoreSystem();

    assert.equal(system.awardDuck({ points: 10 }), 10);
    assert.equal(system.awardDuck({ points: 15 }), 15);
    assert.equal(system.score, 25);
    system.reset();
    assert.equal(system.score, 0);
});

test('o sistema de moedas mantém saldo total e saldo da partida', () => {
    const system = new CoinSystem(100);

    assert.equal(system.collectFromDuck({ coins: 10 }), 10);
    assert.equal(system.roundCoins, 10);
    assert.equal(system.totalCoins, 110);
    system.resetRound();
    assert.equal(system.roundCoins, 0);
    assert.equal(system.totalCoins, 110);
});

test('recompensas inválidas não alteram os totais', () => {
    const score = new ScoreSystem();
    const coins = new CoinSystem(-200);

    score.awardDuck({ points: -10 });
    coins.collectFromDuck({ coins: 'inválido' });

    assert.equal(score.score, 0);
    assert.equal(coins.roundCoins, 0);
    assert.equal(coins.totalCoins, 0);
});

test('gastos só acontecem quando há saldo suficiente', () => {
    const coins = new CoinSystem(500);

    assert.equal(coins.spend(300), true);
    assert.equal(coins.totalCoins, 200);
    assert.equal(coins.spend(800), false);
    assert.equal(coins.totalCoins, 200);
});
