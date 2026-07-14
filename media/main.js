document.body.style.padding = '0';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('aquarium');

canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = document.body.clientWidth;
    // canvas.height = document.body.clientHeight;
}

function drawRect() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// resizeCanvas();
// drawRect();

const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
    // drawRect();
});

// resizeObserver.observe(document.body);

const krisImage = new Image();
const krisWalk = new Image();

// krisImage.src = canvas.dataset.krisUri;
// krisImage.onload = () => {
//     ctx.drawImage(krisImage, 0, 0, krisImage.naturalWidth, krisImage.naturalHeight);
// };
console.log(canvas.dataset.krisWalkUri);

canvas.width = document.body.clientWidth;
canvas.height = 200;

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
        
        if (currentFrame === 0) {
            animationLine = (animationLine + 1) % totalLines;
        }
    }

    const scale = 2.5;

    let widthUpscale = frameWidth * scale;
    let heightUpscale = frameHeight * scale;

    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        krisWalk,
        currentFrame * frameWidth, animationLine * frameHeight,
        frameWidth, frameHeight,
        0, 0,
        widthUpscale, heightUpscale
    );

    console.log('Desenhando frame', currentFrame);
    ++frameCounter;

    requestAnimationFrame(animateKrisWalk);
}

krisWalk.onload = () => {
    animateKrisWalk();
};

krisWalk.src = canvas.dataset.krisWalkUri;
// krisImage.onload = () => {
    
// }
