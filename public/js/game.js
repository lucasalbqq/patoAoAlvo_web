import { Archer } from './entities/Archer.js';
import { Arrow } from './entities/Arrow.js';
import { Duck } from './entities/Duck.js';
import { resolveArrowDuckCollisions } from './collision.js';
import { GAME_CONFIG } from './config.js';
import { Renderer } from './renderer.js';
import { BowSystem } from './systems/BowSystem.js';
import { CoinSystem } from './systems/CoinSystem.js';
import { ParticleSystem } from './systems/ParticleSystem.js';
import { RoundSystem } from './systems/RoundSystem.js';
import { ScoreSystem } from './systems/ScoreSystem.js';
import { SpawnSystem } from './systems/SpawnSystem.js';

export class Game {
    constructor(canvas, {
        currentBow = 1,
        unlockedBows = [1],
        initialCoins = 0,
        onStatsChange = () => {},
        onRoundUpdate = () => {},
        onRoundEnd = () => {},
        onBowChange = () => {},
        onSound = () => {},
        random = Math.random,
        reducedMotion = false,
        now = () => performance.now(),
    } = {}) {
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
        this.random = random;
        this.now = now;
        this.spawnSystem = new SpawnSystem({ random });
        this.scoreSystem = new ScoreSystem();
        this.coinSystem = new CoinSystem(initialCoins);
        this.particleSystem = new ParticleSystem(random, reducedMotion ? 70 : 180);
        this.roundSystem = new RoundSystem(GAME_CONFIG.roundDuration);
        this.bowSystem = new BowSystem(GAME_CONFIG.bows, currentBow, unlockedBows);
        this.onStatsChange = onStatsChange;
        this.onRoundUpdate = onRoundUpdate;
        this.onRoundEnd = onRoundEnd;
        this.onBowChange = onBowChange;
        this.onSound = onSound;
        this.lastReportedSecond = null;
        const bowLevel = this.bowSystem.currentLevel;
        this.state = {
            running: true,
            demoRunning: false,
            elapsed: 0,
            archer: new Archer(),
            arrows: [],
            ducks: [this.createInitialDuck()],
            rewardPopups: [],
            particles: this.particleSystem.particles,
            currentBow: bowLevel,
            bow: GAME_CONFIG.bows[bowLevel],
            shots: 0,
            hits: 0,
            score: 0,
            coinsEarned: 0,
            totalCoins: this.coinSystem.totalCoins,
            timeRemaining: GAME_CONFIG.roundDuration,
            difficulty: 'Tranquilo',
            roundStatus: 'idle',
            activePointerId: null,
        };
        this.chargeStartedAt = 0;
        this.lastShotAt = Number.NEGATIVE_INFINITY;
        this.lastFrame = performance.now();
        this.frameRequest = null;

        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);
        this.handlePointerCancel = this.handlePointerCancel.bind(this);
        this.handlePointerLeave = this.handlePointerLeave.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.loop = this.loop.bind(this);
        this.syncStats();
        this.syncRoundStatus(true);
        this.syncBow();
    }

    start() {
        this.canvas.addEventListener('pointermove', this.handlePointerMove);
        this.canvas.addEventListener('pointerdown', this.handlePointerDown);
        this.canvas.addEventListener('pointerup', this.handlePointerUp);
        this.canvas.addEventListener('pointercancel', this.handlePointerCancel);
        this.canvas.addEventListener('pointerleave', this.handlePointerLeave);
        globalThis.addEventListener('keydown', this.handleKeyDown);
        globalThis.addEventListener('keyup', this.handleKeyUp);
        this.frameRequest = requestAnimationFrame(this.loop);
    }

    setDemoRunning(value) {
        const isStarting = value && !this.state.demoRunning;
        this.state.demoRunning = value;

        if (isStarting) {
            this.particleSystem.clear();
            this.state.arrows = [];
            this.state.ducks = [this.createInitialDuck()];
            this.state.rewardPopups = [];
            this.state.shots = 0;
            this.state.hits = 0;
            this.lastShotAt = Number.NEGATIVE_INFINITY;
            this.scoreSystem.reset();
            this.coinSystem.resetRound();
            this.syncStats();
            this.spawnSystem.reset();
            this.roundSystem.start();
            this.state.roundStatus = 'playing';
            this.state.timeRemaining = this.roundSystem.timeRemaining;
            this.state.difficulty = this.spawnSystem.difficultyLabel;
            this.lastReportedSecond = null;
            this.syncRoundStatus(true);
        }

        if (!value) {
            this.particleSystem.clear();
            this.roundSystem.stop();
            this.state.roundStatus = 'idle';
            this.state.activePointerId = null;
            this.state.arrows = [];
            this.state.ducks = [this.createInitialDuck(38)];
            this.state.rewardPopups = [];
            this.state.archer.rest();
            this.syncRoundStatus(true);
        }
    }

    handlePointerMove(event) {
        if (!this.state.demoRunning) {
            return;
        }

        if (event.pointerType === 'touch' && this.state.activePointerId !== event.pointerId) {
            return;
        }

        this.updateAimFromEvent(event);
    }

    handlePointerDown(event) {
        if (!this.state.demoRunning || event.button > 0) {
            return;
        }

        this.state.activePointerId = event.pointerId;
        this.canvas.setPointerCapture?.(event.pointerId);
        this.updateAimFromEvent(event);
        this.state.archer.beginDraw();
        this.chargeStartedAt = performance.now();
    }

    handlePointerUp(event) {
        if (this.state.activePointerId !== event.pointerId) {
            return;
        }

        this.updateAimFromEvent(event);
        this.updateCharge(performance.now());
        this.fireArrow();
        this.state.activePointerId = null;
        this.state.archer.release();

        this.releasePointer(event.pointerId);
    }

    handlePointerCancel(event) {
        if (this.state.activePointerId !== event.pointerId) {
            return;
        }

        this.state.activePointerId = null;
        this.state.archer.cancelDraw();
        this.releasePointer(event.pointerId);
    }

    handlePointerLeave(event) {
        if (event.pointerType === 'mouse' && this.state.activePointerId === null) {
            this.state.archer.rest();
        }
    }

    handleKeyDown(event) {
        if (!this.state.demoRunning) {
            return;
        }

        const directions = {
            ArrowLeft: [-34, 0],
            KeyA: [-34, 0],
            ArrowRight: [34, 0],
            KeyD: [34, 0],
            ArrowUp: [0, -28],
            KeyW: [0, -28],
            ArrowDown: [0, 28],
            KeyS: [0, 28],
        };

        if (directions[event.code]) {
            event.preventDefault();
            const [deltaX, deltaY] = directions[event.code];
            const { aimTarget } = this.state.archer;
            this.state.archer.setAimTarget(aimTarget.x + deltaX, aimTarget.y + deltaY);

            if (this.state.activePointerId === 'keyboard') {
                this.state.archer.state = 'drawing';
            }
            return;
        }

        if (event.code === 'Space' && !event.repeat && this.state.activePointerId === null) {
            event.preventDefault();
            this.state.activePointerId = 'keyboard';
            this.state.archer.beginDraw();
            this.chargeStartedAt = performance.now();
        }
    }

    handleKeyUp(event) {
        if (event.code !== 'Space' || this.state.activePointerId !== 'keyboard') {
            return;
        }

        event.preventDefault();
        this.updateCharge(performance.now());
        this.fireArrow();
        this.state.activePointerId = null;
        this.state.archer.release();
    }

    updateAimFromEvent(event) {
        const bounds = this.canvas.getBoundingClientRect();
        const x = (event.clientX - bounds.left) * (this.canvas.width / bounds.width);
        const y = (event.clientY - bounds.top) * (this.canvas.height / bounds.height);
        this.state.archer.setAimTarget(x, y);

        if (this.state.activePointerId === event.pointerId) {
            this.state.archer.state = 'drawing';
        }
    }

    updateCharge(timestamp) {
        if (this.state.activePointerId === null) {
            return;
        }

        const heldFor = (timestamp - this.chargeStartedAt) / 1000;
        this.state.archer.setCharge(.25 + heldFor / 1.05);
    }

    fireArrow() {
        const { archer, bow, currentBow } = this.state;
        const firedAt = this.now();
        const shotsPerSecond = Math.max(.1, Number(bow.shotsPerSecond) || 1);
        const minimumInterval = 1000 / shotsPerSecond;

        if (firedAt - this.lastShotAt < minimumInterval) {
            return false;
        }

        const maximumSpread = (3.2 / bow.precision) * (Math.PI / 180);
        const spread = (this.random() * 2 - 1) * maximumSpread;
        const intendedAngle = archer.aimAngle;
        const angle = intendedAngle + spread;
        const distanceFromArcher = 98;

        const x = archer.x + Math.cos(angle) * distanceFromArcher;
        const y = archer.renderY + Math.sin(angle) * distanceFromArcher - 8;

        const arrow = new Arrow({
            x,
            y,
            angle,
            power: archer.charge,
            bowLevel: currentBow,
            bow,
            // No Canvas, ângulos positivos apontam para baixo. Isso equivale
            // ao ângulo negativo percebido pelo jogador no plano cartesiano.
            canHitWater: intendedAngle > 0,
        });
        this.state.arrows.push(arrow);
        this.particleSystem.emitShot(x, y, angle, bow);
        this.onSound('shoot', {
            bowLevel: arrow.bowLevel,
            arrowName: arrow.arrowName,
            visualEffect: arrow.visualEffect,
        });
        this.state.shots += 1;
        this.lastShotAt = firedAt;
        return true;
    }

    setCurrentBow(level) {
        if (this.state.demoRunning || !this.bowSystem.equip(level)) {
            return false;
        }

        this.state.currentBow = this.bowSystem.currentLevel;
        this.state.bow = this.bowSystem.current;
        this.state.arrows = [];
        this.syncBow();
        return true;
    }

    buyBow(level) {
        const numericLevel = Number(level);

        if (this.state.demoRunning) {
            return { success: false, reason: 'round-running' };
        }

        if (this.bowSystem.isUnlocked(numericLevel)) {
            return { success: false, reason: 'already-unlocked' };
        }

        if (!this.bowSystem.canUnlock(numericLevel)) {
            return { success: false, reason: 'previous-bow-required' };
        }

        const bow = GAME_CONFIG.bows[numericLevel];
        const price = Number(bow.price);

        if (!this.coinSystem.spend(price)) {
            return {
                success: false,
                reason: 'insufficient-coins',
                price,
                balance: this.coinSystem.totalCoins,
            };
        }

        this.bowSystem.unlock(numericLevel);
        this.syncStats();
        this.syncBow();
        return {
            success: true,
            level: numericLevel,
            price,
            balance: this.coinSystem.totalCoins,
        };
    }

    syncBow() {
        this.onBowChange({
            level: this.state.currentBow,
            bow: this.state.bow,
            unlockedBows: [...this.bowSystem.unlockedLevels],
        });
    }

    updateArrows(delta) {
        this.state.arrows.forEach((arrow) => arrow.update(delta));
        this.state.arrows = this.state.arrows.filter((arrow) => arrow.active);
    }

    resolveEnvironmentCollisions() {
        const waterSurfaceY = 548;
        this.state.arrows.forEach((arrow) => {
            const crossedWater = arrow.active
                && arrow.canHitWater === true
                && arrow.previousY < waterSurfaceY
                && arrow.y >= waterSurfaceY
                && arrow.x > 480
                && arrow.x < 970;

            if (crossedWater) {
                arrow.active = false;
                this.particleSystem.emitSplash(arrow.x, waterSurfaceY);
                this.onSound('splash');
            }
        });
        this.state.arrows = this.state.arrows.filter((arrow) => arrow.active);
    }

    updateDucks(delta) {
        this.state.ducks.forEach((duck) => duck.update(delta));
        this.state.ducks = this.state.ducks.filter((duck) => duck.active);

        if (this.state.demoRunning) {
            this.spawnSystem.update(delta, this.state.ducks, GAME_CONFIG.ducks);
        } else if (this.state.ducks.length === 0) {
            this.state.ducks.push(this.createInitialDuck(38));
        }
    }

    resolveCollisions() {
        const hits = resolveArrowDuckCollisions(this.state.arrows, this.state.ducks);

        hits.forEach(({ arrow, duck, defeated }) => {
            this.particleSystem.emitArrowImpact(arrow, duck);
            this.particleSystem.emitDuckImpact(duck, defeated);
            this.onSound(defeated ? 'duck' : 'hit', {
                bowLevel: arrow.bowLevel,
                arrowName: arrow.arrowName,
                visualEffect: arrow.visualEffect,
                defeated,
            });

            if (!defeated) {
                return;
            }

            const points = this.scoreSystem.awardDuck(duck);
            const coins = this.coinSystem.collectFromDuck(duck);
            this.particleSystem.emitCoins(duck.x, duck.y, coins);
            this.onSound('coin');
            this.state.hits += 1;
            this.state.rewardPopups.push({
                x: duck.x,
                y: duck.y - 30,
                points,
                coins,
                age: 0,
                active: true,
            });
        });

        if (hits.some((hit) => hit.defeated)) {
            this.syncStats();
        }

        this.state.arrows = this.state.arrows.filter((arrow) => arrow.active);
    }

    updateRewardPopups(delta) {
        this.state.rewardPopups.forEach((popup) => {
            popup.age += delta;
            popup.y -= 34 * delta;
            popup.active = popup.age < 1.15;
        });
        this.state.rewardPopups = this.state.rewardPopups.filter((popup) => popup.active);
    }

    syncStats() {
        this.state.score = this.scoreSystem.score;
        this.state.coinsEarned = this.coinSystem.roundCoins;
        this.state.totalCoins = this.coinSystem.totalCoins;
        this.onStatsChange({
            score: this.state.score,
            coinsEarned: this.state.coinsEarned,
            totalCoins: this.state.totalCoins,
            hits: this.state.hits,
        });
    }

    updateRound(delta) {
        const ended = this.roundSystem.update(delta);
        this.state.timeRemaining = this.roundSystem.timeRemaining;
        this.state.difficulty = this.spawnSystem.setDifficulty(this.roundSystem.progress);
        this.syncRoundStatus();

        if (ended) {
            this.endRound();
            return true;
        }

        return false;
    }

    syncRoundStatus(force = false) {
        const displayedSecond = Math.ceil(this.state.timeRemaining);

        if (!force && displayedSecond === this.lastReportedSecond) {
            return;
        }

        this.lastReportedSecond = displayedSecond;
        this.onRoundUpdate({
            timeRemaining: displayedSecond,
            difficulty: this.state.difficulty,
            status: this.state.roundStatus,
        });
    }

    endRound() {
        this.state.demoRunning = false;
        this.state.roundStatus = 'finished';
        this.state.timeRemaining = 0;
        this.state.activePointerId = null;
        this.state.archer.cancelDraw();
        this.state.archer.rest();
        this.state.arrows = [];
        this.particleSystem.emitCelebration(this.canvas.width);
        this.onSound('victory');
        this.syncRoundStatus(true);
        this.onRoundEnd({
            score: this.state.score,
            coinsEarned: this.state.coinsEarned,
            totalCoins: this.state.totalCoins,
            hits: this.state.hits,
            shots: this.state.shots,
        });
    }

    createInitialDuck(speed = 76) {
        const duckConfig = GAME_CONFIG.ducks.common;

        return new Duck({
            x: 820,
            y: 275,
            direction: -1,
            speed,
            type: 'common',
            name: duckConfig.name,
            health: duckConfig.health,
            points: duckConfig.points,
            coins: duckConfig.coins,
            movement: duckConfig.movement,
            size: duckConfig.size,
            bodyColor: duckConfig.bodyColor,
            wingColor: duckConfig.wingColor,
            headColor: duckConfig.headColor,
            waveAmplitude: 18,
            phase: 1.2,
        });
    }

    releasePointer(pointerId) {
        if (this.canvas.hasPointerCapture?.(pointerId)) {
            this.canvas.releasePointerCapture(pointerId);
        }
    }

    loop(timestamp) {
        const delta = Math.min((timestamp - this.lastFrame) / 1000, .05);
        this.lastFrame = timestamp;
        this.state.elapsed += delta;
        this.state.archer.update(delta, this.state.elapsed);

        if (this.state.demoRunning) {
            const ended = this.updateRound(delta);

            if (!ended) {
                this.updateCharge(timestamp);
                this.updateArrows(delta);
                this.updateDucks(delta);
                this.updateRewardPopups(delta);
                this.resolveCollisions();
                this.resolveEnvironmentCollisions();
            }
        } else {
            this.updateDucks(delta);
            this.updateRewardPopups(delta);
        }

        this.state.particles = this.particleSystem.update(delta);

        this.renderer.render(this.state);
        this.frameRequest = requestAnimationFrame(this.loop);
    }
}
