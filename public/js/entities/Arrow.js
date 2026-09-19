const WORLD_BOUNDS = {
    left: -100,
    right: 1380,
    top: -160,
    bottom: 820,
};

export class Arrow {
    constructor({ x, y, angle, power, bowLevel, bow, canHitWater = angle > 0 }) {
        const safePower = clamp(power, .25, 1);
        const chargeProgress = (safePower - .25) / .75;
        const launchSpeed = (360 + chargeProgress ** 1.6 * 860) * bow.arrowSpeed;

        this.x = x;
        this.y = y;
        this.previousX = x;
        this.previousY = y;
        this.velocityX = Math.cos(angle) * launchSpeed;
        this.velocityY = Math.sin(angle) * launchSpeed;
        this.gravity = 680;
        this.rotation = angle;
        this.launchAngle = angle;
        this.canHitWater = Boolean(canHitWater);
        this.distance = 0;
        this.age = 0;
        this.power = safePower;
        this.maxDistance = (420 + chargeProgress ** 2.4 * 1180) * bow.range;
        this.maxLifetime = (.85 + chargeProgress * 1.15) * Math.sqrt(bow.range);
        this.damage = bow.damage;
        this.bowLevel = bowLevel;
        this.color = bow.color;
        this.shaftColor = bow.arrowShaft ?? '#e8d3a2';
        this.tipColor = bow.arrowTip ?? '#e6edf0';
        this.arrowName = bow.arrowName ?? 'Flecha';
        this.specialEffect = bow.specialEffect ?? 'none';
        this.specialEffectEnabled = bow.specialEffectEnabled === true;
        this.active = true;
    }

    update(delta) {
        if (!this.active) {
            return;
        }

        this.previousX = this.x;
        this.previousY = this.y;
        this.age += delta;
        this.velocityY += this.gravity * delta;
        this.x += this.velocityX * delta;
        this.y += this.velocityY * delta;
        this.rotation = Math.atan2(this.velocityY, this.velocityX);
        this.distance += Math.hypot(
            this.x - this.previousX,
            this.y - this.previousY,
        );

        if (this.age >= this.maxLifetime || this.distance >= this.maxDistance || this.isOutsideWorld()) {
            this.active = false;
        }
    }

    isOutsideWorld() {
        return this.x < WORLD_BOUNDS.left
            || this.x > WORLD_BOUNDS.right
            || this.y < WORLD_BOUNDS.top
            || this.y > WORLD_BOUNDS.bottom;
    }
}

function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
}
