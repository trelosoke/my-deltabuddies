export const charactersConfig = {
    kris: {
        layout: {
            spriteWidth: 32,
            spriteHeight: 48,
            scale: 2
        },
        animations: {
            walk: {
                type: 'movement',
                frameDelay: 15,
                startRow: 0,
                rowCount: 4,
                spritesPerRow: 4,
                directionMode: '4way',
                directionOrder: ['down', 'left', 'right', 'up']
            },

            run: {
                type: 'movement',
                speed: 0.8,
                frameDelay: 7.5,
                startRow: 0,
                rowCount: 4,
                spritesPerRow: 4,
                directionMode: '4way',
                directionOrder: ['down', 'left', 'right', 'up']
            },

            v_sign: {
                type: 'action',
                frameDelay: 8,
                startRow: 4,
                rowCount: 1,
                spritesPerRow: 6,
                directionMode: 'fixed'
            }
        },
        
        activeAnimation: 'walk',
        
        behavior: {
            speeds: {
                walk: 0.4,
                run: 0.8,
            },
            startX: (canvasWidth) => canvasWidth / 2,
            startY: (canvasHeight) => canvasHeight / 2,
            idleDurationRange: { min: 90, max: 260 },
            idleTriggerRange: { min: 300, max: 720 },
            directionChangeRange: { min: 80, max: 260 }
        },
    },
    susie: {
        layout: {
            spriteWidth: 38,
            spriteHeight: 50,
            scale: 2
        },
        animations: {
            walk: {
                type: 'movement',
                frameDelay: 15,
                startRow: 0,
                rowCount: 4,
                spritesPerRow: 4,
                directionMode: '4way',
                directionOrder: ['down', 'left', 'right', 'up']
            },

            run: {
                type: 'movement',
                frameDelay: 7.5,
                startRow: 0,
                rowCount: 4,
                spritesPerRow: 4,
                directionMode: '4way',
                directionOrder: ['down', 'left', 'right', 'up']
            }
        },

        activeAnimation: 'walk',

        behavior: {
            speeds: {
                walk: 0.4,
                run: 0.8,
            },
            startX: (canvasWidth) => canvasWidth / 2,
            startY: (canvasHeight) => canvasHeight / 2,
            idleDurationRange: { min: 90, max: 260 },
            idleTriggerRange: { min: 300, max: 720 },
            directionChangeRange: { min: 80, max: 260 }
        }
    },
    ralsei: {
        layout: {
            spriteWidth: 32,
            spriteHeight: 48,
            scale: 2
        },
        animations: {
            walk: {
                type: 'movement',
                frameDelay: 15,
                startRow: 0,
                rowCount: 4,
                spritesPerRow: 4,
                directionMode: '4way',
                directionOrder: ['down', 'left', 'right', 'up']
            },

            run: {
                type: 'movement',
                frameDelay: 7.5,
                startRow: 0,
                rowCount: 4,
                spritesPerRow: 4,
                directionMode: '4way',
                directionOrder: ['down', 'left', 'right', 'up']
            }
        },

        activeAnimation: 'walk',

        behavior: {
            speeds: {
                walk: 0.4,
                run: 0.8,
            },
            startX: (canvasWidth) => canvasWidth / 2,
            startY: (canvasHeight) => canvasHeight / 2,
            idleDurationRange: { min: 90, max: 260 },
            idleTriggerRange: { min: 300, max: 720 },
            directionChangeRange: { min: 80, max: 260 }
        }
    },
};