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
                frameDelay: 7.5,
                startRow: 0,
                rowCount: 4,
                spritesPerRow: 4,
                directionMode: '4way',
                directionOrder: ['down', 'left', 'right', 'up']
            },

            v_sign: {
                type: 'action',
                frameDelay: 4,
                startRow: 4,
                rowCount: 1,
                spritesPerRow: 6,
                directionMode: 'fixed',
                sustainSeconds: 6,
                chance: 90,
                allowedDirections: ['down']
            },

            hold_flower: {
                type: 'action',
                frameDelay: 16,
                startRow: 5,
                rowCount: 1,
                spritesPerRow: 16,
                directionMode: 'fixed',
                sustainSeconds: 0,
                chance: 99,
                allowedDirections: ['down']
            }
        },
        
        startingAnimation: 'walk',
        
        behavior: {
            speeds: {
                walk: 0.4,
                run: 1.2,
            },
            startX: (canvasWidth) => canvasWidth / 2,
            startY: (canvasHeight) => canvasHeight / 2,
            idleDurationRange: { min: 90, max: 260 },
            idleTriggerRange: { min: 300, max: 720 },
            directionChangeRange: { min: 80, max: 260 },
            actionDelayRange: { min: 100, max: 105 }
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
            },

            eat_chalk_right: {
                type: 'action',
                frameDelay: 7.5,
                startRow: 4,
                rowCount: 1,
                spritesPerRow: 22,
                directionMode: 'fixed',
                sustainSeconds: 0,
                chance: 20,
                allowedDirections: ['right']
            },

            eat_chalk_left: {
                type: 'action',
                frameDelay: 7.5,
                startRow: 5,
                rowCount: 1,
                spritesPerRow: 22,
                directionMode: 'fixed',
                sustainSeconds: 0,
                chance: 99,
                allowedDirections: ['left']
            },

            laugh: {
                type: 'action',
                frameDelay: 14,
                startRow: 6,
                rowCount: 1,
                spritesPerRow: 10,
                directionMode: 'fixed',
                sustainSeconds: 0,
                chance: 42,
                allowedDirections: ['down', 'right']
            },

            yawning: {
                type: 'action',
                frameDelay: 18,
                startRow: 7,
                rowCount: 1,
                spritesPerRow: 10,
                directionMode: 'fixed',
                sustainSeconds: 0,
                chance: 99,
                allowedDirections: ['down']
            },

            stretching: {
                type: 'action',
                frameDelay: 10,
                startRow: 8,
                rowCount: 1,
                spritesPerRow: 9,
                directionMode: 'fixed',
                sustainSeconds: 2.5,
                chance: 38,
                allowedDirections: ['down']
            }
        },

        startingAnimation: 'walk',

        behavior: {
            speeds: {
                walk: 0.4,
                run: 1.5,
            },
            startX: (canvasWidth) => canvasWidth / 2,
            startY: (canvasHeight) => canvasHeight / 2,
            idleDurationRange: { min: 90, max: 260 },
            idleTriggerRange: { min: 300, max: 720 },
            directionChangeRange: { min: 80, max: 260 },
            actionDelayRange: { min: 100, max: 180 }
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
            },

            sit: {
                type: 'action',
                frameDelay: 12,
                startRow: 4,
                rowCount: 1,
                spritesPerRow: 10,
                directionMode: 'fixed',
                sustainSeconds: 2.5,
                chance: 99,
                allowedDirections: ['down', 'left']
            }
        },

        startingAnimation: 'walk',

        behavior: {
            speeds: {
                walk: 0.4,
                run: 1.2,
            },
            startX: (canvasWidth) => canvasWidth / 2,
            startY: (canvasHeight) => canvasHeight / 2,
            idleDurationRange: { min: 90, max: 260 },
            idleTriggerRange: { min: 300, max: 720 },
            directionChangeRange: { min: 80, max: 260 },
            actionDelayRange: { min: 100, max: 180 }
        }
    },
};
