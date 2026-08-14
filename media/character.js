import { updateMovement, bounceMovement } from './movement.js';

export class Character {
    #DEFAULT_SPEED = 0;
    #DEFAULT_FRAME_DELAY = 1;

    #currentAnimation;
    #savedState;
    #isActing;
    #pendingAction;
    #sustainCounter;
    #sustainLimit;

    constructor(spriteSheet, config) {
        this.spriteSheet = spriteSheet;
        this.layout = config.layout;
        this.animations = config.animations;
        this.behavior = config.behavior; 

        this.startingAnimation = config.startingAnimation;
        this.allAnimations = Object.keys(this.animations);

        this.actions = this.allAnimations.filter(name =>
            this.animations[name].type === 'action'
        );
        this.movements = this.allAnimations.filter(name =>
            this.animations[name].type === 'movement'
        );

        this.#savedState = null;
        this.#pendingAction = null;

        this.posX = 0;
        this.posY = 0;
        this.currentDirection = 'down';
        this.currentSprite = 0;
        this.#currentAnimation = this.startingAnimation ?? 'walk';
        this.frameAccumulator = 0;
        this.#sustainCounter = 0;
        this.#sustainLimit = 0;
        this.#isActing = false;
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
        this.actionDelay = 0;
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
        return this.#shouldTrigger(this.frameCounter, this.directionChange);
    }

    #shouldTrigger(counter, interval) {
        return counter % interval === 0;
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

    #advanceAnimationSprite() {
        const frameDelay = this.animations[this.#currentAnimation]?.frameDelay ?? this.#DEFAULT_FRAME_DELAY;
        this.frameAccumulator += 1 / frameDelay;

        if (this.frameAccumulator >= 1.0) {
            this.currentSprite = (this.currentSprite + 1) % this.animations[this.#currentAnimation].spritesPerRow;
            this.frameAccumulator -= 1.0;
        }
    }

    #handleIdle() {
        if (this.idleCounter >= this.idleDuration) {
            this.idleDuration = this.#randomBetween(
                this.behavior.idleDurationRange.min, 
                this.behavior.idleDurationRange.max
            );

            this.#pendingAction = null;
            this.isIdle = false;
            this.idleCounter = 0;
            return;
        }

        if (this.#pendingAction && this.idleCounter >= this.actionDelay) {
            const actionName = this.#pendingAction;
            const success = this.playAction(actionName);
            this.#pendingAction = null;
            if (!success) {
                console.warn(`Action ${actionName} could not be executed`);
            }
            return;
        }

        ++this.idleCounter;
        this.currentSprite = 0;
    }

    #handleMovement(canvas) {
        if (this.#shouldTrigger(this.frameCounter, this.idleTrigger)) {
            this.idleTrigger = this.#randomBetween(
                this.behavior.idleTriggerRange.min, 
                this.behavior.idleTriggerRange.max
            );
            
            const actionName = this.#pickRandomAction();

            if (actionName && this.#shouldTryAction(actionName)) {
                this.#pendingAction = actionName;
                this.actionDelay = this.#randomBetween(
                    this.behavior.actionDelayRange.min,
                    this.behavior.actionDelayRange.max
                );
            } else {
                this.#pendingAction = null;
            }

            this.isIdle = true;
            this.idleCounter = 0;
            return;
        }

        this.#advanceAnimationSprite();
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

    #handleAction() {
        if (this.currentSprite === this.animations[this.#currentAnimation].spritesPerRow - 1) {
            ++this.#sustainCounter;

            this.#restoreStateBeforeAction();

            if (this.#sustainCounter >= this.#sustainLimit) {
                this.#sustainCounter = 0;
                this.#isActing = false;
                this.currentAnimation = 'walk';
            }
            
        } else {
            this.#advanceAnimationSprite();
        }
    }

    #stateBeforeAction() {
        if (this.#savedState === null) {
            this.#savedState = {
                idle: {
                    counter: this.idleCounter,
                    duration: this.idleDuration
                },
                wasIdle: this.isIdle,
                animation: this.#currentAnimation
            };
        }
    }

    #restoreStateBeforeAction() {
        this.idleCounter = this.#savedState.idle.counter;
        this.idleDuration = this.#savedState.idle.duration;
        this.isIdle = this.#savedState.wasIdle;
        this.#currentAnimation = this.#savedState.animation;

        this.#savedState = null;

    }

    #shouldTryAction(actionName) {
        const anim = this.animations[actionName];
        const chance = anim.chance ?? 0;
        return Math.random() < chance / 100;
    }

    #pickRandomAction() {
        const availableActions = this.actions.filter(name => {
            const anim = this.animations[name];
            const allowed = anim.allowedDirections || [];
            return allowed.includes(this.currentDirection);
        });

        if (availableActions.length === 0) { return null; }

        return availableActions[Math.floor(Math.random() * availableActions.length)];
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

    #currentAnimData() {
        return this.animations[this.#currentAnimation];
    }

    playAction(actionName) {
        if (this.#isActing) { return false; }

        if (!actionName) {
            actionName = this.#pickRandomAction();
            if (!actionName) { return false; }
        }

        const anim = this.animations[actionName];
        if (!anim) { return false; }

        if (anim.type !== 'action') { return false; }

        this.#stateBeforeAction();
        this.#isActing = true;
        this.currentAnimation = actionName;

        return true;
    }

    get currentAnimation() {
        return this.#currentAnimation;
    }

    set currentAnimation(name) {
        if (this.animations[name]) {
            this.#sustainLimit = (this.animations[name].sustainSeconds ?? 0) * 60;
            this.frameAccumulator = 0;
            this.currentSprite = 0;
            this.#currentAnimation = name;
        }
    }

    update(canvas) {
        if (this.#isActing) {
            this.#handleAction();
            return;
        }

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
