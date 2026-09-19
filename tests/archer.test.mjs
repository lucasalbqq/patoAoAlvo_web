import assert from 'node:assert/strict';
import test from 'node:test';
import { Archer } from '../public/js/entities/Archer.js';

test('o arqueiro alterna entre parado e mirando', () => {
    const archer = new Archer();

    assert.equal(archer.state, 'idle');
    archer.setAimTarget(700, 250);
    assert.equal(archer.state, 'aiming');
    assert.equal(archer.isAiming, true);
    archer.rest();
    assert.equal(archer.state, 'idle');
    assert.equal(archer.isAiming, false);
});

test('a mira fica limitada à área jogável', () => {
    const archer = new Archer();

    archer.setAimTarget(-500, 5000);

    assert.deepEqual(archer.aimTarget, { x: 285, y: 650 });
});

test('o ângulo se aproxima suavemente do alvo', () => {
    const archer = new Archer();
    archer.setAimTarget(1100, 100);
    const initialAngle = archer.aimAngle;

    archer.update(1 / 60, 1);

    assert.notEqual(archer.aimAngle, initialAngle);
    assert.ok(Number.isFinite(archer.aimAngle));
});

test('o arqueiro passa por puxada e recuo ao disparar', () => {
    const archer = new Archer();
    archer.setAimTarget(900, 250);
    archer.beginDraw();
    archer.setCharge(.8);

    assert.equal(archer.state, 'drawing');
    assert.equal(archer.charge, .8);

    archer.release();
    assert.equal(archer.state, 'released');
    assert.equal(archer.charge, 0);

    archer.update(.2, 1);
    assert.equal(archer.state, 'aiming');
});
