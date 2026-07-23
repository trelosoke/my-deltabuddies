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

/** @type {{krisUri: string}} */
const characters = JSON.parse(canvas.dataset.characters);

const krisSpriteSheet = new Image();
let characterSpriteSheet = krisSpriteSheet;

const totalFrames = 4;
const totalAnimationLines = 4;
const spriteWidth = 32;
const spriteHeight = 48;

let currentFrame = 0;
let frameCounter = 1;
const FRAMES_PER_SPRITE = 14;

const CenterX = canvas.width / 2;
const CenterY = canvas.height / 2;
let spriteCenterX;
let spriteCenterY;

let posX = CenterX, 
    posY = CenterY;
let currentDirection = 'down';
let isIdle = false;
let idleCounter = 0;

const speed = 0.4;
const spriteDirectionLine = { down: 0, left: 1, right: 2, up: 3};

function updateMovement() {
    const movements = {
        right: () => { posX += speed; },
        left: () => { posX -= speed; },
        up: () => { posY -= speed; },
        down: () => { posY += speed; }
    };

    movements[currentDirection]();
}

function bounceMovement(pos, spriteCenter, min, max, [towardMin, towardMax]) {
    if (pos + spriteCenter + speed > max) {
        return towardMin;
    } else if (pos - speed < min) {
        return towardMax;
    }
    return null;
}

let idleDuration = Math.floor(Math.random() * (260 - 90) + 90);
let animationIdleInterval = Math.floor(Math.random() * (720 - 300) + 300);
let directionTrigger = Math.floor(Math.random() * (260 - 80) + 80);

const scale = 2;
let spriteWidthUpscale = spriteWidth * scale;
let spriteHeightUpscale = spriteHeight * scale;

let newDirectionX;
let newDirectionY;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spriteCenterX = spriteWidthUpscale / 2;
    spriteCenterY = spriteHeightUpscale / 2;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        characterSpriteSheet,
        currentFrame * spriteWidth, spriteDirectionLine[currentDirection] * spriteHeight,
        spriteWidth, spriteHeight,
        posX - spriteCenterX, posY - spriteCenterY,
        spriteWidthUpscale, spriteHeightUpscale
    );

    if (!isIdle) {
        if (frameCounter % animationIdleInterval === 0){
            animationIdleInterval = Math.floor(Math.random() * (720 - 300) + 300);
            isIdle = true;
            idleCounter = 0;
        }

        if (frameCounter % FRAMES_PER_SPRITE === 0) {
            currentFrame = (currentFrame + 1) % totalFrames;
        }

        const directions = ['right', 'left', 'up', 'down'];
        if (frameCounter % directionTrigger === 0) {
            directionTrigger = Math.floor(Math.random() * (260 - 80) + 80);
            currentDirection = directions[Math.floor(Math.random() * 4)];
        }

        newDirectionX = bounceMovement(posX, spriteCenterX, spriteCenterX, canvas.width, ['left', 'right']);
        newDirectionY = bounceMovement(posY, spriteCenterY, spriteCenterY, canvas.height, ['up', 'down']);

        if (newDirectionX) {
            currentDirection = newDirectionX;
        } else if (newDirectionY) {
            currentDirection = newDirectionY;
        }

        updateMovement();
    }

    if (isIdle) {
        if (idleCounter >= idleDuration) {
            idleDuration = Math.floor(Math.random() * (260 - 90) + 90);
            isIdle = false;
            idleCounter = 0;
        } else {
            ++idleCounter;
            currentFrame = 0;
        }
    }

    ++frameCounter;

    requestAnimationFrame(animate);
}

krisSpriteSheet.onload = () => {
    animate(krisSpriteSheet);
};

krisSpriteSheet.src = characters.krisUri;