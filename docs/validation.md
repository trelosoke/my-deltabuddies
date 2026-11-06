# Validation configuration


> **Applies to:** MyDeltabuddies `v0.5.0`

`media/validateConfig.js` validates `charactersConfig` at webview's boot (`media/main.js`) and with fail-fast: `throws an error` and prevent the game from starting; `warning` only logs and continues.

## Layout 

| Field | Valid when | If violated |
| ----- | ---------- | ----------- |
| `spriteWidth` | *finite number >= 1* | `throw error` |
| `spriteHeight` | *finite number >= 1* | `throw error` |
| `scale` | *finite number > 0* | `throw error` |

## Animation 

| Field | Valid when | If violated |
| ----- | ---------- | ----------- |
| `type` | *`movement` or `action`* | `throw error` |
| `frameDelay` | *finite number > 0* | `throw error` |
| `spritesPerRow` | *integer number >= 1* | `throw error` |
| `startRow` | *integer number >= 0* | `throw error` |
| `rowCount` | *integer number >= 1* | `throw error` |
| `directionMode` | *`4way` or `fixed`* | `throw error` |
| `directionOrder` | *mandatory on `4way`, all 4 directions, no duplicates* | `throw error` (duplicates: `warning`) |
| `sustainSeconds` (action) | *finite number >= 0* | `throw error` |
| `chance` (action) | *finite number between 0-100 inclusively* | `throw error` |
| `allowedDirections` (action) | *array with at least one of `down`/`left`/`right`/`up`, no duplicates* | `throw error` (duplicates: `warning`) |

## Field correlation

| Valid when | If violated |
| ---------- | ----------- |
| `range.min <= range.max` | `throw error` |
| `startingAnimation` exists in `animations` | `throw error` |
| every `movement` animation has a `behavior.speeds` entry | `throw error` |
| `speeds` references a non-existent animation | `warning` |

## How to extend

1. Create a `check` function in `validateConfig.js`
2. Call it at the corresponding aggregator (e.g. `checkType` was called in `checkAnimation`)
3. Add case in `tests/validateConfig.test.js`
4. Adjust `tests/fixtures/makeValidConfig.js` if necessary

## Limitations

Does not validate sprite sheet order/position nor the existence of the PNG files.

### Disclaimer

This validation architecture **may change** in future updates. 