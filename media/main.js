document.documentElement.style.padding = '0';
document.documentElement.style.margin = '0';
document.documentElement.style.height = '100%';

document.body.style.padding = '0';
document.body.style.margin = '0';
document.body.style.height = '100%';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('aquarium');

canvas.style.display = 'block';
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

function showDebugInfo(pX, pY, scale, wScale, hScale, idle, cDirection, cFrame) {
    ctx.fillStyle = 'black';
    ctx.font = '12px monospace';
    let y = 20;
    ctx.fillText(`posX: ${pX.toFixed(1)}`, 10, y); y += 14;
    ctx.fillText(`posY: ${pY.toFixed(1)}`, 10, y); y += 14;
    ctx.fillText(`scale: ${scale}`, 10, y); y += 14;
    ctx.fillText(`upscaled_width: ${wScale}`, 10, y); y += 14;
    ctx.fillText(`upscaled_height: ${hScale}`, 10, y); y += 14;
    ctx.fillText(`idle: ${idle}`, 10, y); y += 14;
    ctx.fillText(`current_direction: ${cDirection}`, 10, y); y += 14;
    ctx.fillText(`current_frame: ${cFrame}`, 10, y);
}

function drawRect() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

drawRect();

let newHeight = document.body.clientHeight;
let newWidth = document.body.clientHeight;

const resizeObserver = new ResizeObserver(() => {
    newHeight = document.body.clientHeight;
    newWidth = document.body.clientWidth;
});

resizeObserver.observe(document.body);

const krisWalk = new Image();

const totalFrames = 4;
const totalLines = 4;
const frameWidth = 32;
const frameHeight = 48;

let currentFrame = 0;
let frameCounter = 1;
const FRAMES_PER_SPRITE = 10;

const CenterX = canvas.width / 2;
const CenterY = canvas.height / 2;
let spriteCenterX;
let spriteCenterY;

let posX = CenterX, posY = CenterY;
let currentDirection = 'down';
let isIdle = false;
let idleCounter = 0;

const speed = 0.4;
const directionLine = { down: 0, left: 1, right: 2, up: 3};

function updateMovement() {
    const movements = {
        right: () => { posX += speed; },
        left: () => { posX -= speed; },
        up: () => { posY -= speed; },
        down: () => { posY += speed; }
    };

    movements[currentDirection]();
}

function animateKrisWalk() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = 2;

    let widthUpscale = frameWidth * scale;
    let heightUpscale = frameHeight * scale;
    
    spriteCenterX = widthUpscale / 2;
    spriteCenterY = heightUpscale / 2;

    if (canvas.height !== newHeight || canvas.width !== newWidth) {
        canvas.height = newHeight;
        canvas.width = newWidth;
    }

    drawRect();

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        krisWalk,
        currentFrame * frameWidth, directionLine[currentDirection] * frameHeight,
        frameWidth, frameHeight,
        posX - spriteCenterX, posY - spriteCenterY,
        widthUpscale, heightUpscale
    );

    let idleLimit = Math.floor(Math.random() * (260 - 90) + 90);
    let idleFrame = Math.floor(Math.random() * (720 - 300) + 300);
    let directionFrame = Math.floor(Math.random() * (260 - 80) + 80);

    if (!isIdle && frameCounter % idleFrame === 0) {
        isIdle = true;
        idleCounter = 0;
    }

    if (isIdle && idleCounter >= idleLimit) {
        isIdle = false;
        idleCounter = 0;
    }
    
    if (isIdle) {
        ++idleCounter;
        currentFrame = 0;
    } else {

        if (frameCounter % FRAMES_PER_SPRITE === 0) {
            currentFrame = (currentFrame + 1) % totalFrames;
        }

        updateMovement();

        if (posX + spriteCenterX > canvas.width) {
            posX = canvas.width - spriteCenterX;
        }

        if (posX < spriteCenterX) {
            posX = spriteCenterX;
        }

        if (posY + spriteCenterY > canvas.height) {
            posY = canvas.height - spriteCenterY;
        }

        if (posY < spriteCenterY) {
            posY = spriteCenterY;
        }

        const directions = ['right', 'left', 'up', 'down'];
        if (frameCounter % directionFrame === 0) {
            currentDirection = directions[Math.floor(Math.random() * 4)];
        }
    }

    showDebugInfo(
        posX, posY,
        scale, widthUpscale, heightUpscale,
        isIdle,
        currentDirection,
        currentFrame
    );

    ++frameCounter;

    requestAnimationFrame(animateKrisWalk);
}

krisWalk.onload = () => {
    animateKrisWalk();
};

krisWalk.src = canvas.dataset.krisWalkUri;