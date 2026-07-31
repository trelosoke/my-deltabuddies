import { updateMovement, bounceMovement } from './movement.js';

const FRAME_DELAY = 15;
const DIRECTIONS = ['down', 'left', 'right', 'up'];

export class Character {
    constructor(spriteSheet, config) {
        this.spriteSheet = spriteSheet;
        this.config = config;

        this.posX = 0;
        this.posY = 0;
        this.currentDirection = 'down';
        this.currentFrame = 0;
        this.isIdle = false;
        this.idleCounter = 0;
        this.frameCounter = 1;

        this.spriteWidthUpscale = this.config.spriteWidth * this.config.scale;
        this.spriteHeightUpscale = this.config.spriteHeight * this.config.scale;
        this.spriteCenterX = this.spriteWidthUpscale / 2;
        this.spriteCenterY = this.spriteHeightUpscale / 2;
        
        this.idleDuration = this.#randomBetween(
            this.config.idleDurationRange.min, 
            this.config.idleDurationRange.max
        );
        this.idleTrigger = this.#randomBetween(
            this.config.idleTriggerRange.min,
            this.config.idleTriggerRange.max
        );
        this.directionChange = this.#randomBetween(
            this.config.directionChangeRange.min,
            this.config.directionChangeRange.max
        );
    }

    init(canvas) {
        this.posX = typeof this.config.startX === 'function' 
            ? this.config.startX(canvas.width) 
            : this.config.startX;
        this.posY = typeof this.config.startY === 'function' 
            ? this.config.startY(canvas.height) 
            : this.config.startY;
    }

    #clamp(value, min, max) {
        if (value < min) { return min; }
        if (value > max) { return max; }
        return value;
    }

    clampPosition(canvas) {
        this.posX = this.#clamp(this.posX, this.spriteCenterX, canvas.width - this.spriteCenterX);
        this.posY = this.#clamp(this.posY, this.spriteCenterY, canvas.height - this.spriteCenterY);
    }

    #randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    #pickRandomDirection() {
        if (this.frameCounter % this.directionChange === 0) {
            this.directionChange = this.#randomBetween(
                this.config.directionChangeRange.min, 
                this.config.directionChangeRange.max
            );
            this.currentDirection = DIRECTIONS[Math.floor(Math.random() * 4)];
        }
    }

    #handleIdle() {
        if (this.idleCounter >= this.idleDuration) {
            this.idleDuration = this.#randomBetween(
                this.config.idleDurationRange.min, 
                this.config.idleDurationRange.max
            );

            this.isIdle = false;
            this.idleCounter = 0;
            return;
        }

        ++this.idleCounter;
        this.currentFrame = 0;
    }

    #handleMovement(canvas) {
        if (this.frameCounter % this.idleTrigger === 0) {
            this.idleTrigger = this.#randomBetween(
                this.config.idleTriggerRange.min, 
                this.config.idleTriggerRange.max
            );
            
            this.isIdle = true;
            this.idleCounter = 0;
            return;
        }

        if (this.frameCounter % FRAME_DELAY === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.config.totalFrames;
        }

        this.#pickRandomDirection();

        let collisionCorrectedDirectionX = bounceMovement(
            this.posX, this.spriteCenterX, this.config.speed, this.spriteCenterX, canvas.width, ['left', 'right']
        );
        let collisionCorrectedDirectionY = bounceMovement(
            this.posY, this.spriteCenterY, this.config.speed, this.spriteCenterY, canvas.height, ['up', 'down']
        );

        if (collisionCorrectedDirectionX) {
            this.currentDirection = collisionCorrectedDirectionX;
        } else if (collisionCorrectedDirectionY) {
            this.currentDirection = collisionCorrectedDirectionY;
        }

        updateMovement(this, this.config.speed);
    }

    update(canvas) {
        if (this.isIdle) {
            this.#handleIdle();
            return;
        }

        this.#handleMovement(canvas);
        ++this.frameCounter;
    }

    draw(ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            this.spriteSheet,
            this.currentFrame * this.config.spriteWidth, 
            this.config.directionLine[this.currentDirection] * this.config.spriteHeight,
            this.config.spriteWidth, 
            this.config.spriteHeight,
            this.posX - this.spriteCenterX, 
            this.posY - this.spriteCenterY,
            this.spriteWidthUpscale, 
            this.spriteHeightUpscale
        );
    }
}