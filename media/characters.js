import { updateMovement, bounceMovement } from './movement.js';

const FRAME_DELAY = 15;
const DIRECTIONS = ['down', 'left', 'right', 'up'];

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function pickRandomDirection(frameCounter, directionChange, currentDirection, config) {
    if (frameCounter % directionChange === 0) {
        directionChange = randomBetween(config.directionChangeRange.min, config.directionChangeRange.max);
        currentDirection = DIRECTIONS[Math.floor(Math.random() * 4)];
    }

    return { directionChange, currentDirection };
}

export function createCharacter(spriteSheet, config) {
    let posX = config.startX;
    let posY = config.startY;
    let currentDirection = 'down';
    let currentFrame = 0;
    let isIdle = false;
    let idleCounter = 0;
    let frameCounter = 1;
    
    let idleDuration = randomBetween(config.idleDurationRange.min, config.idleDurationRange.max);
    let idleTrigger = randomBetween(config.idleTriggerRange.min, config.idleTriggerRange.max);
    let directionChange = randomBetween(config.directionChangeRange.min, config.directionChangeRange.max);

    const spriteWidthUpscale = config.spriteWidth * config.scale;
    const spriteHeightUpscale = config.spriteHeight * config.scale;
    const spriteCenterX = spriteWidthUpscale / 2;
    const spriteCenterY = spriteHeightUpscale / 2;

    function handleIdle() {
        if (idleCounter >= idleDuration) {
            idleDuration = randomBetween(config.idleDurationRange.min, config.idleDurationRange.max);
            isIdle = false;
            idleCounter = 0;
            return;
        }

        ++idleCounter;
        currentFrame = 0;
    }

    function handleMovement(canvas) {
        if (frameCounter % idleTrigger === 0) {
            idleTrigger = randomBetween(config.idleTriggerRange.min, config.idleTriggerRange.max);
            isIdle = true;
            idleCounter = 0;
            return;
        }

        if (frameCounter % FRAME_DELAY === 0) {
            currentFrame = (currentFrame + 1) % config.totalFrames;
        }

        const newDirectionState = pickRandomDirection(frameCounter, directionChange, currentDirection, config);
        directionChange = newDirectionState.directionChange;
        currentDirection = newDirectionState.currentDirection;

        let collisionCorrectedDirectionX = bounceMovement(posX, spriteCenterX, config.speed, spriteCenterX, canvas.width, ['left', 'right']);
        let collisionCorrectedDirectionY = bounceMovement(posY, spriteCenterY, config.speed, spriteCenterY, canvas.height, ['up', 'down']);

        if (collisionCorrectedDirectionX) {
            currentDirection = collisionCorrectedDirectionX;
        } else if (collisionCorrectedDirectionY) {
            currentDirection = collisionCorrectedDirectionY;
        }

        const newPosition = updateMovement(posX, posY, currentDirection, config.speed);
        posX = newPosition.posX;
        posY = newPosition.posY;
    }

    function update(canvas) {
        if (isIdle) {
            handleIdle();
            return;
        }
        handleMovement(canvas);
    }

    function draw(ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            spriteSheet,
            currentFrame * config.spriteWidth, 
            config.directionLine[currentDirection] * config.spriteHeight,
            config.spriteWidth, 
            config.spriteHeight,
            posX - spriteCenterX, 
            posY - spriteCenterY,
            spriteWidthUpscale, 
            spriteHeightUpscale
        );
    }
}