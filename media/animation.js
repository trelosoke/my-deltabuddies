export function startAnimation(canvas, ctx, manager, dimensions) {
    manager.handleResize(canvas, dimensions);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    manager.updateAll(canvas);
    manager.drawAll(ctx);

    requestAnimationFrame(() => startAnimation(canvas, ctx, manager, dimensions));
}