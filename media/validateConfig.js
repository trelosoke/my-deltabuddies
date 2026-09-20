const report = {
    errors: [],
    warnings: [],
    error(msg) { this.errors.push(msg); },
    warn(msg)  { this.warnings.push(msg); },
};

function checkLayout(charName, char, report) {
    const layout = char.layout;
    const propSpriteW = layout.spriteWidth;
    const propSpriteH = layout.spriteHeight;
    const propScale = layout.scale;

    if (!layout) {
        report.error(`${charName}.layout is missing`);
        return;
    }

    if (typeof propSpriteW !== 'number' || propSpriteW < 1) {
        report.error(`${charName}.layout: invalid spriteWidth: ${propSpriteW}. Expected a number >= 1`);
    }

    if (typeof propSpriteH !== 'number' || propSpriteH < 1) {
        report.error(`${charName}.layout: invalid spriteHeight: ${propSpriteH}. Expected a number >= 1`);
    }

    if (typeof propScale !== 'number' || propScale <= 0) {
        report.error(`${charName}.layout: invalid scale: ${propScale}. Expected a number > 0`);
    }

    console.log('Layout checked');
}

export function validateConfig(charactersConfig) {
    for (const [charName, char] of Object.entries(charactersConfig)) {
        checkLayout(charName, char, report);
    }

    if (report.warnings.length > 0) {
        console.warn('Configuration warnings:\n' + report.warnings.join('\n'));
    }

    if (report.errors.length > 0) {
        throw new Error('Invalid configuration:\n' + report.errors.join('\n'));
    }

    console.log('Errors resolved');
}
