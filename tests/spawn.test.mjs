import assert from 'node:assert/strict';
import test from 'node:test';
import { SpawnSystem } from '../public/js/systems/SpawnSystem.js';

const duckConfigs = {
    common: createConfig('Pato Comum'),
    blue: createConfig('Pato Azul', { speedMultiplier: 1.35, movement: 'swift' }),
    red: createConfig('Pato Vermelho', { speedMultiplier: 1.15, movement: 'zigzag' }),
    purple: createConfig('Pato Roxo', { health: 2, movement: 'heavy' }),
    golden: createConfig('Pato Dourado', { health: 2, speedMultiplier: 1.25 }),
    king: createConfig('Pato Rei', { health: 4, speedMultiplier: .75, size: 1.24 }),
};

test('o sistema cria um Pato Comum quando o intervalo termina', () => {
    const system = new SpawnSystem({ random: () => .75, interval: 2, maxDucks: 4 });
    const ducks = [];

    const spawned = system.update(2.1, ducks, duckConfigs);

    assert.ok(spawned);
    assert.equal(spawned.type, 'common');
    assert.equal(spawned.direction, 1);
    assert.equal(ducks.length, 1);
});

test('o sistema respeita o limite de patos voando', () => {
    const system = new SpawnSystem({ random: () => .25, interval: 1, maxDucks: 1 });
    const ducks = [{ active: true, state: 'flying' }];

    const spawned = system.update(1.1, ducks, duckConfigs);

    assert.equal(spawned, null);
    assert.equal(ducks.length, 1);
});

test('a dificuldade evolui em fases sem aumentar tudo de uma vez', () => {
    const system = new SpawnSystem({ interval: 2.4, maxDucks: 4 });

    assert.equal(system.setDifficulty(.1), 'Tranquilo');
    assert.equal(system.speedMultiplier, 1);
    assert.equal(system.maxDucks, 3);

    assert.equal(system.setDifficulty(.5), 'Ritmo aumentado');
    assert.ok(system.interval < 2.4);
    assert.equal(system.speedMultiplier, 1);
    assert.equal(system.maxDucks, 4);

    assert.equal(system.setDifficulty(.9), 'Desafio final');
    assert.equal(system.speedMultiplier, 1.2);
});

test('tipos raros só entram na seleção da fase final', () => {
    const values = [.99, .75, .5, .5, .5, .5, .5];
    const system = new SpawnSystem({ random: () => values.shift() ?? .5 });
    system.setDifficulty(.9);

    const duck = system.createDuck(duckConfigs);

    assert.equal(duck.type, 'king');
    assert.equal(duck.health, 4);
    assert.equal(duck.size, 1.24);
});

test('o início da partida seleciona apenas Comum ou Azul', () => {
    const commonSystem = new SpawnSystem({ random: () => .1 });
    const blueSystem = new SpawnSystem({ random: () => .9 });

    assert.equal(commonSystem.chooseType(), 'common');
    assert.equal(blueSystem.chooseType(), 'blue');
});

function createConfig(name, overrides = {}) {
    return {
        name,
        points: 10,
        coins: 10,
        health: 1,
        speedMultiplier: 1,
        movement: 'wave',
        size: 1,
        bodyColor: '#fff',
        wingColor: '#aaa',
        headColor: '#0a6',
        ...overrides,
    };
}
