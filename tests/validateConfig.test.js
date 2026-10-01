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

    describe('Integer', () => {
        test('startRow isn\'t integer → throws', () => {
            const config = makeValidConfig({ kris: { animations: { walk: {startRow: 0.2 }}}});

            assert.throws(() => validateConfig(config), /kris\.animations\.walk\.startRow/);
        });
    });

    describe('Number between', () => {
        describe('Between 0 and 100 (inclusive)', () => {
            test('chance isn\'t >= 0 → throws', () => {
                const config = makeValidConfig({ kris: { animations: { v_sign: { chance: -1 }}}});

                assert.throws(() => validateConfig(config), /kris\.animations\.v_sign\.chance/);
            });

            test('chance isn\'t <= 100 → throws', () => {
                const config = makeValidConfig({ kris: { animations: { v_sign: { chance: 100.1 } }}});

                assert.throws(() => validateConfig(config), /kris\.animations\.v_sign\.chance/);
            });
        });
    });

    describe('Types', () => {
        describe('Enum', () => {
            test('animations.type isn\'t one of the valid values → throws', () => {
                const config = makeValidConfig({ kris: { animations: { walk: { type: false }}}});

                assert.throws(() => validateConfig(config), /Expected one of these strings:/);
            });
        });

        describe('String', () => {
            test('startingAnimation isn\'t a string → throws', () => {
                const config = makeValidConfig({ kris: { startingAnimation: false }});

                assert.throws(() => validateConfig(config), /Expected a string/);
            });
        });

        describe('Array', () => {
            test('allowedDirections isn\'t an array → throws', () => {
                const config = makeValidConfig({ kris: { animations: { v_sign: { allowedDirections: 'string' }}}});

                assert.throws(() => validateConfig(config), /Expected an array/);
            });
        });
    });

    describe('Invariant between fields', () => {
        test('min > max → throws', () => {
            const config = makeValidConfig({ kris: { behavior: { actionDelayRange: { max: 2 } } } });

            assert.throws(() => validateConfig(config), /min.*> max/);
        });
    });

    describe('Is Number or Function', () => {
        test('startX is a function → passes', () => {
            const config = makeValidConfig({ kris: { behavior: { startX: () => { return 1; } } } });

            assert.doesNotThrow(() => validateConfig(config));
        });

        test('startX isn\'t nor a number neither function → throws', () => {
            const config = makeValidConfig({ kris: { behavior: { startX: 'test' } } });

            assert.throws(() => validateConfig(config), /kris\.behavior\.startX/);
        });
    });

    describe('Function return a number', () => {
        test('startX don\'t return a number → throws', () => {
            const config = makeValidConfig({ kris: { behavior: { startX: () => undefined } } });

            assert.throws(() => validateConfig(config), /Expected function to return a number/);
        });
    });

    describe('Function that throws', () => {
        test('startX is a function that throws → throws', () => {
            const config = makeValidConfig({ kris: { behavior: { startX: () => { throw new Error('Boom'); } } } });

            assert.throws(() => validateConfig(config), /function threw:/);
        });
    });
    
    describe('Array content', () => {
        describe('Must not be empty', () => {
            test('allowedDirections is an empty array → throws ', () => {
                const config = makeValidConfig({ kris: { animations: { v_sign: { allowedDirections: [] }}}});

                assert.throws(() => validateConfig(config), /empty array/);
            });
        });

        describe('Values must be strings', () => {
            test('allowedDirections values aren\'t strings → throws ', () => {
                const config = makeValidConfig({ kris: { animations: { v_sign: { allowedDirections: [1, 2, 3] }}}});

                assert.throws(() => validateConfig(config), /items must be strings/);
            });
        });

        describe('Values must follow the pattern', () => {
            test('allowedDirections values don\'t follow the pattern → throws', () => {
                const config = makeValidConfig({ kris: { animations: { v_sign: { allowedDirections: ['invalid', 'test'] }}}});

                assert.throws(() => validateConfig(config), /invalid directions/);
            });
        });

        describe('Array corresponds to the set.', () => {
            test('allowedDirections exceeded the set length → throws ', () => {
                const config = makeValidConfig({ kris: { animations: { v_sign: { allowedDirections: ['down', 'left', 'right', 'up', 'down'] }}}});

                assert.throws(() => validateConfig(config), /expected a max of/);
            });

            test('directionOrder values don\'t include all mandatory values → throws ', () => {
                const config = makeValidConfig({ kris: { animations: { walk: { directionOrder: ['down', 'left', 'up'] }}}});

                assert.throws(() => validateConfig(config), /missing directions/);
            });
        });  
    });

    describe('Conditional', () => {
        describe('directionOrder', () => {
            test('directionOrder doesn\'t exist when directionMode is fixed → passes', () => {
                const config = makeValidConfig();

                assert.doesNotThrow(() => validateConfig(config));
            });

            test('directionOrder exist when directionMode is fixed → warns', (t) => {
                const warnSpy = t.mock.method(console, 'warn', () => {});
                const config = makeValidConfig({ kris: { animations: { v_sign: { directionOrder: ['down', 'left', 'left', 'up'] }}}});

                validateConfig(config);

                assert.strictEqual(warnSpy.mock.calls.length, 1);
                assert.match(warnSpy.mock.calls[0].arguments[0], /only applies to 4way animations/);
            });

            test('directionOrder out when directionMode is 4way → throws', () => {
                const config = makeValidConfig({ kris: { animations: { walk: { directionOrder: undefined }}}});

                assert.throws(() => validateConfig(config), /directionOrder is missing/);
            });
        });
    });

    describe('Action animation', () => {
        test('animation.type is movement and chance is invalid → ignores', () => {
            const config = makeValidConfig({ kris: { animations: { walk: { chance: 999 }}}});

            assert.doesNotThrow(() => validateConfig(config));
        });
    });

    describe('Crossed reference', () => {
        test('startingAnimation doesn\'t match with any existing animation → throws', () => {
            const config = makeValidConfig({ kris: { startingAnimation: 'invalid' }});

            assert.throws(() => validateConfig(config), /kris\.startingAnimation/);
        });

        test('behavior.speeds have orphan key → warns', (t) => {
            const warnSpy = t.mock.method(console, 'warn', () => {});
            const config = makeValidConfig({ kris: { behavior: { speeds: { orphan: 1 } } }});

            validateConfig(config);

            assert.strictEqual(warnSpy.mock.calls.length, 1);
            assert.match(warnSpy.mock.calls[0].arguments[0], /orphan key/);
        });

        test('movement animation without behavior.speeds entry → throws', () => {
            const config = makeValidConfig({ kris: { behavior: { speeds: { walk: undefined, run: 1 }}}});

            assert.throws(() => validateConfig(config), /missing entry for movement/);
        });
    });

    describe('Duplicates', () => {
        test('allowedDirections has duplicates → warns', (t) => {
            const warnSpy = t.mock.method(console, 'warn', () => {});
            const config = makeValidConfig({ kris: { animations: { v_sign: { allowedDirections: ['down', 'down'] }}}});

            validateConfig(config);

            assert.strictEqual(warnSpy.mock.calls.length, 1);
            assert.match(warnSpy.mock.calls[0].arguments[0], /duplicate directions/);
        });
    });
});