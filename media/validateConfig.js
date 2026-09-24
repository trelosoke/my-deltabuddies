function checkLayout(path, char, report) {
    const layout = char.layout;
    const layoutPath = `${path}.layout`;

    if (!layout) {
        report.error(`${layoutPath} is missing.`);
        return;
    }

    const spriteWidth = layout.spriteWidth;
    const spriteHeight = layout.spriteHeight;
    const scale = layout.scale;

    if (!Number.isFinite(spriteWidth) || spriteWidth < 1) {
        report.error(`${layoutPath}.spriteWidth: invalid value: ${spriteWidth} (type: ${typeof spriteWidth}). Expected a finite number >= 1.`);
    }

    if (!Number.isFinite(spriteHeight) || spriteHeight < 1) {
        report.error(`${layoutPath}.spriteHeight: invalid value: ${spriteHeight} (type: ${typeof spriteHeight}). Expected a finite number >= 1.`);
    }

    if (!Number.isFinite(scale) || scale <= 0) {
        report.error(`${layoutPath}.scale: invalid value: ${scale} (type: ${typeof scale}). Expected a finite number > 0.`);
    }
}

function checkStartingAnimation(path, char, report) {
    const startingAnimation = char.startingAnimation;

    if (!startingAnimation) {
        report.error(`${path}.startingAnimation is missing.`);
        return;
    }

    if (typeof startingAnimation !== 'string') {
        report.error(`${path}.startingAnimation: invalid value: ${startingAnimation} (type: ${typeof startingAnimation}). Expected a string.`);
        return;
    }

    if (!Object.keys(char.animations).includes(startingAnimation)) {
        report.error(`${path}.startingAnimation: invalid value: ${startingAnimation}. Expect one of: ${Object.keys(char.animations).join(', ')}.`);
    }
}

function checkSpeeds(path, char, report) {
    const speeds = char.behavior.speeds;
    if (!speeds) {
        report.error(`${path}.speeds is missing.`);
        return;
    }

    for(const animName of Object.keys(speeds)) {
        if(!(animName in char.animations)) {
            report.warn(`${path}.speeds: orphan key '${animName}'. No matching animation.`);
        }
    }

    for(const [animName, anim] of Object.entries(char.animations)) {
        if (anim.type === 'movement' && !(animName in speeds)) {
            report.error(`${path}.speeds: missing entry for movement '${animName}.'`);
        }
    }

    for(const [animName, speed] of Object.entries(speeds)) {
        if (!Number.isFinite(speed) || speed <= 0) {
            report.error(`${path}.speeds: invalid value for '${animName}': ${speed}. Expected a number > 0.`);
        }
    }
}

function checkStartPosition(path, pos, report) {
    if (pos === undefined || pos === null) {
        report.error(`${path} is missing.`);
        return;
    }

    if (typeof pos !== 'function' && !Number.isFinite(pos)) {
        report.error(`${path}: invalid value: ${pos} (type: ${typeof pos}). Expected a function or number.`);
        return;
    }

    if (typeof pos === 'function') {
        let result;

        try {
            result = pos(1000);
        } catch(e) {
            report.error(`${path}: function threw: ${e.message}.`);
            return;
        }

        if (!Number.isFinite(result)) {
            report.error(`${path}: invalid value: ${result} (type: ${typeof result}). Expected function to return a number.`); 
        }
    }
}

function checkRangeBound(path, propName, range, report) {
    const value = range[propName];
    if (!(propName in range)) {
        report.error(`${path}.${propName} is missing.`);
        return false;
    }

    if (!Number.isFinite(value) || value <= 0) {
        report.error(`${path}.${propName}: invalid value: ${value} (type: ${typeof value}). Expected a finite number > 0.`);
        return false;
    }

    return true;
}

function checkRange(path, range, report) {
    if (!range) {
        report.error(`${path} is missing.`);
        return;
    }

    const minValid = checkRangeBound(path, 'min', range, report);
    const maxValid = checkRangeBound(path, 'max', range, report);

    if(minValid && maxValid && range.min > range.max) {
        report.error(`${path}: min (${range.min}) > max (${range.max}) — expected min <= max.`);
    }
}

