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
const frameWidth = 32;
const frameHeight = 48;

let currentFrame = 0;
let frameCounter = 0;
const FRAMES_PER_SPRITE = 10;


function animateKrisWalk() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (frameCounter % FRAMES_PER_SPRITE === 0) {
        currentFrame = (currentFrame + 1) % totalFrames;
    }

    const scale = 2.5;

    let widthUpscale = frameWidth * scale;
    let heightUpscale = frameHeight * scale; 

    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        krisWalk,
        currentFrame * frameWidth, 0,
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
