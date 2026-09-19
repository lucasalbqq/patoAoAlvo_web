import assert from 'node:assert/strict';
import test from 'node:test';
import { RoundSystem } from '../public/js/systems/RoundSystem.js';

test('a rodada inicia com a duração configurada', () => {
    const round = new RoundSystem(60);
    round.start();

    assert.equal(round.running, true);
    assert.equal(round.timeRemaining, 60);
    assert.equal(round.progress, 0);
});

test('o relógio encerra exatamente em zero', () => {
    const round = new RoundSystem(2);
    round.start();

    assert.equal(round.update(.75), false);
    assert.equal(round.timeRemaining, 1.25);
    assert.equal(round.update(1.5), true);
    assert.equal(round.timeRemaining, 0);
    assert.equal(round.running, false);
    assert.equal(round.progress, 1);
});

test('tempo inválido utiliza sessenta segundos com segurança', () => {
    const round = new RoundSystem(-10);

    assert.equal(round.duration, 60);
});