function checkBehavior(path, char, report) {
    const behavior = char.behavior;
    const behaviorPath = `${path}.behavior`;

    if (!behavior) {
        report.error(`${behaviorPath} is missing.`);
        return;
    }
    
    checkSpeeds(behaviorPath, char, report);
    checkStartPosition(`${behaviorPath}.startX`, behavior.startX, report);
    checkStartPosition(`${behaviorPath}.startY`, behavior.startY, report);
    checkRange(`${behaviorPath}.idleDurationRange`, behavior.idleDurationRange, report);
    checkRange(`${behaviorPath}.idleTriggerRange`, behavior.idleTriggerRange, report);
    checkRange(`${behaviorPath}.directionChangeRange`, behavior.directionChangeRange, report);
    checkRange(`${behaviorPath}.actionDelayRange`, behavior.actionDelayRange, report);
}

function checkType(charName, path, anim, report) {
    const value = anim.type;
    if (value === undefined || value === null) {
        report.error(`${charName}.${path} is missing.`);
        return;
    }

    const types = ['movement', 'action'];

    if (!types.includes(value)) {
        report.error(`${charName}.${path}: invalid value: ${value} (type: ${typeof value}). Expected one of these strings: ${types.join(', ')}.`);
    }
}

function checkFrameDelay(charName, path, anim, report) {
    const value = anim.frameDelay;
    if (value === undefined || value === null) {
        report.error(`${charName}.${path} is missing.`);
        return;
    }

    if (!Number.isFinite(value) || value <= 0) {
        report.error(`${charName}.${path}: invalid value: ${value} (type: ${typeof value}). Expected a finite number > 0.`);
    }
}

function checkSpritesPerRow(charName, path, anim, report) {
    const value = anim.spritesPerRow;
    if (value === undefined || value === null) {
        report.error(`${charName}.${path} is missing.`);
        return;
    }

    if (!Number.isFinite(value) || value < 1) {
        report.error(`${charName}.${path}: invalid value: ${value} (type: ${typeof value}). Expected a finite number >= 1.`);
        return;
    }

    if (!Number.isInteger(value)) {
        report.error(`${charName}.${path}: invalid value: ${value} (type: ${typeof value}). Expected an integer.`);
    }
}

function checkStartRow(charName, path, anim, report) {
    const value = anim.startRow;
    if (value === undefined || value === null) {
        report.error(`${charName}.${path} is missing.`);
        return;
    }

    if (!Number.isFinite(value) || value < 0) {
        report.error(`${charName}.${path}: invalid value: ${value} (type: ${typeof value}). Expected a finite number >= 0.`);
        return;
    }

    if (!Number.isInteger(value)) {
        report.error(`${charName}.${path}: invalid value: ${value} (type: ${typeof value}). Expected an integer.`);
    }
}

function checkRowCount(charName, path, anim, report) {
    const value = anim.rowCount;
    if (value === undefined || value === null) {
        report.error(`${charName}.${path} is missing.`);
        return;
    }

    if (!Number.isFinite(value) || value < 1) {
        report.error(`${charName}.${path}: invalid value: ${value} (type: ${typeof value}). Expected a finite number > 1.`);
        return;
    }

    if (!Number.isInteger(value)) {
        report.error(`${charName}.${path}: invalid value: ${value} (type: ${typeof value}). Expected an integer.`);
    }
}

function checkDirectionMode(charName, path, anim, report) {
    const value = anim.directionMode;
    if (value === undefined || value === null) {
        report.error(`${charName}.${path} is missing.`);
        return;
    }

    const directionModes = ['4way', 'fixed'];

    if (!directionModes.includes(value)) {
        report.error(`${charName}.${path}: invalid value: ${value} (type: ${typeof value}). Expected one of these strings: ${directionModes.join(', ')}.`);
    }
}

function checkSustainSeconds(charName, path, anim, report) {
    const value = anim.sustainSeconds;
    if (value === undefined || value === null) {
        return;
    }

    if (!Number.isFinite(value) || value < 0) {
        report.error(`${charName}.${path}: invalid value: ${value} (type: ${typeof value}). Expected a finite number >= 0.`);
    }
}

function checkChance(charName, path, anim, report) {
    const value = anim.chance;
    if (value === undefined || value === null) {
        return;
    }

    if (!Number.isFinite(value) || value < 0 || value > 100) {
        report.error(`${charName}.${path}: invalid value: ${value} (type: ${typeof value}). Expected a finite number between 0 and 100.`);
    }
}

