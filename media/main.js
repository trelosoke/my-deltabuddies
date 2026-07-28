import { createCharacter } from './characters.js';
import { charactersConfig } from './charactersConfig.js';
import { startAnimation } from './animation.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('aquarium');

canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

const resizeObserver = new ResizeObserver(() => {
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;
});

resizeObserver.observe(document.body);

const characters = [];

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

characterData.forEach(data => {
    const img = new Image();
    
    img.onload = () => {
        const character = createCharacter(img, data.config);
        characters.push(character);

        console.log(characters);
        if (characters.length === characterData.length) {
            startAnimation(canvas, ctx, characters);
        }
    };

    img.src = data.src;
});
