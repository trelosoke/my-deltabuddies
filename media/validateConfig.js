function checkLayout(charName, char, report) {
    const layout = char.layout;
    if (!layout) {
        report.error(`${charName}.layout is missing`);
        return;
    }

    const spriteWidth = layout.spriteWidth;
    const spriteHeight = layout.spriteHeight;
    const scale = layout.scale;

    if (!Number.isFinite(spriteWidth) || spriteWidth < 1) {
        report.error(`${charName}.layout: invalid spriteWidth: ${spriteWidth} (type: ${typeof spriteWidth}). Expected a finite number >= 1`);
    }

    if (!Number.isFinite(spriteHeight) || spriteHeight < 1) {
        report.error(`${charName}.layout: invalid spriteHeight: ${spriteHeight} (type ${typeof spriteHeight}). Expected a finite number >= 1`);
    }

    if (!Number.isFinite(scale) || scale <= 0) {
        report.error(`${charName}.layout: invalid scale: ${scale} (type: ${typeof scale}). Expected a finite number > 0`);
    }
}

function checkStartingAnimation(charName, char, report) {
    const startingAnimation = char.startingAnimation;

    if (!startingAnimation) {
        report.error(`${charName}.startingAnimation is missing`);
        return;
    }

    if (typeof startingAnimation !== 'string') {
        report.error(`${charName}.startingAnimation: invalid value: ${startingAnimation} (type: ${typeof startingAnimation}). Expected a string.`);
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
        if (!Number.isFinite(speed) || speed <= 0) {
            report.error(`${charName}.behavior.speeds: invalid value for '${animName}': ${speed}. Expected a number > 0.`);
        }
    }
}

function checkStartPosition(charName, path, pos, report) {
    if (pos === undefined || pos === null) {
        report.error(`${charName}.${path} is missing`);
        return;
    }

    if (typeof pos !== 'function' && !Number.isFinite(pos)) {
        report.error(`${charName}.${path}: invalid value: ${pos} (type: ${typeof pos}). Expected a function or number.`);
        return;
    }

    if (typeof pos === 'function') {
        let result;

        try {
            result = pos(1000);
        } catch(e) {
            report.error(`${charName}.${path}: function threw: ${e.message}`);
            return;
        }

        if (!Number.isFinite(result)) {
            report.error(`${charName}.${path}: invalid value: ${result} (type: ${typeof result}). Expected function to return a number.`); 
        }
    }
}

function checkRangeBound(charName, path, propName, range, report) {
    const value = range[propName];
    if (!(propName in range)) {
        report.error(`${charName}.${path}.${propName} is missing.`);
        return false;
    }

    if (!Number.isFinite(value) || value <= 0) {
        report.error(`${charName}.${path}.${propName}: invalid value: ${value} (type: ${typeof value}). Expected a finite number > 0.`);
        return false;
    }

    return true;
}

function checkRange(charName, path, range, report) {
    if (!range) {
        report.error(`${charName}.${path} is missing`);
        return;
    }

    const minValid = checkRangeBound(charName, path, 'min', range, report);
    const maxValid = checkRangeBound(charName, path, 'max', range, report);

    if(minValid && maxValid && range.min > range.max) {
        report.error(`${charName}.${path}: min (${range.min}) > max (${range.max}) — expected min <= max.`);
    }
}

function checkBehavior(charName, char, report) {
    const behavior = char.behavior;
    if (!behavior) {
        report.error(`${charName}.behavior is missing`);
        return;
    }
    
    checkSpeeds(charName, char, report);
    checkStartPosition(charName, 'behavior.startX', behavior.startX, report);
    checkStartPosition(charName, 'behavior.startY', behavior.startY, report);
    checkRange(charName, 'behavior.idleDurationRange', behavior.idleDurationRange, report);
    checkRange(charName, 'behavior.idleTriggerRange', behavior.idleTriggerRange, report);
    checkRange(charName, 'behavior.directionChangeRange', behavior.directionChangeRange, report);
    checkRange(charName, 'behavior.actionDelayRange', behavior.actionDelayRange, report);
}



/** @param {typeof import('./charactersConfig.js').charactersConfig} charactersConfig */
export function validateConfig(charactersConfig) {
    const report = {
        errors: [],
        warnings: [],
        error(msg) { this.errors.push(msg); },
        warn(msg)  { this.warnings.push(msg); },
    };

    for (const [charName, char] of Object.entries(charactersConfig)) {
        checkLayout(charName, char, report);
        checkStartingAnimation(charName, char, report);
        checkBehavior(charName, char, report);

        
    }

    if(report.warnings.length > 0) {
        console.warn('Configuration warnings:\n' + report.warnings.join('\n'));
    }

    if (report.errors.length > 0) {
        throw new Error('Invalid configuration:\n' + report.errors.join('\n'));
    }
}
