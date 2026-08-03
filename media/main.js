import { Character } from './character.js';
import { CharacterManager } from './characterManager.js';
import { charactersConfig } from './charactersConfig.js';
import { startAnimation } from './animation.js';

function loadCharacter(data) {
    const img = new Image();

    img.onload = () => {
        const character = new Character(img, data.config);
        character.init(canvas);
        manager.addCharacter(character);
    };

    img.src = data.src;
}

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('aquarium');

canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

const dimensions = { width: canvas.width, height: canvas.height };
const resizeObserver = new ResizeObserver(() => {
    dimensions.height = document.body.clientHeight;
    dimensions.width = document.body.clientWidth;
});

resizeObserver.observe(document.body);

/** @type {{krisUri: string}} */
const spritesSource = JSON.parse(canvas.dataset.characters);

const characterData = [
    {
        name: 'kris',
        src: spritesSource.krisUri,
        config: charactersConfig.kris
    },
    {
        name: 'susie',
        src: spritesSource.susieUri,
        config: charactersConfig.susie
    },
    {
        name: 'ralsei',
        src: spritesSource.ralseiUri,
        config: charactersConfig.ralsei
    }
];

const manager = new CharacterManager();
startAnimation(canvas, ctx, manager, dimensions);

characterData.forEach(data => loadCharacter(data));