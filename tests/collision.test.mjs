import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveArrowDuckCollisions, segmentIntersectsCircle } from '../public/js/collision.js';
import { Duck } from '../public/js/entities/Duck.js';

test('um segmento rápido ainda atravessa corretamente o círculo de colisão', () => {
    assert.equal(segmentIntersectsCircle(0, 100, 300, 100, 150, 100, 25), true);
    assert.equal(segmentIntersectsCircle(0, 10, 300, 10, 150, 100, 25), false);
});

test('a colisão desativa a flecha e derruba o pato', () => {
    const arrow = {
        previousX: 300,
        previousY: 200,
        x: 600,
        y: 200,
        damage: 1,
        active: true,
    };
    const duck = new Duck({ x: 500, y: 200, speed: 0, health: 1 });

    const hits = resolveArrowDuckCollisions([arrow], [duck]);

    assert.equal(hits.length, 1);
    assert.equal(hits[0].defeated, true);
    assert.equal(arrow.active, false);
    assert.equal(duck.state, 'falling');
});
