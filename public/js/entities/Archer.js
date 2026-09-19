const AIM_LIMITS = {
    minX: 285,
    maxX: 1260,
    minY: 80,
    maxY: 650,
};

export class Archer {
    constructor({ x = 220, y = 512 } = {}) {
        this.x = x;
        this.y = y;
        this.renderY = y;
        this.aimTarget = { x: 875, y: 310 };
        this.aimAngle = Math.atan2(
            this.aimTarget.y - this.y,
            this.aimTarget.x - this.x,
        );
        this.state = 'idle';
        this.isAiming = false;
        this.breath = 0;
        this.blink = 0;
        this.blinkTimer = 2.4;
        this.charge = 0;
        this.recoil = 0;
    }

    setAimTarget(x, y) {
        this.aimTarget.x = clamp(x, AIM_LIMITS.minX, AIM_LIMITS.maxX);
        this.aimTarget.y = clamp(y, AIM_LIMITS.minY, AIM_LIMITS.maxY);
        this.isAiming = true;
        this.state = 'aiming';
    }

    rest() {
        this.isAiming = false;
        this.state = 'idle';
        this.charge = 0;
    }

    beginDraw() {
        this.isAiming = true;
        this.state = 'drawing';
        this.charge = .25;
    }

    setCharge(value) {
        this.charge = clamp(value, .25, 1);

        if (this.state !== 'released') {
            this.state = 'drawing';
        }
    }

    release() {
        this.state = 'released';
        this.charge = 0;
        this.recoil = .16;
    }

    cancelDraw() {
        this.charge = 0;
        this.state = this.isAiming ? 'aiming' : 'idle';
    }

    update(delta, elapsed) {
        if (this.recoil > 0) {
            this.recoil = Math.max(0, this.recoil - delta);

            if (this.recoil === 0 && this.state === 'released') {
                this.state = this.isAiming ? 'aiming' : 'idle';
            }
        }

        const desiredAngle = Math.atan2(
            this.aimTarget.y - this.y,
            this.aimTarget.x - this.x,
        );
        const smoothing = 1 - Math.exp(-12 * delta);
        this.aimAngle += shortestAngle(this.aimAngle, desiredAngle) * smoothing;

        this.breath = Math.sin(elapsed * 2.6);
        this.renderY = this.y + this.breath * (this.isAiming ? .8 : 2.2);

        this.blinkTimer -= delta;
        if (this.blinkTimer <= 0) {
            this.blink = Math.min(1, this.blink + delta * 15);

            if (this.blink >= 1) {
                this.blinkTimer = 2.1 + Math.random() * 2.8;
            }
        } else {
            this.blink = Math.max(0, this.blink - delta * 18);
        }
    }
}

function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
}

function shortestAngle(current, target) {
    return Math.atan2(Math.sin(target - current), Math.cos(target - current));
}
