import assert from 'node:assert/strict';
import test from 'node:test';
import { Arrow } from '../public/js/entities/Arrow.js';

const basicBow = {
    damage: 1,
    range: 1,
    arrowSpeed: 1,
    color: '#b96832',
};

test('a flecha avança e sofre ação da gravidade', () => {
    const arrow = createArrow({ angle: 0, power: 1 });

    arrow.update(.1);

    assert.ok(arrow.x > 90, 'A flecha deve avançar horizontalmente.');
    assert.ok(arrow.y > 0, 'A gravidade deve deslocar a flecha para baixo.');
    assert.ok(arrow.rotation > 0, 'A rotação deve acompanhar a trajetória.');
});

test('mais força produz uma flecha mais veloz', () => {
    const weak = createArrow({ power: .25 });
    const strong = createArrow({ power: 1 });

    assert.ok(strong.velocityX > weak.velocityX);
    assert.ok(strong.maxDistance > weak.maxDistance * 2);
});

test('clique rápido cai antes de sair pela lateral, mas carga máxima alcança a borda', () => {
    const weak = createArrow({ x: 220, y: 500, power: .25 });
    const strong = createArrow({ x: 220, y: 500, power: 1 });

    while (weak.active) {
        weak.update(1 / 60);
    }
    while (strong.active) {
        strong.update(1 / 60);
    }

    assert.ok(weak.x < 1000);
    assert.ok(strong.x > 1300);
    assert.equal(weak.gravity, 680);
});

test('os atributos do arco alteram velocidade, alcance e dano', () => {
    const improvedBow = { ...basicBow, damage: 2, range: 1.2, arrowSpeed: 1.1 };
    const basic = createArrow();
    const improved = createArrow({ bow: improvedBow, bowLevel: 2 });

    assert.ok(improved.velocityX > basic.velocityX);
    assert.ok(improved.maxDistance > basic.maxDistance);
    assert.equal(improved.damage, 2);
    assert.equal(improved.bowLevel, 2);
});

test('a flecha é desativada ao superar o alcance', () => {
    const arrow = createArrow();
    arrow.distance = arrow.maxDistance - 1;

    arrow.update(.1);

    assert.equal(arrow.active, false);
});

test('somente um disparo originalmente apontado para baixo pode atingir a água', () => {
    const horizontal = createArrow({ angle: 0 });
    const upward = createArrow({ angle: -.25 });
    const downward = createArrow({ angle: .25 });

    assert.equal(horizontal.canHitWater, false);
    assert.equal(upward.canHitWater, false);
    assert.equal(downward.canHitWater, true);
});

function createArrow(overrides = {}) {
    return new Arrow({
        x: 0,
        y: 0,
        angle: 0,
        power: 1,
        bowLevel: 1,
        bow: basicBow,
        ...overrides,
    });
}
