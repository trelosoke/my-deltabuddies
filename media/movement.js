export function updateMovement(character, speed) {
    const movements = {
        right: () => { character.posX += speed; },
        left: () => { character.posX -= speed; },
        up: () => { character.posY -= speed; },
        down: () => { character.posY += speed; }
    };

    movements[character.currentDirection]();
}

export function bounceMovement(pos, spriteCenter, speed, min, max, [towardMin, towardMax]) {
    if (pos + spriteCenter + speed > max) {
        return towardMin;
    } else if (pos - speed < min) {
        return towardMax;
    }
    return null;
}