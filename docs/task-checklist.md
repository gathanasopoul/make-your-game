# Task Checklist

Use this file to track progress for the current development tasks.

## Phase 1: Setup & Core Systems
- [x] Review the workflow requirements from git-workflow-rules.md
- [x] Initialize the project repository structure
- [x] Set up dependency management with npm and Go
- [x] Configure linting and test tooling
- [x] Add CI workflow configuration
- [x] Create a basic server entrypoint in cmd/server/main.go
- [x] Verify the server serves the game page locally
- [x] Test the health endpoint at /api/health

> Verified: lint passes, tests pass, and the server responds at /api/health.

## Phase 2: Game Loop & Input System
- [x] Implement the main animation loop with requestAnimationFrame
- [x] Track delta time and FPS
- [x] Add keyboard input handling for movement
- [x] Prevent key-repeat stutter for smooth movement

> Verified: the game loop runs, input updates are handled, and repeated key events no longer cause the movement logic to stutter.

## Phase 3: Player Firewall (Spacecraft)
- [x] Create the player entity at the bottom of the screen
- [x] Center the player horizontally
- [x] Move the player using the input system
- [x] Keep the player within screen boundaries

## Phase 4: Enemy Malware & Object Pooling
- [x] Create the malware grid layout
- [x] Move the enemies left/right and drop them on edge hits
- [x] Increase enemy speed as enemies are destroyed
- [x] Implement object pooling for efficient rendering

## Phase 5: Projectiles & Collision
- [x] Create projectile objects for data packets
- [x] Add firing logic with cooldown
- [x] Move projectiles upward in the game loop
- [x] Detect collisions between projectiles and enemies

## Phase 6: HUD & Game Logic
- [x] Add score tracking
- [x] Add lives/system integrity display
- [x] Add countdown timer
- [x] Implement game-over and victory states

> Verified: score tracking, system integrity, countdown timer, and victory/game-over states are fully functional and covered by unit tests.

## Phase 7: Pause & Polish
- [x] Add pause menu and pause state handling
- [x] Ensure paused gameplay does not continue updating
- [x] Perform performance checks for smooth 60 FPS gameplay

> Verified: pause toggle (P/ESC), paused state freezing, and system restart (R) are fully operational and verified by unit tests.

## Phase 8: Verification & Done Criteria
- [x] Run linting locally
- [x] Run tests locally
- [x] Verify the game runs without errors
- [x] Confirm the project is ready for review

> Verified: all 13 unit tests pass and ESLint runs clean with 0 errors.
