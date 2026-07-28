import { createCharacter } from './characters.js';

export function startAnimation(canvas, ctx, characters) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    characters.forEach(character => {
        character.update(canvas);
        character.draw(ctx);
    });

    requestAnimationFrame(() => startAnimation(canvas, ctx, characters));
}