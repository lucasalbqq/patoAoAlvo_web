export class Duck {
    constructor({
        x,
        y,
        direction = -1,
        speed = 90,
        type = 'common',
        name = 'Pato Comum',
        health = 1,
        points = 10,
        coins = 10,
        waveAmplitude = 18,
        waveSpeed = 2.2,
        phase = 0,
        movement = 'wave',
        size = 1,
        bodyColor = '#f4f1dc',
        wingColor = '#c9914c',
        headColor = '#26a968',
    }) {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.direction = direction;
        this.speed = speed;
        this.type = type;
        this.name = name;
        this.health = Math.max(1, Number(health) || 1);
        this.maxHealth = this.health;
        this.points = points;
        this.coins = coins;
        this.waveAmplitude = waveAmplitude;
        this.waveSpeed = waveSpeed;
        this.phase = phase;
        this.movement = movement;
        this.size = size;
        this.bodyColor = bodyColor;
        this.wingColor = wingColor;
        this.headColor = headColor;
        this.age = 0;
        this.rotation = 0;
        this.velocityY = 0;
        this.collisionRadius = 31 * size;
        this.hitFlash = 0;
        this.state = 'flying';
        this.active = true;
    }

    update(delta) {
        if (!this.active) {
            return;
        }

        this.age += delta;
        this.hitFlash = Math.max(0, this.hitFlash - delta);

        if (this.state === 'falling') {
            this.velocityY += 720 * delta;
            this.y += this.velocityY * delta;
            this.x += this.direction * this.speed * .28 * delta;
            this.rotation += this.direction * 4.5 * delta;

            if (this.y > 790) {
                this.state = 'dead';
                this.active = false;
            }

            return;
        }

        this.x += this.direction * this.speed * delta;
        this.y = this.calculateFlightY();

        if (this.x < -100 || this.x > 1380) {
            this.active = false;
        }
    }

    takeDamage(damage) {
        if (this.state !== 'flying' || !this.active) {
            return false;
        }

        this.health -= Math.max(0, Number(damage) || 0);
        this.hitFlash = .18;

        if (this.health <= 0) {
            this.state = 'falling';
            this.velocityY = -75;
            return true;
        }

        return false;
    }

    calculateFlightY() {
        const wave = this.age * this.waveSpeed + this.phase;

        switch (this.movement) {
            case 'swift':
                return this.baseY + Math.sin(wave * 1.45) * this.waveAmplitude;
            case 'zigzag':
                return this.baseY + Math.sin(wave * 2.35) * this.waveAmplitude * 1.35;
            case 'heavy':
                return this.baseY + Math.sin(wave * .65) * this.waveAmplitude * .55;
            case 'royal':
                return this.baseY
                    + Math.sin(wave * .7) * this.waveAmplitude * .7
                    + Math.sin(wave * 1.8) * 5;
            default:
                return this.baseY + Math.sin(wave) * this.waveAmplitude;
        }
    }

    get wingAngle() {
        return Math.sin(this.age * 9) * .34;
    }
}
