export function resolveArrowDuckCollisions(arrows, ducks) {
    const hits = [];

    for (const arrow of arrows) {
        if (!arrow.active) {
            continue;
        }

        for (const duck of ducks) {
            if (!duck.active || duck.state !== 'flying') {
                continue;
            }

            if (!segmentIntersectsCircle(
                arrow.previousX,
                arrow.previousY,
                arrow.x,
                arrow.y,
                duck.x,
                duck.y,
                duck.collisionRadius,
            )) {
                continue;
            }

            arrow.active = false;
            const defeated = duck.takeDamage(arrow.damage);
            hits.push({ arrow, duck, defeated });
            break;
        }
    }

    return hits;
}

export function segmentIntersectsCircle(x1, y1, x2, y2, centerX, centerY, radius) {
    const segmentX = x2 - x1;
    const segmentY = y2 - y1;
    const lengthSquared = segmentX ** 2 + segmentY ** 2;

    if (lengthSquared === 0) {
        return Math.hypot(centerX - x1, centerY - y1) <= radius;
    }

    const projection = (
        (centerX - x1) * segmentX + (centerY - y1) * segmentY
    ) / lengthSquared;
    const t = Math.max(0, Math.min(1, projection));
    const closestX = x1 + segmentX * t;
    const closestY = y1 + segmentY * t;

    return Math.hypot(centerX - closestX, centerY - closestY) <= radius;
}

