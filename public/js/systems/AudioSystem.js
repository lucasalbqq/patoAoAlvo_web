const EFFECTS = {
    click: { frequency: 420, endFrequency: 520, duration: .06, type: 'sine', volume: .16 },
    shoot: { frequency: 540, endFrequency: 150, duration: .18, type: 'triangle', volume: .25 },
    hit: { frequency: 190, endFrequency: 110, duration: .12, type: 'square', volume: .2 },
    duck: { frequency: 360, endFrequency: 230, duration: .2, type: 'sine', volume: .2 },
    coin: { frequency: 880, endFrequency: 1320, duration: .14, type: 'sine', volume: .22 },
    splash: { frequency: 240, endFrequency: 90, duration: .28, type: 'sine', volume: .2 },
    buy: { frequency: 520, endFrequency: 1040, duration: .28, type: 'triangle', volume: .25 },
    blocked: { frequency: 150, endFrequency: 105, duration: .24, type: 'sawtooth', volume: .18 },
    victory: { frequency: 523.25, endFrequency: 1046.5, duration: .55, type: 'triangle', volume: .28 },
};

export class AudioSystem {
    constructor(settings = {}, contextClass = null) {
        this.contextClass = contextClass
            ?? globalThis.AudioContext
            ?? globalThis.webkitAudioContext
            ?? null;
        this.context = null;
        this.masterGain = null;
        this.musicGain = null;
        this.effectsGain = null;
        this.volume = clamp(Number(settings.volume ?? .65), 0, 1);
        this.muted = Boolean(settings.muted);
        this.musicEnabled = settings.musicEnabled !== false;
        this.effectsEnabled = settings.effectsEnabled !== false;
        this.musicRequested = false;
        this.musicTimer = null;
        this.musicStep = 0;
    }

    async unlock() {
        if (!this.ensureContext()) {
            return false;
        }

        if (this.context.state === 'suspended') {
            await this.context.resume();
        }

        this.applyVolumes();
        return true;
    }

    ensureContext() {
        if (this.context) {
            return true;
        }

        if (!this.contextClass) {
            return false;
        }

        this.context = new this.contextClass();
        this.masterGain = this.context.createGain();
        this.musicGain = this.context.createGain();
        this.effectsGain = this.context.createGain();
        this.musicGain.connect(this.masterGain);
        this.effectsGain.connect(this.masterGain);
        this.masterGain.connect(this.context.destination);
        this.applyVolumes();
        return true;
    }

    play(name) {
        if (this.muted || !this.effectsEnabled || !EFFECTS[name]) {
            return;
        }

        void this.unlock().then((ready) => {
            if (!ready || this.muted || !this.effectsEnabled) {
                return;
            }

            this.playTone(EFFECTS[name], this.effectsGain);

            if (name === 'coin') {
                this.playTone({ ...EFFECTS.coin, frequency: 1174, endFrequency: 1568 }, this.effectsGain, .08);
            }
        });
    }

    startMusic() {
        this.musicRequested = true;

        if (this.muted || !this.musicEnabled) {
            return;
        }

        void this.unlock().then((ready) => {
            if (!ready || this.musicTimer || !this.musicRequested || !this.musicEnabled) {
                return;
            }

            this.playMusicNote();
            this.musicTimer = globalThis.setInterval(() => this.playMusicNote(), 430);
        });
    }

    stopMusic() {
        this.musicRequested = false;

        if (this.musicTimer) {
            globalThis.clearInterval(this.musicTimer);
            this.musicTimer = null;
        }
    }

    playMusicNote() {
        if (!this.context || this.muted || !this.musicEnabled) {
            return;
        }

        const melody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 392];
        const frequency = melody[this.musicStep % melody.length];
        this.musicStep += 1;
        this.playTone({
            frequency,
            endFrequency: frequency * 1.01,
            duration: .3,
            type: 'sine',
            volume: .11,
        }, this.musicGain);
    }

    playTone(effect, destination, delay = 0) {
        const now = this.context.currentTime + delay;
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        oscillator.type = effect.type;
        oscillator.frequency.setValueAtTime(effect.frequency, now);
        oscillator.frequency.exponentialRampToValueAtTime(
            Math.max(20, effect.endFrequency),
            now + effect.duration,
        );
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(effect.volume, now + .015);
        gain.gain.exponentialRampToValueAtTime(.0001, now + effect.duration);
        oscillator.connect(gain);
        gain.connect(destination);
        oscillator.start(now);
        oscillator.stop(now + effect.duration + .02);
    }

    setVolume(value) {
        this.volume = clamp(Number(value), 0, 1);
        this.applyVolumes();
    }

    setMuted(value) {
        this.muted = Boolean(value);
        this.applyVolumes();

        if (this.muted) {
            this.stopMusicTimerOnly();
        } else if (this.musicRequested && this.musicEnabled) {
            this.startMusic();
        }
    }

    setMusicEnabled(value) {
        this.musicEnabled = Boolean(value);
        this.applyVolumes();

        if (!this.musicEnabled) {
            this.stopMusicTimerOnly();
        } else if (this.musicRequested && !this.muted) {
            this.startMusic();
        }
    }

    setEffectsEnabled(value) {
        this.effectsEnabled = Boolean(value);
        this.applyVolumes();
    }

    stopMusicTimerOnly() {
        if (this.musicTimer) {
            globalThis.clearInterval(this.musicTimer);
            this.musicTimer = null;
        }
    }

    applyVolumes() {
        if (!this.context) {
            return;
        }

        const now = this.context.currentTime;
        this.masterGain.gain.setTargetAtTime(this.muted ? 0 : this.volume, now, .015);
        this.musicGain.gain.setTargetAtTime(this.musicEnabled ? .55 : 0, now, .015);
        this.effectsGain.gain.setTargetAtTime(this.effectsEnabled ? .9 : 0, now, .015);
    }

    getSettings() {
        return {
            volume: this.volume,
            muted: this.muted,
            musicEnabled: this.musicEnabled,
            effectsEnabled: this.effectsEnabled,
        };
    }
}

function clamp(value, minimum, maximum) {
    if (!Number.isFinite(value)) {
        return minimum;
    }

    return Math.max(minimum, Math.min(maximum, value));
}

