import assert from 'node:assert/strict';
import test from 'node:test';
import { BowSystem } from '../public/js/systems/BowSystem.js';

const bowNames = [
    'Arco de Madeira',
    'Arco Reforçado',
    'Arco de Caçador',
    'Arco de Ferro',
    'Arco Flamejante',
    'Arco Congelante',
    'Arco Elétrico',
    'Arco de Cristal',
    'Arco Lendário',
    'Arco Supremo',
];

const bows = Object.fromEntries(
    bowNames.map((name, index) => [index + 1, { name, damage: Math.ceil((index + 1) / 2) }]),
);

test('o sistema contém exatamente os dez níveis oficiais', () => {
    const system = new BowSystem(bows);

    assert.deepEqual(system.levels, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert.equal(system.all.length, 10);
});

test('somente arcos desbloqueados podem ser equipados', () => {
    const system = new BowSystem(bows, 1, [1, 2]);

    assert.equal(system.equip(2), true);
    assert.equal(system.current.name, 'Arco Reforçado');
    assert.equal(system.equip(10), false);
    assert.equal(system.currentLevel, 2);
});

test('o desbloqueio é obrigatoriamente sequencial até o nível dez', () => {
    const system = new BowSystem(bows);

    assert.equal(system.unlock(3), false);
    for (let level = 2; level <= 10; level += 1) {
        assert.equal(system.unlock(level), true);
    }
    assert.deepEqual(system.unlockedLevels, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test('desbloqueios salvos inválidos são normalizados sem perder a sequência válida', () => {
    const system = new BowSystem(bows, 10, [10, 4, 3, 2, 1]);

    assert.deepEqual(system.unlockedLevels, [1, 2, 3, 4]);
    assert.equal(system.currentLevel, 1);
});

test('uma configuração diferente de dez níveis é rejeitada', () => {
    assert.throws(
        () => new BowSystem({ 1: bows[1], 2: bows[2] }),
        /exatamente dez níveis/,
    );
});
