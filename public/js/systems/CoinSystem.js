export class CoinSystem {
    constructor(initialCoins = 0) {
        this.totalCoins = normalizeBalance(initialCoins);
        this.roundCoins = 0;
    }

    resetRound() {
        this.roundCoins = 0;
    }

    collectFromDuck(duck) {
        const coins = normalizeReward(duck.coins);
        this.roundCoins += coins;
        this.totalCoins += coins;
        return coins;
    }

    spend(amount) {
        const cost = normalizeReward(amount);

        if (cost <= 0 || this.totalCoins < cost) {
            return false;
        }

        this.totalCoins -= cost;
        return true;
    }
}

function normalizeBalance(value) {
    const balance = Number(value);
    return Number.isFinite(balance) && balance >= 0 ? Math.floor(balance) : 0;
}

function normalizeReward(value) {
    const reward = Number(value);
    return Number.isFinite(reward) && reward > 0 ? Math.floor(reward) : 0;
}
