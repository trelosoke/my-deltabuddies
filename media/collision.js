export function checkCollision(pos1, radius1, pos2, radius2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const distance = Math.hypot(dx, dy);
    return distance < radius1 + radius2;
}