function checkAllowedDirections(charName, path, anim, report) {
    const value = anim.allowedDirections;
    if (value === undefined || value === null) {
        report.error(`${charName}.${path} is missing.`);
        return;
    }

    if (!Array.isArray(value)) {
        report.error(`${charName}.${path}: invalid value ${value} (type: ${typeof value}). Expected an array of directions.`);
        return;
    }

    const valid = ['down', 'left', 'right', 'up'];

    if (value.length === 0) {
        report.error(`${charName}.${path}: empty array. Expected at least one of these strings: ${valid.join(', ')}.`);
        return;
    }

    const nonString = value.filter(direc => typeof direc !== 'string');

    if (nonString.length > 0) {
        report.error(`${charName}.${path}: items must be strings, got: ${nonString.map(direc => `${direc} (${typeof direc})`).join(', ')}.`);
        return;
    }

    const invalid = value.filter(direc => !valid.includes(direc));

    if (invalid.length > 0) {
        report.error(`${charName}.${path}: invalid directions ${invalid.join(', ')}. Expected each to be one of these directions: ${valid.join(', ')}.`);
        return;
    }
    
    if (value.length > valid.length) {
        report.error(`${charName}.${path}: expected a max of ${valid.length} directions (${valid.join(', ')}), got ${value.length}.`);
    }

    const duplicates = value.filter((d, i) => value.indexOf(d) !== i);
    if (duplicates.length > 0) {
        report.warn(`${charName}.${path}: duplicate directions: ${duplicates.join(', ')}.`);
        return;
    }
}

function checkDirectionOrder(charName, path, anim, report) {
    const value = anim.directionOrder;
    const mode = anim.directionMode;

    if (mode !== '4way') {
        if (value !== undefined && value !== null) {
            report.warn(`${charName}.${path}.directionOrder: only applies to 4way animations. Ignored.`);
        }
        return;
    }

    if (value === undefined || value === null) {
        report.error(`${charName}.${path} is missing.`);
        return;
    }

    if (!Array.isArray(value)) {
        report.error(`${charName}.${path}: invalid value ${value} (type: ${typeof value}). Expected an array of directions.`);
        return;
    }

    const valid = ['down', 'left', 'right', 'up'];

    if (value.length === 0) {
        report.error(`${charName}.${path}: empty array. Expected at least one of these strings: ${valid.join(', ')}.`);
        return;
    }

    const nonString = value.filter(direc => typeof direc !== 'string');

    if (nonString.length > 0) {
        report.error(`${charName}.${path}: items must be strings, got: ${nonString.map(direc => `${direc} (${typeof direc})`).join(', ')}.`);
        return;
    }

    const invalid = value.filter(direc => !valid.includes(direc));

    if (invalid.length > 0) {
        report.error(`${charName}.${path}: invalid directions ${invalid.join(', ')}. Expected each to be one of these directions: ${valid.join(', ')}.`);
        return;
    }

    const valueSet = new Set(value);
    
    const missing = valid.filter(direc => !valueSet.has(direc));
    
    if (missing.length > 0) {
        report.error(`${charName}.${path}: missing directions: ${missing.join(', ')}. Expected all ${valid.length}: ${valid.join(', ')}`);
        return;
    }
    
    const duplicates = value.filter((d, i) => value.indexOf(d) !== i);
    if (duplicates.length > 0) {
        report.warn(`${charName}.${path}: duplicate directions: ${duplicates.join(', ')}.`);
    }
}

function checkAnimation(charName, path, anim, report) {
    if (anim === undefined || anim === null) {
        report.error(`${charName}.${path} is missing.`);
        return;
    }

    checkType(charName, path, anim, report);
    
    checkFrameDelay(charName, path, anim, report);
    checkSpritesPerRow(charName, path, anim, report);
    checkStartRow(charName, path, anim, report);
    checkRowCount(charName, path, anim, report);
    checkDirectionMode(charName, path, anim, report);
    checkDirectionOrder(charName, path, anim, report);

    if (anim.type === 'action') {
        checkSustainSeconds(charName, path, anim, report);
        checkChance(charName, path, anim, report);
        checkAllowedDirections(charName, path, anim, report);
    }
}

function checkAnimations(charName, char, report) {
    for (const [animName, anim] of Object.entries(char.animations)) {
        checkAnimation(charName, `${charName}.animations.${animName}`, anim, report);
    }
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
        checkAnimations(charName, char, report);
        checkBehavior(charName, char, report);
    }

    if(report.warnings.length > 0) {
        console.warn('Configuration warnings:\n' + report.warnings.join('\n'));
    }

    if (report.errors.length > 0) {
        throw new Error('Invalid configuration:\n' + report.errors.join('\n'));
    }
}
