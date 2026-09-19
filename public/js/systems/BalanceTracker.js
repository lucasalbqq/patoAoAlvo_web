const DEFAULT_LIMIT = 10;

export class BalanceTracker {
    constructor(history = [], limit = DEFAULT_LIMIT) {
        this.limit = Math.max(1, Math.floor(Number(limit) || DEFAULT_LIMIT));
        this.history = Array.isArray(history)
            ? history.map((entry) => this.sanitize(entry)).filter(Boolean).slice(0, this.limit)
            : [];
    }

    record(result) {
        const entry = this.sanitize({ ...result, playedAt: result.playedAt ?? Date.now() });

        if (!entry) {
            return null;
        }

        this.history.unshift(entry);
        this.history = this.history.slice(0, this.limit);
        return entry;
    }

    getSummary() {
        if (this.history.length === 0) {
            return {
                rounds: 0,
                averageScore: 0,
                averageAccuracy: 0,
                bestScore: 0,
                totalHits: 0,
                favoriteBow: 1,
            };
        }

        const totals = this.history.reduce((summary, entry) => {
            summary.score += entry.score;
            summary.accuracy += entry.accuracy;
            summary.hits += entry.hits;
            summary.bows[entry.bowLevel] = (summary.bows[entry.bowLevel] ?? 0) + 1;
            return summary;
        }, { score: 0, accuracy: 0, hits: 0, bows: {} });

        const favoriteBow = Object.entries(totals.bows)
            .sort(([levelA, countA], [levelB, countB]) => countB - countA || Number(levelB) - Number(levelA))[0]?.[0] ?? 1;

        return {
            rounds: this.history.length,
            averageScore: Math.round(totals.score / this.history.length),
            averageAccuracy: Math.round(totals.accuracy / this.history.length),
            bestScore: Math.max(...this.history.map((entry) => entry.score)),
            totalHits: totals.hits,
            favoriteBow: Number(favoriteBow),
        };
    }

    getFeedback(entry = this.history[0]) {
        if (!entry || entry.shots === 0) {
            return 'Prepare o arco e faça seu primeiro disparo!';
        }

        if (entry.accuracy >= 60) {
            return 'Mira afiada! Você acertou mais da metade dos disparos.';
        }

        if (entry.score >= 200) {
            return 'Grande caçada! Sua pontuação passou de 200.';
        }

        if (entry.accuracy >= 35) {
            return 'Bom ritmo! Continue mirando com calma antes de soltar.';
        }

        return 'Cada tentativa conta. Segure um pouco mais o arco e mire com calma!';
    }

    clear() {
        this.history = [];
    }

    toJSON() {
        return [...this.history];
    }

    sanitize(entry) {
        if (!entry || typeof entry !== 'object') {
            return null;
        }

        const shots = toInteger(entry.shots);
        const hits = Math.min(toInteger(entry.hits), shots);
        const bowLevel = Math.min(4, Math.max(1, toInteger(entry.bowLevel) || 1));
        const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0;
        const playedAt = Number(entry.playedAt);

        return {
            score: toInteger(entry.score),
            coinsEarned: toInteger(entry.coinsEarned),
            hits,
            shots,
            accuracy,
            bowLevel,
            playedAt: Number.isFinite(playedAt) && playedAt > 0 ? Math.floor(playedAt) : Date.now(),
        };
    }
}

function toInteger(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? Math.floor(number) : 0;
}
