import { updateMovement, bounceMovement } from './movement.js';

const FRAME_DELAY = 15;
const DIRECTIONS = ['down', 'left', 'right', 'up'];

export class Character {
    #DEFAULT_SPEED = 0;

    constructor(spriteSheet, config) {
        this.spriteSheet = spriteSheet;
        this.layout = config.layout;
        this.animations = config.animations;
        this.behavior = config.behavior; 

        this.posX = 0;
        this.posY = 0;
        this.currentDirection = 'down';
        this.currentFrame = 0;
        this.currentAnimation = 'walk';
        this.isIdle = false;
        this.idleCounter = 0;
        this.frameCounter = 1;

        this.spriteWidthUpscale = this.layout.spriteWidth * this.layout.scale;
        this.spriteHeightUpscale = this.layout.spriteHeight * this.layout.scale;
        this.spriteCenterX = this.spriteWidthUpscale / 2;
        this.spriteCenterY = this.spriteHeightUpscale / 2;
        
        this.idleDuration = this.#randomBetween(
            this.behavior.idleDurationRange.min, 
            this.behavior.idleDurationRange.max
        );
        this.idleTrigger = this.#randomBetween(
            this.behavior.idleTriggerRange.min,
            this.behavior.idleTriggerRange.max
        );
        this.directionChange = this.#randomBetween(
            this.behavior.directionChangeRange.min,
            this.behavior.directionChangeRange.max
        );
    }

    init(canvas) {
        this.posX = typeof this.behavior.startX === 'function' 
            ? this.behavior.startX(canvas.width) 
            : this.behavior.startX;
        this.posY = typeof this.behavior.startY === 'function' 
            ? this.behavior.startY(canvas.height) 
            : this.behavior.startY;
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
        const directionOrder = this.animations[this.currentAnimation].directionOrder;
        if (directionOrder && this.frameCounter % this.directionChange === 0) {
            this.directionChange = this.#randomBetween(
                this.behavior.directionChangeRange.min, 
                this.behavior.directionChangeRange.max
            );
            
            this.currentDirection = directionOrder[Math.floor(Math.random() * directionOrder.length)];
        }
    }

    #handleIdle() {
        if (this.idleCounter >= this.idleDuration) {
            this.idleDuration = this.#randomBetween(
                this.behavior.idleDurationRange.min, 
                this.behavior.idleDurationRange.max
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
                this.behavior.idleTriggerRange.min, 
                this.behavior.idleTriggerRange.max
            );
            
            this.isIdle = true;
            this.idleCounter = 0;
            return;
        }

        if (this.frameCounter % FRAME_DELAY === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.animations[this.currentAnimation].spritesPerRow;
        }

        this.#pickRandomDirection();

        const speed = this.behavior.speeds[this.currentAnimation] ?? this.#DEFAULT_SPEED;

        let collisionCorrectedDirectionX = bounceMovement(
            this.posX, this.spriteCenterX, speed, this.spriteCenterX, canvas.width, ['left', 'right']
        );
        let collisionCorrectedDirectionY = bounceMovement(
            this.posY, this.spriteCenterY, speed, this.spriteCenterY, canvas.height, ['up', 'down']
        );

        if (collisionCorrectedDirectionX) {
            this.currentDirection = collisionCorrectedDirectionX;
        } else if (collisionCorrectedDirectionY) {
            this.currentDirection = collisionCorrectedDirectionY;
        }

        updateMovement(this, speed);
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
            this.currentFrame * this.layout.spriteWidth, 
            this.animations[this.currentAnimation].directionOrder.indexOf(this.currentDirection) * this.layout.spriteHeight,
            this.layout.spriteWidth, 
            this.layout.spriteHeight,
            this.posX - this.spriteCenterX, 
            this.posY - this.spriteCenterY,
            this.spriteWidthUpscale, 
            this.spriteHeightUpscale
        );
    }
}
