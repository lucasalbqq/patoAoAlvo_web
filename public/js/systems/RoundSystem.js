export class RoundSystem {
    constructor(duration = 60) {
        const parsedDuration = Number(duration);
        this.duration = Number.isFinite(parsedDuration) && parsedDuration > 0
            ? parsedDuration
            : 60;
        this.elapsed = 0;
        this.timeRemaining = this.duration;
        this.running = false;
    }

    start() {
        this.elapsed = 0;
        this.timeRemaining = this.duration;
        this.running = true;
    }

    stop() {
        this.running = false;
    }

    update(delta) {
        if (!this.running) {
            return false;
        }

        this.elapsed = Math.min(this.duration, this.elapsed + Math.max(0, delta));
        this.timeRemaining = Math.max(0, this.duration - this.elapsed);

        if (this.timeRemaining === 0) {
            this.running = false;
            return true;
        }

        return false;
    }

    get progress() {
        return this.duration === 0 ? 1 : this.elapsed / this.duration;
    }
}

