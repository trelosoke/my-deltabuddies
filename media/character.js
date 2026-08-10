import { updateMovement, bounceMovement } from './movement.js';

export class Character {
    #DEFAULT_SPEED = 0;
    #DEFAULT_FRAME_DELAY = 1;

    #currentAnimation;

    constructor(spriteSheet, config) {
        this.spriteSheet = spriteSheet;
        this.layout = config.layout;
        this.animations = config.animations;
        this.startingAnimation = config.startingAnimation;
        this.behavior = config.behavior; 

        this.posX = 0;
        this.posY = 0;
        this.currentDirection = 'down';
        this.currentSprite = 0;
        this.#currentAnimation = this.startingAnimation ?? 'walk';
        this.frameAccumulator = 0;
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

    #canPickNewDirection() {
        return this.#shoudTrigger(this.directionChange);
    }

    #shoudTrigger(interval) {
        return this.frameCounter % interval === 0;
    }

    #pickRandomDirection() {
        const directionOrder = this.animations[this.#currentAnimation].directionOrder;
        if (directionOrder && this.#canPickNewDirection()) {
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
        this.currentSprite = 0;
    }

    #handleMovement(canvas) {
        if (this.#shoudTrigger(this.idleTrigger)) {
            this.idleTrigger = this.#randomBetween(
                this.behavior.idleTriggerRange.min, 
                this.behavior.idleTriggerRange.max
            );
            
            this.isIdle = true;
            this.idleCounter = 0;
            return;
        }

        const frameDelay = this.animations[this.#currentAnimation]?.frameDelay ?? this.#DEFAULT_FRAME_DELAY;
        this.frameAccumulator += 1 / frameDelay;

        if (this.frameAccumulator >= 1.0) {
            this.currentSprite = (this.currentSprite + 1) % this.animations[this.#currentAnimation].spritesPerRow;
            this.frameAccumulator -= 1.0;
        }

        this.#pickRandomDirection();


        const speed = this.behavior.speeds[this.#currentAnimation] ?? this.#DEFAULT_SPEED;

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

    get #animationRow() {
        const startRow = this.animations[this.#currentAnimation]?.startRow ?? 0;
        const directionMode = this.animations[this.#currentAnimation]?.directionMode ?? 'fixed';
        const directionOrder = this.animations[this.#currentAnimation].directionOrder ?? [];

        if (directionMode === '4way') {
            return startRow + directionOrder.indexOf(this.currentDirection);
        }

        return this.animations[this.#currentAnimation].startRow;
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
            this.currentSprite * this.layout.spriteWidth, 
            this.#animationRow * this.layout.spriteHeight,
            this.layout.spriteWidth, 
            this.layout.spriteHeight,
            this.posX - this.spriteCenterX, 
            this.posY - this.spriteCenterY,
            this.spriteWidthUpscale, 
            this.spriteHeightUpscale
        );
    }
}