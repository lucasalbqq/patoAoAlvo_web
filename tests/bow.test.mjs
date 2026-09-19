import assert from 'node:assert/strict';
import test from 'node:test';
import { BowSystem } from '../public/js/systems/BowSystem.js';

const bows = {
    1: { name: 'Básico', damage: 1 },
    2: { name: 'Melhorado', damage: 2 },
    3: { name: 'Épico', damage: 3 },
    4: { name: 'Lendário', damage: 4 },
};

test('o sistema contém exatamente os quatro níveis oficiais', () => {
    const system = new BowSystem(bows);

    assert.deepEqual(system.levels, [1, 2, 3, 4]);
    assert.equal(system.all.length, 4);
});

test('somente arcos desbloqueados podem ser equipados', () => {
    const system = new BowSystem(bows, 1, [1, 2]);

    assert.equal(system.equip(2), true);
    assert.equal(system.current.name, 'Melhorado');
    assert.equal(system.equip(4), false);
    assert.equal(system.currentLevel, 2);
});

test('o desbloqueio é obrigatoriamente sequencial', () => {
    const system = new BowSystem(bows);

    assert.equal(system.unlock(3), false);
    assert.equal(system.unlock(2), true);
    assert.equal(system.unlock(3), true);
    assert.deepEqual(system.unlockedLevels, [1, 2, 3]);
});

test('desbloqueios salvos inválidos são normalizados', () => {
    const system = new BowSystem(bows, 4, [4, 2, 1]);

    assert.deepEqual(system.unlockedLevels, [1, 2]);
    assert.equal(system.currentLevel, 1);
});

test('uma configuração diferente de quatro níveis é rejeitada', () => {
    assert.throws(
        () => new BowSystem({ 1: bows[1], 2: bows[2] }),
        /exatamente quatro níveis/,
    );
});
