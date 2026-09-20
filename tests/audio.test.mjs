import assert from 'node:assert/strict';
import test from 'node:test';
import { AudioSystem } from '../public/js/systems/AudioSystem.js';

test('preferências de áudio são normalizadas e exportadas', () => {
    const audio = new AudioSystem({
        volume: 2,
        muted: true,
        musicEnabled: false,
        effectsEnabled: true,
    });

    assert.deepEqual(audio.getSettings(), {
        volume: 1,
        muted: true,
        musicEnabled: false,
        effectsEnabled: true,
    });

    audio.setVolume(-5);
    audio.setMuted(false);
    assert.equal(audio.volume, 0);
    assert.equal(audio.muted, false);
});

test('ausência da Web Audio API não interrompe o jogo', async () => {
    const audio = new AudioSystem({}, null);

    assert.equal(await audio.unlock(), false);
    assert.doesNotThrow(() => audio.play('shoot'));
    assert.doesNotThrow(() => audio.startMusic());
    audio.stopMusic();
    assert.equal(audio.musicRequested, false);
});

test('um efeito cria e agenda um oscilador quando há suporte', async () => {
    const context = createFakeContext();
    const audio = new AudioSystem({}, class {
        constructor() {
            return context;
        }
    });

    assert.equal(await audio.unlock(), true);
    audio.play('shoot');
    await Promise.resolve();
    await Promise.resolve();

    assert.equal(context.oscillators.length, 1);
    assert.equal(context.oscillators[0].started, true);
    assert.equal(context.oscillators[0].stopped, true);
});

test('cada tipo de flecha usa seu perfil de disparo e impacto', async () => {
    const arrowTypes = [
        'wood', 'reinforced', 'hunter', 'iron', 'fire',
        'ice', 'electric', 'crystal', 'legendary', 'supreme',
    ];

    for (const visualEffect of arrowTypes) {
        const context = createFakeContext();
        const audio = new AudioSystem({}, class {
            constructor() {
                return context;
            }
        });

        audio.play('shoot', { visualEffect });
        await flushPromises();
        const shootOscillators = context.oscillators.length;
        audio.play('hit', { visualEffect });
        await flushPromises();

        assert.ok(shootOscillators >= 1, `${visualEffect} deve possuir som de disparo.`);
        assert.ok(context.oscillators.length > shootOscillators, `${visualEffect} deve possuir som de impacto.`);
    }
});

test('perfil supremo combina mais camadas do que o perfil de madeira', async () => {
    const context = createFakeContext();
    const audio = new AudioSystem({}, class {
        constructor() {
            return context;
        }
    });

    audio.play('shoot', { visualEffect: 'wood' });
    await flushPromises();
    const woodLayers = context.oscillators.length;
    audio.play('shoot', { visualEffect: 'supreme' });
    await flushPromises();

    assert.equal(woodLayers, 1);
    assert.equal(context.oscillators.length - woodLayers, 3);
});

async function flushPromises() {
    await Promise.resolve();
    await Promise.resolve();
}

function createFakeContext() {
    const parameter = () => ({
        setValueAtTime() {},
        setTargetAtTime() {},
        exponentialRampToValueAtTime() {},
    });
    const context = {
        state: 'running',
        currentTime: 0,
        destination: {},
        oscillators: [],
        createGain() {
            return { gain: parameter(), connect() {} };
        },
        createOscillator() {
            const oscillator = {
                frequency: parameter(),
                connect() {},
                start() { this.started = true; },
                stop() { this.stopped = true; },
                started: false,
                stopped: false,
            };
            this.oscillators.push(oscillator);
            return oscillator;
        },
        async resume() {},
    };
    return context;
}
