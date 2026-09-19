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
