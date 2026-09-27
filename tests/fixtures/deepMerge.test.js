import { describe, test } from 'node:test';
import assert from 'node:assert';
import { deepMerge } from './deepMerge.js';

describe('deepMerge', () => {
    test('property defined as undefined → don\'t merge', () => {
       const base = { test : { nested: true} };
       const undefOverride = { test: { nested: undefined }};
       const nullOverride = { test: { nested: null }};

       const undefMerge = deepMerge(base, undefOverride);
       const nullMerge = deepMerge(base, nullOverride);

       assert.deepStrictEqual(undefMerge, { test : {} });
       assert.deepStrictEqual(nullMerge, { test: {} });
    });

    test('both property values are plain objects → nested values are merged', () => {
        const base = {
            test: {
                nested: {
                    nestedTest: true
                }
            }
        };

        const override = {
            test: {
                nested: {
                    nestedTest: false
                }
            }
        };

        const merged = deepMerge(base, override);

        assert.deepStrictEqual(merged, { test: { nested: { nestedTest: false } } });
    });

    test('property in both, not both plain object → override wins', () => {
        const base = {
            test: {
                nested: true
            },
        };

        const override = {
            test: 'testing'
        };

        const expected = {
            test: 'testing'
        };

        const merged = deepMerge(base, override);

        assert.deepStrictEqual(merged, expected);
    });

    test('override-only properties are copied to returned object', () => {
        const base = {
            test: {
                nested: true
            }
        };

        const override = {
            test: {
                nested: true
            },
            
            overrideOnly: {
                nested: true
            }
        };

        const expected = {
            test: {
                nested: true
            },

            overrideOnly: {
                nested: true
            }
        };

        const merged = deepMerge(base, override);

        assert.deepStrictEqual(merged, expected);
    });

    test('base-only properties are copied to returned object',() => {
        const base = {
            test: {
                nested: true
            },

            baseOnly: {
                nested: true
            }
        };

        const override = {
            test: {
                nested: true
            }
        };

        const expected = {
            test: {
                nested: true
            },

            baseOnly: {
                nested: true
            }
        };

        const merged = deepMerge(base, override);

        assert.deepStrictEqual(merged, expected);
    });
});