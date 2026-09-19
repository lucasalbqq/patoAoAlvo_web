import assert from 'node:assert/strict';
import test from 'node:test';
import { Duck } from '../public/js/entities/Duck.js';

test('o pato voa na direção configurada', () => {
    const duck = createDuck({ direction: -1, speed: 100 });

    duck.update(.5);

    assert.equal(duck.x, 450);
    assert.notEqual(duck.y, duck.baseY);
});

test('o pato atingido entra em queda e depois é removido', () => {
    const duck = createDuck({ y: 700 });

    const defeated = duck.takeDamage(1);
    assert.equal(defeated, true);
    assert.equal(duck.state, 'falling');

    duck.update(1);
    assert.equal(duck.state, 'dead');
    assert.equal(duck.active, false);
});

test('um pato em queda não recebe dano novamente', () => {
    const duck = createDuck();
    duck.takeDamage(1);

    assert.equal(duck.takeDamage(1), false);
});

test('um pato resistente precisa de mais de um acerto', () => {
    const duck = createDuck({ type: 'purple', health: 2 });

    assert.equal(duck.takeDamage(1), false);
    assert.equal(duck.health, 1);
    assert.equal(duck.state, 'flying');
    assert.ok(duck.hitFlash > 0);
    assert.equal(duck.takeDamage(1), true);
    assert.equal(duck.state, 'falling');
});

test('padrões de movimento produzem trajetórias diferentes', () => {
    const wave = createDuck({ movement: 'wave' });
    const zigzag = createDuck({ movement: 'zigzag' });

    wave.update(.25);
    zigzag.update(.25);

    assert.notEqual(wave.y, zigzag.y);
});

function createDuck(overrides = {}) {
    return new Duck({
        x: 500,
        y: 250,
        direction: 1,
        speed: 90,
        waveAmplitude: 12,
        phase: 1,
        ...overrides,
    });
}
