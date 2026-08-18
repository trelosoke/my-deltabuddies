# Change Log

All notable changes to the "mydeltabuddies" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.4.0] - 2026-08-18

- Implement action system with chance-based selection and direction constraints
- Add state save/restore so characters return exactly to pre-action state
- Schedule actions during idle with configurable delay for more natural behavior
- Add unique idle actions for all characters: Kris (v_sign, hold_flower), Susie (eat_chalk, laugh, yawning, stretching), Ralsei (sit)
- Update sprite sheets with frames for the new idle actions
- Tune action chances and timing ranges for balanced, varied behavior

## [0.3.0] - 2026-08-10

- Add multi-animation support with data-driven config
- Implement floating-point frameDelay with accumulator model
- Add private helpers and animation row getter
- Simplify draw() to use data-driven rendering

## [0.2.1] - 2026-08-03
- Fix characters escaping the canvas on sidebar resize
- Fix canvas resize flicker with mutable dimensions object
- Migrate character system to class-based architecture with centralized lifecycle management in CharacterManager
- Split animation start logic from character loading in the renderer

## [0.2.0] - 2026-07-29
- Add multi-character support
- Implement character factory with independent AI behaviors
- Dynamic start position based on sidebar size
- Characters bounce off edges individually
- Support configurable character parameters (speed, idle, duration, sprite size)

## [0.1.0] - 2026-07-16

- Add character animation using spritesheet
- Move character across window according to animation
- Implement random direction of walking, with random duration
- Add idle state with random duration
- Contain the character within the window boundaries