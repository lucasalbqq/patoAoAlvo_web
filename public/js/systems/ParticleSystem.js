export class ParticleSystem {
    constructor(random = Math.random, maxParticles = 180) {
        this.random = random;
        this.maxParticles = maxParticles;
        this.particles = [];
    }

    clear() {
        this.particles.length = 0;
    }

    emitShot(x, y, angle, color) {
        for (let index = 0; index < 6; index += 1) {
            const spread = (this.random() - .5) * 1.1;
            const speed = 55 + this.random() * 80;
            this.add({
                x,
                y,
                velocityX: -Math.cos(angle + spread) * speed,
                velocityY: -Math.sin(angle + spread) * speed,
                gravity: 0,
                life: .22 + this.random() * .18,
                size: 2 + this.random() * 3,
                color,
                shape: 'spark',
            });
        }
    }

    emitDuckImpact(duck, defeated) {
        const impactColor = duck.type === 'golden' ? '#ffe04a' : duck.headColor;

        for (let index = 0; index < (defeated ? 12 : 7); index += 1) {
            const angle = this.random() * Math.PI * 2;
            const speed = 70 + this.random() * 150;
            this.add({
                x: duck.x,
                y: duck.y,
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                gravity: 160,
                life: .38 + this.random() * .42,
                size: 3 + this.random() * 4,
                color: impactColor,
                shape: 'spark',
            });
        }

        if (defeated) {
            for (let index = 0; index < 7; index += 1) {
                this.add({
                    x: duck.x + (this.random() - .5) * 35,
                    y: duck.y + (this.random() - .5) * 20,
                    velocityX: (this.random() - .5) * 150,
                    velocityY: -70 - this.random() * 130,
                    gravity: 230,
                    life: .8 + this.random() * .55,
                    size: 7 + this.random() * 5,
                    color: '#fff8df',
                    shape: 'feather',
                    rotationSpeed: (this.random() - .5) * 8,
                });
            }
        }
    }

    emitCoins(x, y, amount) {
        const count = Math.min(8, 3 + Math.ceil(amount / 20));

        for (let index = 0; index < count; index += 1) {
            this.add({
                x: x + (this.random() - .5) * 24,
                y,
                velocityX: (this.random() - .5) * 110,
                velocityY: -100 - this.random() * 120,
                gravity: 260,
                life: .7 + this.random() * .45,
                size: 7 + this.random() * 3,
                color: '#ffc928',
                shape: 'coin',
                rotationSpeed: 5 + this.random() * 5,
            });
        }
    }

    emitSplash(x, y) {
        for (let index = 0; index < 16; index += 1) {
            const direction = (this.random() - .5) * Math.PI;
            const speed = 90 + this.random() * 180;
            this.add({
                x,
                y,
                velocityX: Math.sin(direction) * speed,
                velocityY: -Math.abs(Math.cos(direction) * speed) - 35,
                gravity: 480,
                life: .45 + this.random() * .4,
                size: 3 + this.random() * 6,
                color: index % 3 === 0 ? '#e9ffff' : '#64def1',
                shape: 'drop',
            });
        }
    }

    emitCelebration(width = 1280) {
        const colors = ['#ffe04a', '#65df45', '#39a9ff', '#ff7a45', '#d46bff'];

        for (let index = 0; index < 60; index += 1) {
            this.add({
                x: this.random() * width,
                y: -20 - this.random() * 160,
                velocityX: (this.random() - .5) * 90,
                velocityY: 80 + this.random() * 150,
                gravity: 45,
                life: 2.4 + this.random() * 1.2,
                size: 5 + this.random() * 6,
                color: colors[Math.floor(this.random() * colors.length)],
                shape: 'confetti',
                rotationSpeed: (this.random() - .5) * 9,
            });
        }
    }

    update(delta) {
        for (let index = this.particles.length - 1; index >= 0; index -= 1) {
            const particle = this.particles[index];
            particle.age += delta;

            if (particle.age >= particle.life) {
                this.particles.splice(index, 1);
                continue;
            }

            particle.velocityY += particle.gravity * delta;
            particle.x += particle.velocityX * delta;
            particle.y += particle.velocityY * delta;
            particle.rotation += particle.rotationSpeed * delta;
            particle.alpha = 1 - particle.age / particle.life;
        }

        return this.particles;
    }

    add(data) {
        if (this.particles.length >= this.maxParticles) {
            this.particles.shift();
        }

        this.particles.push({
            age: 0,
            alpha: 1,
            rotation: 0,
            rotationSpeed: 0,
            ...data,
        });
    }
}

