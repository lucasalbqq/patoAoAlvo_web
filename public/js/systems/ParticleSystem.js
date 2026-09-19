const ARROW_IMPACT_PROFILES = Object.freeze({
    wood: { colors: ['#8f4d27', '#d79a58'], shapes: ['chip'], count: 7, gravity: 260 },
    reinforced: { colors: ['#dceaf0', '#7799aa'], shapes: ['metal'], count: 8, gravity: 220 },
    hunter: { colors: ['#7ed957', '#d7f0a4'], shapes: ['leaf', 'spark'], count: 9, gravity: 130 },
    iron: { colors: ['#eef4f6', '#667984'], shapes: ['metal', 'ring'], count: 10, gravity: 300 },
    fire: { colors: ['#ff5722', '#ffdb45'], shapes: ['ember', 'spark'], count: 15, gravity: -35 },
    ice: { colors: ['#ffffff', '#67ddff'], shapes: ['snowflake', 'shard'], count: 14, gravity: 75 },
    electric: { colors: ['#fffbd0', '#ffe23d'], shapes: ['bolt', 'spark'], count: 13, gravity: 0 },
    crystal: { colors: ['#67f3ea', '#c8a7ff'], shapes: ['shard'], count: 14, gravity: 145 },
    legendary: { colors: ['#ffe36a', '#b84dff'], shapes: ['star', 'spark'], count: 16, gravity: 55 },
    supreme: { colors: ['#ffffff', '#ffd447'], shapes: ['star', 'ring', 'bolt'], count: 20, gravity: 25 },
});

const ARROW_SHOT_PROFILES = Object.freeze({
    wood: { shape: 'chip', count: 4 },
    reinforced: { shape: 'metal', count: 5 },
    hunter: { shape: 'leaf', count: 5 },
    iron: { shape: 'metal', count: 6 },
    fire: { shape: 'ember', count: 9 },
    ice: { shape: 'snowflake', count: 8 },
    electric: { shape: 'bolt', count: 8 },
    crystal: { shape: 'shard', count: 8 },
    legendary: { shape: 'star', count: 9 },
    supreme: { shape: 'star', count: 11 },
});

export class ParticleSystem {
    constructor(random = Math.random, maxParticles = 180) {
        this.random = random;
        this.maxParticles = maxParticles;
        this.particles = [];
    }

    clear() {
        this.particles.length = 0;
    }

    emitShot(x, y, angle, appearance) {
        const isLegacyColor = typeof appearance === 'string';
        const visualEffect = isLegacyColor ? 'default' : appearance?.arrowVisual ?? 'wood';
        const color = isLegacyColor ? appearance : appearance?.color ?? '#ffffff';
        const accentColor = isLegacyColor ? appearance : appearance?.arrowAccent ?? color;
        const profile = ARROW_SHOT_PROFILES[visualEffect] ?? { shape: 'spark', count: 6 };

        for (let index = 0; index < profile.count; index += 1) {
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
                color: index % 2 === 0 ? color : accentColor,
                shape: profile.shape,
            });
        }
    }

    emitArrowImpact(arrow, duck) {
        const visualEffect = arrow?.visualEffect ?? 'wood';
        const profile = ARROW_IMPACT_PROFILES[visualEffect] ?? ARROW_IMPACT_PROFILES.wood;

        for (let index = 0; index < profile.count; index += 1) {
            const angle = this.random() * Math.PI * 2;
            const speed = 65 + this.random() * (visualEffect === 'supreme' ? 210 : 150);
            const shape = profile.shapes[index % profile.shapes.length];
            this.add({
                x: duck.x + (this.random() - .5) * 12,
                y: duck.y + (this.random() - .5) * 12,
                velocityX: shape === 'ring' ? 0 : Math.cos(angle) * speed,
                velocityY: shape === 'ring' ? 0 : Math.sin(angle) * speed,
                gravity: shape === 'ring' ? 0 : profile.gravity,
                life: shape === 'ring' ? .42 : .38 + this.random() * .45,
                size: shape === 'ring' ? 10 : 3 + this.random() * 6,
                growth: shape === 'ring' ? 95 : 0,
                color: profile.colors[index % profile.colors.length],
                secondaryColor: profile.colors[(index + 1) % profile.colors.length],
                shape,
                rotationSpeed: (this.random() - .5) * 11,
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
            particle.size = Math.max(0, particle.size + particle.growth * delta);
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
            growth: 0,
            ...data,
        });
    }
}
