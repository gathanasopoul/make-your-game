# System Override — DOM Arcade Defense

**System Override** is a high-performance, Vanilla JavaScript DOM-based arcade game built from scratch without external frameworks or HTML `<canvas>`. The engine targets a continuous **60 FPS** on modern desktop browsers using GPU-accelerated CSS transforms and memory-efficient object pooling.

---

## 🎮 Game Concept & Controls

Defend the central mainframe against invading waves of malware packets. Move your firewall spacecraft, deploy anti-malware laser packets, avoid incoming enemy fire, and prevent malware from reaching the system baseline.

| Action | Control Key |
| :--- | :--- |
| **Move Left / Right** | `[A]` / `[D]` or `[←]` / `[→]` |
| **Fire Anti-Malware** | `[SPACE]` |
| **Pause / Resume** | `[P]` or `[ESC]` |
| **Reboot System (Restart)** | `[R]` |

---

## ✨ Features

- **Zero Frameworks & No `<canvas>`**: Built 100% with plain HTML, CSS, and ES6 JavaScript Modules.
- **60 FPS Performance Optimization**:
  - Uses `requestAnimationFrame` for a smooth game loop.
  - Animate entities using GPU-composited CSS `transform: translate3d(x, y, 0px)` and `will-change: transform`.
  - Zero layout reflows during active frame rendering.
- **Memory Management & Object Pooling**:
  - Pre-allocated pools for enemies (`enemyPool`), player projectiles (`projectilePool`), and enemy projectiles (`enemyProjectilePool`).
  - Reuses DOM elements to eliminate garbage collection (GC) pauses.
- **State Machine & Wave Progression**:
  - Full game state management (`START`, `PLAYING`, `PAUSED`, `WAVE_CLEAR`, `VICTORY`, `GAME_OVER`).
  - Escalating wave difficulty with speed scaling and wave-clear recovery bonuses.
- **Dynamic Front-Line Enemy Fire**:
  - Bottom-row enemies launch downward laser projectiles at random intervals.
- **Web 2.0 Dark Slate Visual Design**:
  - Responsive container layout with Google Fonts (`Orbitron` & `Inter`), glossy slate cards, and single-line HUD status badges.

---

## 🚀 Deployment & Local Execution

### Option 1: Docker Container Deployment (Recommended)

Build and run the game inside a lightweight Nginx container:

```bash
# Build the Docker image
docker build -t system-override:latest .

# Run container on port 8080
docker run -d -p 8080:80 --name system-override system-override:latest
```
Access the game at **`http://localhost:8080`**.

---

### Option 2: Go Server

```bash
go run ./cmd/server
```
Access the game at **`http://localhost:8080`**.

---

## 🔄 CI/CD Pipeline & Quality Assurance

This repository incorporates a fully automated **GitHub Actions CI/CD Pipeline** (`.github/workflows/ci-cd.yaml`).

Every push and Pull Request automatically executes:
1. **Dependency Verification**: Installs Node 20 packages cleanly.
2. **ESLint Code Inspection**: Runs `npm run lint` for code quality compliance.
3. **Automated Unit Testing**: Runs `npm run test` (Vitest test suite).
4. **Docker Image Build Validation**: Verifies that the Docker container builds without errors.

### Local QA Commands
```bash
# Run Vitest unit tests
npm test

# Run Vitest V8 code coverage
npm run coverage

# Run ESLint check
npm run lint
```

---

## 🔍 Audit & Performance Verification Guide

To verify browser performance in Chrome DevTools:

1. **FPS & Frame Stability (60 FPS)**:
   - Open Chrome DevTools (`F12`) -> **Performance** tab -> Record gameplay for 10s.
   - Verify green FPS graph sits solidly at **60 FPS** with zero red dropped frame bars.
2. **Paint Flashing**:
   - DevTools -> **Rendering** tab -> Check **Paint Flashing**.
   - Verify only moving entities (`.player`, `.enemy`, `.projectile`) repaint; static containers do NOT flash.
3. **GPU Layer Compositing**:
   - DevTools -> **Rendering** tab -> Check **Layer Borders**.
   - Verify entities are composited on separate hardware GPU layers via `will-change: transform`.
