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

function checkStartingAnimation(charName, char, report) {
    const startingAnimation = char.startingAnimation;

    if (!startingAnimation) {
        report.error(`${charName}.startingAnimation is missing`);
        return;
    }

    if (typeof startingAnimation !== 'string') {
        report.error(`${charName}.startingAnimation: expected a string, got a ${typeof startingAnimation}`);
        return;
    }

    if (!Object.keys(char.animations).includes(startingAnimation)) {
        report.error(`${charName}.startingAnimation: invalid value: ${startingAnimation}. Expect one of: ${Object.keys(char.animations).join(', ')}.`);
    }
}

function checkSpeeds(charName, char, report) {
    const speeds = char.behavior.speeds;
    if (!speeds) {
        report.error(`${charName}.behavior.speeds is missing`);
        return;
    }

    for(const animName of Object.keys(speeds)) {
        if(!(animName in char.animations)) {
            report.warn(`${charName}.behavior.speeds: orphan key '${animName}'. No matching animation.`);
        }
    }

    for(const [animName, anim] of Object.entries(char.animations)) {
        if (anim.type === 'movement' && !(animName in speeds)) {
            report.error(`${charName}.behavior.speeds: missing entry for movement '${animName}'`);
        }
    }

    for(const [animName, speed] of Object.entries(speeds)) {
        if (typeof speed !== 'number' || speed <= 0) {
            report.error(`${charName}.behavior.speeds: invalid value for '${animName}': ${speed}. Expected a number > 0.`);
        }
    }
}

function checkStartPosition(charName, fieldName, pos, report) {
    if (!pos) {
        report.error(`${charName}.behavior.${fieldName} is missing`);
        return;
    }

    if (typeof pos !== 'function' && typeof pos !== 'number') {
        report.error(`${charName}.behavior.${fieldName}: expected a function or number, got a ${typeof pos}`);
        return;
    }

    if (typeof pos === 'function') {
        let result;

        try {
            result = pos(1000);
        } catch(e) {
            report.error(`${charName}.behavior.${fieldName}: function threw: ${e.message}`);
            return;
        }

        if (typeof result !== 'number' || !Number.isFinite(result)) {
            report.error(`${charName}.behavior.${fieldName}: function must return a number, got ${typeof result}`); 
        }
    }
}

function checkBehavior(charName, char, report) {
    const behavior = char.behavior;
    if (!behavior) {
        report.error(`${charName}.behavior is missing`);
        return;
    }
    
    checkSpeeds(charName, char, report);
    
    const startY = behavior.startY;
    const idleDurationRange = behavior.idleDurationRange;
    const idleTriggerRange = behavior.idleTriggerRange;
    const directionChangeRange = behavior.directionChangeRange;
    const actionDelayRange = behavior.actionDelayRange; 

    Object.keys(speeds).forEach((anim) => {
        if (!Object.keys(char.animations).includes(anim)) {
            report.error(`${charName}.behavior.speeds: invalid speed: `);
        }
    });
}

/** @param {typeof import('./charactersConfig.js').charactersConfig} charactersConfig */
export function validateConfig(charactersConfig) {
    for (const [charName, char] of Object.entries(charactersConfig)) {
        checkLayout(charName, char, report);
        checkStartingAnimation(charName, char, report);
        checkSpeeds(charName, char, report);
        checkStartPosition(charName, 'startX', char.behavior.startX, report);
    }

    if(report.warnings.length > 0) {
        console.warn('Configuration warnings:\n' + report.warnings.join('\n'));
    }

    if (report.errors.length > 0) {
        throw new Error('Invalid configuration:\n' + report.errors.join('\n'));
    }

    console.log('Errors resolved');
}
