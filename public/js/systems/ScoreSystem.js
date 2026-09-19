export class ScoreSystem {
    constructor() {
        this.score = 0;
    }

    reset() {
        this.score = 0;
    }

    awardDuck(duck) {
        const points = normalizeReward(duck.points);
        this.score += points;
        return points;
    }
}

function normalizeReward(value) {
    const reward = Number(value);
    return Number.isFinite(reward) && reward > 0 ? Math.floor(reward) : 0;
}

