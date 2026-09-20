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

const ARROW_SOUNDS = {
    wood: {
        shoot: [tone(430, 150, .15, 'triangle', .24)],
        impact: [tone(180, 95, .11, 'triangle', .2)],
    },
    reinforced: {
        shoot: [tone(720, 260, .13, 'triangle', .2), tone(1180, 620, .08, 'sine', .1, .025)],
        impact: [tone(760, 310, .1, 'square', .13), tone(320, 160, .13, 'triangle', .15, .025)],
    },
    hunter: {
        shoot: [tone(920, 480, .2, 'sine', .2), tone(1280, 760, .13, 'triangle', .08, .035)],
        impact: [tone(420, 190, .12, 'triangle', .18), tone(840, 520, .08, 'sine', .08, .035)],
    },
    iron: {
        shoot: [tone(390, 120, .18, 'sawtooth', .18), tone(980, 360, .14, 'triangle', .12, .02)],
        impact: [tone(260, 75, .2, 'square', .2), tone(1120, 470, .18, 'sine', .11, .015)],
    },
    fire: {
        shoot: [tone(760, 130, .25, 'sawtooth', .18), tone(1320, 390, .16, 'triangle', .1, .04)],
        impact: [tone(150, 55, .3, 'sawtooth', .19), tone(980, 180, .2, 'square', .09, .025), tone(1480, 520, .1, 'triangle', .07, .1)],
    },
    ice: {
        shoot: [tone(820, 1640, .2, 'sine', .18), tone(1240, 2100, .15, 'triangle', .09, .045)],
        impact: [tone(1760, 680, .24, 'sine', .16), tone(2340, 920, .18, 'triangle', .1, .035), tone(1320, 540, .16, 'sine', .08, .1)],
    },
    electric: {
        shoot: [tone(180, 1250, .09, 'square', .16), tone(1480, 260, .11, 'sawtooth', .13, .075), tone(320, 1920, .08, 'square', .09, .14)],
        impact: [tone(1900, 120, .1, 'square', .17), tone(240, 1700, .09, 'sawtooth', .13, .07), tone(1550, 210, .11, 'square', .1, .14)],
    },
    crystal: {
        shoot: [tone(1046.5, 1568, .2, 'sine', .16), tone(1318.5, 2093, .22, 'sine', .11, .025)],
        impact: [tone(2093, 1046.5, .28, 'sine', .15), tone(2637, 1318.5, .26, 'sine', .11, .035), tone(3136, 1568, .22, 'triangle', .07, .075)],
    },
    legendary: {
        shoot: [tone(523.25, 784, .17, 'triangle', .15), tone(659.25, 987.77, .18, 'sine', .11, .06), tone(783.99, 1318.5, .2, 'triangle', .09, .12)],
        impact: [tone(392, 783.99, .22, 'triangle', .16), tone(523.25, 1046.5, .24, 'sine', .12, .055), tone(783.99, 1568, .26, 'triangle', .09, .11)],
    },
    supreme: {
        shoot: [tone(392, 1174.7, .25, 'triangle', .17), tone(587.33, 1760, .27, 'sine', .13, .035), tone(783.99, 2349.3, .3, 'triangle', .1, .07)],
        impact: [tone(220, 880, .3, 'sawtooth', .16), tone(659.25, 1318.5, .32, 'triangle', .14, .035), tone(987.77, 1975.5, .34, 'sine', .11, .075), tone(1568, 3136, .28, 'triangle', .08, .12)],
    },
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

    play(name, details = {}) {
        if (this.muted || !this.effectsEnabled || !EFFECTS[name]) {
            return;
        }

        void this.unlock().then((ready) => {
            if (!ready || this.muted || !this.effectsEnabled) {
                return;
            }

            const arrowSound = this.getArrowSound(name, details);

            if (arrowSound) {
                arrowSound.forEach((effect) => this.playTone(effect, this.effectsGain, effect.delay));
            } else {
                this.playTone(EFFECTS[name], this.effectsGain);
            }

            if (name === 'duck' && arrowSound) {
                this.playTone({ ...EFFECTS.duck, volume: .1 }, this.effectsGain, .08);
            }

            if (name === 'coin') {
                this.playTone({ ...EFFECTS.coin, frequency: 1174, endFrequency: 1568 }, this.effectsGain, .08);
            }
        });
    }

    getArrowSound(name, details) {
        const profile = ARROW_SOUNDS[details?.visualEffect];

        if (!profile) {
            return null;
        }

        if (name === 'shoot') {
            return profile.shoot;
        }

        if (name === 'hit' || name === 'duck') {
            return profile.impact;
        }

        return null;
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

function tone(frequency, endFrequency, duration, type, volume, delay = 0) {
    return { frequency, endFrequency, duration, type, volume, delay };
}
