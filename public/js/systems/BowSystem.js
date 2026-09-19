export class BowSystem {
    constructor(bows, initialLevel = 1, unlockedLevels = [1]) {
        this.bows = bows;
        this.levels = Object.keys(bows).map(Number).sort((a, b) => a - b);

        if (this.levels.length !== 4 || this.levels.some((level, index) => level !== index + 1)) {
            throw new Error('Pato ao Alvo exige exatamente quatro níveis de arco.');
        }

        this.unlockedLevels = normalizeUnlocked(unlockedLevels, this.levels);
        this.currentLevel = this.isUnlocked(initialLevel) ? Number(initialLevel) : 1;
    }

    has(level) {
        return Number.isInteger(Number(level))
            && Object.hasOwn(this.bows, String(Number(level)));
    }

    isUnlocked(level) {
        return this.has(level) && this.unlockedLevels.includes(Number(level));
    }

    equip(level) {
        if (!this.isUnlocked(level)) {
            return false;
        }

        this.currentLevel = Number(level);
        return true;
    }

    canUnlock(level) {
        const numericLevel = Number(level);
        return this.has(numericLevel)
            && numericLevel > 1
            && !this.isUnlocked(numericLevel)
            && this.isUnlocked(numericLevel - 1);
    }

    unlock(level) {
        if (!this.canUnlock(level)) {
            return false;
        }

        this.unlockedLevels.push(Number(level));
        this.unlockedLevels.sort((a, b) => a - b);
        return true;
    }

    get current() {
        return this.bows[this.currentLevel];
    }

    get all() {
        return this.levels.map((level) => ({ level, ...this.bows[level] }));
    }
}

function normalizeUnlocked(values, validLevels) {
    const requested = Array.isArray(values) ? values.map(Number) : [];
    const unlocked = [1];

    validLevels.slice(1).forEach((level) => {
        if (requested.includes(level) && unlocked.includes(level - 1)) {
            unlocked.push(level);
        }
    });

    return unlocked;
}
