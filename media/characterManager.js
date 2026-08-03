import { Character } from './character.js';

export class CharacterManager {
    #characters = [];

    addCharacter(character) {
        this.#characters.push(character);
    }

    removeCharacter(character) {
        const index = this.#characters.indexOf(character);
        if (index !== -1) {
            this.#characters.splice(index, 1);
        }
    }

    updateAll(canvas) {
        this.#characters.forEach(character => {
            character.update(canvas);
        });
    }

    drawAll(ctx) {
        this.#characters.forEach(character => {
            character.draw(ctx);
        });
    }

    #canvasSizeChanged(canvas, dimensions) {
        return dimensions.height !== canvas.height || dimensions.width !== canvas.width;
    }

    #applyResize(canvas, dimensions) {
        canvas.height = dimensions.height;
        canvas.width = dimensions.width;
    }

    handleResize(canvas, dimensions) {
        if (this.#canvasSizeChanged(canvas, dimensions)) {
            this.#applyResize(canvas, dimensions);
            this.#characters.forEach(character => character.clampPosition(canvas));
        }
    }
}