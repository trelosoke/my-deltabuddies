function simularAcumulador(frameDelay, totalFrames, totalSprites) {
    let accumulator = 0;
    let currentFrame = 1;
    let currentSprite = 0;
    let trades = 0;

    for (let i = 1; i <= totalFrames; i++) {
        console.log(`Sprite atual: ${currentSprite}`)
        accumulator += 1 / frameDelay;
        console.log(`Frame: ${currentFrame }`);
        console.log(`Acumulador: ${accumulator}`);

        if (accumulator >= 1.0) {
            ++trades;
            currentSprite = (currentSprite + 1) % totalSprites;
            accumulator -= 1.0;
            console.log(`Acumulador pós troca de sprite: ${accumulator}`);
        }

        ++currentFrame;
    }
}

simularAcumulador(7.5, 60, 4);