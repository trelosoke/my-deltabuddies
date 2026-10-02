function isPlainObject(obj) {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export function deepMerge(base = {}, override = {}) {
    const result = {};
    const keys = new Set([...Object.keys(base), ...Object.keys(override)]);

    for (const key of keys) {
        const inBase = Object.hasOwn(base, key);
        const inOverride = Object.hasOwn(override, key);

        const notDefined = override[key] === undefined || override[key] === null;

        if (inOverride && notDefined) { continue; }

        if (inBase && inOverride) {
            const bothPlainObject = isPlainObject(base[key]) && isPlainObject(override[key]);

            if (bothPlainObject) {
                result[key] = deepMerge(base[key], override[key]);
            } else {
                result[key] = override[key];
            }
        } else if (inOverride) {
            result[key] = override[key];
        } else {
            result[key] = base[key];
        }
    }

    return result;
}