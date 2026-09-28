import { describe, test } from 'node:test';
import assert from 'node:assert';
import { makeValidConfig } from './fixtures/makeValidConfig.js';
import { validateConfig } from '../media/validateConfig.js';

describe('makeValidConfig', () => {
    test('produces a valid config', () => {
        const config = makeValidConfig();
        assert.doesNotThrow(() => validateConfig(config));
    });
});

describe('validateConfig', () => {
    describe('Missing field', () => {
        test('layout missing → throws', () => {
            const config = makeValidConfig({ kris: { layout: undefined } });

            assert.throws(() => validateConfig(config), /kris\.layout is missing/);
        });

        test('actionDelayRange \'min\' key isn\'t in range object → throws', () => {
            const config = makeValidConfig({ kris: { behavior: { actionDelayRange: { min: undefined } }} });

            assert.throws(() => validateConfig(config), /kris\.behavior\.actionDelayRange\.min is missing/);
        });
    });

    describe('Finite number', () => {
        describe('Finite number >= 1', () => {
            test('spriteWidth is < 1 → throws', () => {
                const config = makeValidConfig({ kris: { layout: { spriteWidth: 0 } }});

                assert.throws(() => validateConfig(config), /kris\.layout\.spriteWidth/);
            });
        });

        describe('Finite number > 0', () => {
            test('scale is <= 0 → throws', () => {
                const config = makeValidConfig({ kris: { layout: { scale: 0 } }});

                assert.throws(() => validateConfig(config), /kris\.layout\.scale/);
            });
        });

        describe('Finite number >= 0', () => {
            test('startRow is < 0 → throws', () => {
                const config = makeValidConfig({ kris: { animations: { walk: {startRow: -1 }}}});

                assert.throws(() => validateConfig(config), /kris\.animations\.walk\.startRow/);
            });
        });
    });
});
