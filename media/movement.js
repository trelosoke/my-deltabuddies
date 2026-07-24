export function updateMovement(posX, posY, currentDirection, speed) {
    const movements = {
        right: () => ({ posX: posX + speed, posY }),
        left: () => ({ posX: posX - speed, posY }),
        up: () => ({ posX, posY: posY - speed }),
        down: () => ({ posX, posY: posY + speed })
    };

    return movements[currentDirection]();
}

export function bounceMovement(pos, spriteCenter, speed, min, max, [towardMin, towardMax]) {
    if (pos + spriteCenter + speed > max) {
        return towardMin;
    } else if (pos - speed < min) {
        return towardMax;
    }
    return null;
}