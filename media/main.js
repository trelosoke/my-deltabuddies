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
let frameCounter = 0;
let animationLine = 0;
const FRAMES_PER_SPRITE = 10;


function animateKrisWalk() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Adds conditional nesting for testing purposes
    if (frameCounter % FRAMES_PER_SPRITE === 0) {
        currentFrame = (currentFrame + 1) % totalFrames;
    }

    const scale = 2.5;

    let widthUpscale = frameWidth * scale;
    let heightUpscale = frameHeight * scale;

    if (canvas.height !== newHeight || canvas.width !== newWidth) {
        canvas.height = newHeight;
        canvas.width = newWidth;
    }

    drawRect();

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        krisWalk,
        currentFrame * frameWidth, animationLine * frameHeight,
        frameWidth, frameHeight,
        0, 0,
        widthUpscale, heightUpscale
    );

    ++frameCounter;

    requestAnimationFrame(animateKrisWalk);
}

krisWalk.onload = () => {
    animateKrisWalk();
};

krisWalk.src = canvas.dataset.krisWalkUri;