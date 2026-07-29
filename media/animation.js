import { createCharacter } from './characters.js';

export function startAnimation(canvas, ctx, characters, dimensions) {
    if (dimensions.height !== canvas.height || dimensions.width !== canvas.width) {
        canvas.height = dimensions.height;
        canvas.width = dimensions.width;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    characters.forEach(character => {
        character.update(canvas);
        character.draw(ctx);
    });

    requestAnimationFrame(() => startAnimation(canvas, ctx, characters, dimensions));
}