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

resizeCanvas();
drawRect();

const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
    drawRect();
});

resizeObserver.observe(document.body);