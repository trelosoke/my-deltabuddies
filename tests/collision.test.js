import { describe, test } from 'node:test';
import assert from 'node:assert';
import { checkCollision } from '../media/collision.js';

describe('checkCollision', () => {

    test('two circles are colliding', () =>{
        const pos1 = { x: 0, y: 0 };
        const pos2 = { x: 9, y: 9 };
        const radius = 10;
        const result = checkCollision(pos1, radius, pos2, radius);

        assert.strictEqual(result, true);
    });

    test('two circles are not colliding', () => {
        const pos1 = { x: 0, y: 0 };
        const pos2 = { x: 100, y: 100 };
        const radius = 10;
        const result = checkCollision(pos1, radius, pos2, radius);

        assert.strictEqual(result, false);
    });

    test('circle at the border DON\'T collide', () => {
        const pos1 = { x: 0, y: 0 };
        const pos2 = { x: 20, y: 0 };
        const radius = 10;
        const result = checkCollision(pos1, radius, pos2, radius);

        assert.strictEqual(result, false);
    });

    test('same X, different Y — colliding', () => {
        const pos1 = { x: 10, y: 20 };
        const pos2 = { x: 10, y: 30 };
        const radius = 10;
        const result = checkCollision(pos1, radius, pos2, radius);

        assert.strictEqual(result, true);
    });

    test('same X, different Y — not colliding', () => {
        const pos1 = { x: 10, y: 20 };
        const pos2 = { x: 10, y: 40 };
        const radius = 10;
        const result = checkCollision(pos1, radius, pos2, radius);

        assert.strictEqual(result, false);
    });

    test('same Y, different X — colliding', () => {
        const pos1 = { x: 20, y: 10 };
        const pos2 = { x: 30, y: 10 };
        const radius = 10;
        const result = checkCollision(pos1, radius, pos2, radius);

        assert.strictEqual(result, true);
    });

    test('same Y, different X — not colliding', () => {
        const pos1 = { x: 20, y: 0 };
        const pos2 = { x: 40, y: 0 };
        const radius = 10;
        const result = checkCollision(pos1, radius, pos2, radius);

        assert.strictEqual(result, false);
    });
});

