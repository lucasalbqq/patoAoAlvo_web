import assert from 'node:assert/strict';
import test from 'node:test';
import { ParticleSystem } from '../public/js/systems/ParticleSystem.js';

test('o disparo cria faíscas com tempo de vida limitado', () => {
    const system = new ParticleSystem(() => .5);

    system.emitShot(100, 200, 0, '#fff');
    assert.equal(system.particles.length, 6);
    system.update(1);
    assert.equal(system.particles.length, 0);
});

test('o splash cria gotas com gravidade', () => {
    const system = new ParticleSystem(() => .5);
    system.emitSplash(500, 430);
    const initialVelocity = system.particles[0].velocityY;

    system.update(.1);

    assert.equal(system.particles.length, 16);
    assert.ok(system.particles[0].velocityY > initialVelocity);
    assert.ok(system.particles.every((particle) => particle.shape === 'drop'));
});

test('o limite de partículas impede crescimento sem controle', () => {
    const system = new ParticleSystem(() => .5, 20);

    system.emitCelebration();

    assert.equal(system.particles.length, 20);
});

test('uma derrota cria impacto e penas', () => {
    const system = new ParticleSystem(() => .5);
    const duck = { x: 400, y: 200, type: 'common', headColor: '#26a968' };

    system.emitDuckImpact(duck, true);

    assert.ok(system.particles.some((particle) => particle.shape === 'spark'));
    assert.ok(system.particles.some((particle) => particle.shape === 'feather'));
});

test('cada família de flecha cria uma assinatura visual de impacto', () => {
    const expectedShapes = {
        wood: 'chip',
        reinforced: 'metal',
        hunter: 'leaf',
        iron: 'ring',
        fire: 'ember',
        ice: 'snowflake',
        electric: 'bolt',
        crystal: 'shard',
        legendary: 'star',
        supreme: 'ring',
    };
    const duck = { x: 400, y: 200 };

    Object.entries(expectedShapes).forEach(([visualEffect, expectedShape]) => {
        const system = new ParticleSystem(() => .5);
        system.emitArrowImpact({ visualEffect }, duck);

        assert.ok(system.particles.length >= 7, `${visualEffect} deve gerar um impacto visível.`);
        assert.ok(
            system.particles.some((particle) => particle.shape === expectedShape),
            `${visualEffect} deve usar partículas ${expectedShape}.`,
        );
    });
});

test('o disparo usa a identidade visual da flecha equipada', () => {
    const system = new ParticleSystem(() => .5);

    system.emitShot(100, 200, 0, {
        arrowVisual: 'electric',
        color: '#ffe23d',
        arrowAccent: '#fffbd0',
    });

    assert.equal(system.particles.length, 8);
    assert.ok(system.particles.every((particle) => particle.shape === 'bolt'));
});
