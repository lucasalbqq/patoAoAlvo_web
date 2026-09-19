import { Duck } from '../entities/Duck.js';

export class SpawnSystem {
    constructor({ random = Math.random, interval = 2.4, maxDucks = 4 } = {}) {
        this.random = random;
        this.baseInterval = interval;
        this.baseMaxDucks = maxDucks;
        this.interval = interval;
        this.maxDucks = Math.min(3, maxDucks);
        this.speedMultiplier = 1;
        this.stage = 'early';
        this.difficultyLabel = 'Tranquilo';
        this.timeUntilNext = interval;
    }

    reset() {
        this.interval = this.baseInterval;
        this.maxDucks = Math.min(3, this.baseMaxDucks);
        this.speedMultiplier = 1;
        this.stage = 'early';
        this.difficultyLabel = 'Tranquilo';
        this.timeUntilNext = this.interval;
    }

    setDifficulty(progress) {
        if (progress < .34) {
            this.stage = 'early';
            this.interval = this.baseInterval;
            this.maxDucks = Math.min(3, this.baseMaxDucks);
            this.speedMultiplier = 1;
            this.difficultyLabel = 'Tranquilo';
        } else if (progress < .67) {
            this.stage = 'middle';
            this.interval = this.baseInterval * .78;
            this.maxDucks = this.baseMaxDucks;
            this.speedMultiplier = 1;
            this.difficultyLabel = 'Ritmo aumentado';
        } else {
            this.stage = 'final';
            this.interval = this.baseInterval * .78;
            this.maxDucks = this.baseMaxDucks;
            this.speedMultiplier = 1.2;
            this.difficultyLabel = 'Desafio final';
        }

        return this.difficultyLabel;
    }

    update(delta, ducks, duckConfigs) {
        this.timeUntilNext -= delta;

        if (this.timeUntilNext > 0) {
            return null;
        }

        const flyingDucks = ducks.filter((duck) => duck.active && duck.state === 'flying').length;
        this.timeUntilNext = this.interval * (.85 + this.random() * .3);

        if (flyingDucks >= this.maxDucks) {
            return null;
        }

        const duck = this.createDuck(duckConfigs);
        ducks.push(duck);
        return duck;
    }

    createDuck(duckConfigs) {
        const type = this.chooseType();
        const duckConfig = duckConfigs[type] ?? duckConfigs.common;
        const fromLeft = this.random() > .5;
        const direction = fromLeft ? 1 : -1;

        return new Duck({
            x: fromLeft ? -70 : 1350,
            y: 165 + this.random() * 245,
            direction,
            speed: (78 + this.random() * 48)
                * this.speedMultiplier
                * (duckConfig.speedMultiplier ?? 1),
            type,
            name: duckConfig.name,
            health: duckConfig.health,
            points: duckConfig.points,
            coins: duckConfig.coins,
            movement: duckConfig.movement,
            size: duckConfig.size,
            bodyColor: duckConfig.bodyColor,
            wingColor: duckConfig.wingColor,
            headColor: duckConfig.headColor,
            waveAmplitude: 10 + this.random() * 18,
            waveSpeed: 1.7 + this.random() * 1.2,
            phase: this.random() * Math.PI * 2,
        });
    }

    chooseType() {
        const tables = {
            early: [
                ['common', .82],
                ['blue', .18],
            ],
            middle: [
                ['common', .50],
                ['blue', .25],
                ['red', .15],
                ['purple', .10],
            ],
            final: [
                ['common', .35],
                ['blue', .22],
                ['red', .18],
                ['purple', .13],
                ['golden', .09],
                ['king', .03],
            ],
        };
        const roll = this.random();
        let accumulated = 0;

        for (const [type, weight] of tables[this.stage]) {
            accumulated += weight;
            if (roll <= accumulated) {
                return type;
            }
        }

        return 'common';
    }
}
