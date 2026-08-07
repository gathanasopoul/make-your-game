import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { Projectile } from "./projectile.js";
import { updateOverlay } from "./overlay.js";

export class Game {
    constructor(world, input) {
        this.world = world;
        this.input = input;

        this.player = new Player(world);

        this.enemyPool = [];
        this.enemies = [];
        this.projectilePool = [];
        this.projectiles = [];

        this.enemySpeed = 100;
        this.enemyDirection = 1;
        this.enemyDropDistance = 30;
        this.enemyRows = 3;
        this.enemyColumns = 8;
        this.fireCooldown = 0.25;
        this.fireTimer = 0;

        this.enemyProjectilePool = [];
        this.enemyProjectiles = [];
        this.enemyFireTimer = 0.5;
        this.enemyFireCooldown = 2.0;

        // Phase 6 & Polish: HUD, Wave & Game Logic state
        this.state = "START";
        this.wave = 1;
        this.score = 0;
        this.lives = 3;
        this.maxLives = 3;
        this.timer = 60;
        this.overlayElement = null;

        // Cached HUD DOM elements to avoid document.getElementById queries during render loop
        this.waveEl = typeof globalThis.document !== "undefined" && globalThis.document.getElementById
            ? globalThis.document.getElementById("wave-value")
            : null;
        this.scoreEl = typeof globalThis.document !== "undefined" && globalThis.document.getElementById
            ? globalThis.document.getElementById("score-value")
            : null;
        this.shieldsEl = typeof globalThis.document !== "undefined" && globalThis.document.getElementById
            ? globalThis.document.getElementById("shields-value")
            : null;
        this.timerEl = typeof globalThis.document !== "undefined" && globalThis.document.getElementById
            ? globalThis.document.getElementById("timer-value")
            : null;

        this.lastWave = -1;
        this.lastScore = -1;
        this.lastLives = -1;
        this.lastTimer = -1;

        this.cachedWorldWidth = (this.world && this.world.clientWidth) ? this.world.clientWidth : 800;
        this.cachedWorldHeight = (this.world && this.world.clientHeight) ? this.world.clientHeight : 600;
        this.bottomEnemiesBuffer = [];

        this.createEnemyPool();
        this.createEnemyGrid();
        this.createProjectilePool();
        this.createEnemyProjectilePool();
        this.render();
    }

    createEnemyPool() {
        const poolSize = this.enemyRows * this.enemyColumns;

        for (let i = 0; i < poolSize; i++) {
            this.enemyPool.push(new Enemy(this.world));
        }
    }

    createEnemyGrid() {
        const startX = 80;
        const startY = 70;
        const spacingX = 60;
        const spacingY = 60;

        this.enemies = [];

        for (let row = 0; row < this.enemyRows; row++) {
            for (let column = 0; column < this.enemyColumns; column++) {
                const enemy = this.enemyPool[row * this.enemyColumns + column];

                enemy.activate(
                    startX + column * spacingX,
                    startY + row * spacingY,
                );

                this.enemies.push(enemy);
            }
        }
    }

    createProjectilePool() {
        const poolSize = 20;

        for (let i = 0; i < poolSize; i++) {
            this.projectilePool.push(new Projectile(this.world));
        }
    }

    createEnemyProjectilePool() {
        const poolSize = 20;

        for (let i = 0; i < poolSize; i++) {
            this.enemyProjectilePool.push(new Projectile(this.world, true));
        }
    }

    fireProjectile() {
        if (this.fireTimer > 0 || this.state !== "PLAYING") {
            return;
        }

        const projectile = this.projectilePool.find((item) => !item.active);

        if (!projectile) {
            return;
        }

        const x = this.player.x + this.player.width / 2 - projectile.width / 2;
        const y = this.player.y;

        projectile.activate(x, y);
        if (!this.projectiles.includes(projectile)) {
            this.projectiles.push(projectile);
        }
        this.fireTimer = this.fireCooldown;
    }

    fireEnemyProjectile() {
        if (this.state !== "PLAYING" || this.enemies.length === 0) {
            return;
        }

        const projectile = this.enemyProjectilePool.find((item) => !item.active);
        if (!projectile) {
            return;
        }

        // Direct column grid check to get bottom-most active enemy in each column (zero map/object allocations)
        this.bottomEnemiesBuffer.length = 0;
        for (let c = 0; c < this.enemyColumns; c++) {
            for (let r = this.enemyRows - 1; r >= 0; r--) {
                const enemy = this.enemies[r * this.enemyColumns + c];
                if (enemy && enemy.active) {
                    this.bottomEnemiesBuffer.push(enemy);
                    break;
                }
            }
        }

        if (this.bottomEnemiesBuffer.length === 0) {
            return;
        }

        const shooter = this.bottomEnemiesBuffer[Math.floor(Math.random() * this.bottomEnemiesBuffer.length)];

        const x = shooter.x + shooter.width / 2 - projectile.width / 2;
        const y = shooter.y + shooter.height;

        projectile.activate(x, y);
        if (!this.enemyProjectiles.includes(projectile)) {
            this.enemyProjectiles.push(projectile);
        }

        // Randomized interval between firings (0.8s to 2.4s, scaling faster per wave)
        const minTime = Math.max(0.4, 0.9 - (this.wave - 1) * 0.1);
        const maxTime = Math.max(0.8, 2.2 - (this.wave - 1) * 0.2);
        this.enemyFireTimer = minTime + Math.random() * (maxTime - minTime);
    }

    updateProjectiles(dt) {
        const worldHeight = this.getWorldHeight();
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];

            if (!projectile.active) {
                this.projectiles[i] = this.projectiles[this.projectiles.length - 1];
                this.projectiles.pop();
            } else {
                projectile.move(dt, worldHeight);
            }
        }
    }

    updateEnemyProjectiles(dt) {
        const worldHeight = this.getWorldHeight();
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.enemyProjectiles[i];

            if (!projectile.active) {
                this.enemyProjectiles[i] = this.enemyProjectiles[this.enemyProjectiles.length - 1];
                this.enemyProjectiles.pop();
            } else {
                projectile.move(dt, worldHeight);
            }
        }
    }

    checkCollisions() {
        // 1. Projectiles vs Enemies
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];

            if (!projectile.active) {
                continue;
            }

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];

                if (!enemy.active) {
                    continue;
                }

                const hit =
                    projectile.x < enemy.x + enemy.width &&
                    projectile.x + projectile.width > enemy.x &&
                    projectile.y < enemy.y + enemy.height &&
                    projectile.y + projectile.height > enemy.y;

                if (hit) {
                    projectile.deactivate();
                    enemy.deactivate();
                    this.score += 10;
                    break;
                }
            }
        }

        // 2. Enemies vs Player ship & baseline contact
        for (let j = this.enemies.length - 1; j >= 0; j--) {
            const enemy = this.enemies[j];

            if (!enemy.active) {
                continue;
            }

            const hitPlayer =
                enemy.x < this.player.x + this.player.width &&
                enemy.x + enemy.width > this.player.x &&
                enemy.y < this.player.y + this.player.height &&
                enemy.y + enemy.height > this.player.y;

            const reachedBaseline = enemy.y + enemy.height >= this.player.y;

            if (hitPlayer || reachedBaseline) {
                enemy.deactivate();
                this.lives = Math.max(0, this.lives - 1);
            }
        }

        // 3. Enemy Projectiles vs Player ship
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.enemyProjectiles[i];

            if (!projectile.active) {
                continue;
            }

            const hitPlayer =
                projectile.x < this.player.x + this.player.width &&
                projectile.x + projectile.width > this.player.x &&
                projectile.y < this.player.y + this.player.height &&
                projectile.y + projectile.height > this.player.y;

            if (hitPlayer) {
                projectile.deactivate();
                this.lives = Math.max(0, this.lives - 1);
            }
        }
    }

    getWorldWidth() {
        if (!this.cachedWorldWidth && this.world && this.world.clientWidth) {
            this.cachedWorldWidth = this.world.clientWidth;
        }
        return this.cachedWorldWidth || 800;
    }

    getWorldHeight() {
        if (!this.cachedWorldHeight && this.world && this.world.clientHeight) {
            this.cachedWorldHeight = this.world.clientHeight;
        }
        return this.cachedWorldHeight || 600;
    }

    moveEnemies(dt) {
        let reachedEdge = false;
        const worldWidth = this.getWorldWidth();
        const worldHeight = this.getWorldHeight();

        for (const enemy of this.enemies) {
            if (!enemy.active) continue;
            const nextX = enemy.x + this.enemySpeed * this.enemyDirection * dt;

            if (nextX <= 0 || nextX + enemy.width >= worldWidth) {
                reachedEdge = true;
                break;
            }
        }

        if (reachedEdge) {
            this.enemyDirection *= -1;

            for (const enemy of this.enemies) {
                if (enemy.active) {
                    enemy.move(0, this.enemyDropDistance);
                }
            }

            return;
        }

        for (const enemy of this.enemies) {
            if (enemy.active) {
                enemy.move(this.enemySpeed * this.enemyDirection * dt);
            }
        }

        // Check if any enemy reached bottom of game world
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (enemy.active && enemy.y + enemy.height >= worldHeight) {
                enemy.deactivate();
                this.lives = Math.max(0, this.lives - 1);
            }
        }
    }

    startGame() {
        this.state = "PLAYING";
        if (this.input && typeof this.input.clear === "function") {
            this.input.clear();
        }
    }

    nextWave() {
        this.wave++;
        this.enemySpeed = Math.min(350, this.enemySpeed + 20);
        this.lives = Math.min(this.maxLives || 3, this.lives + 1);
        this.timer = 60;
        this.enemyFireTimer = 1.5;

        for (const projectile of this.projectiles) {
            projectile.deactivate();
        }
        this.projectiles = [];

        for (const projectile of this.enemyProjectiles) {
            projectile.deactivate();
        }
        this.enemyProjectiles = [];

        for (const enemy of this.enemies) {
            enemy.deactivate();
        }
        this.createEnemyGrid();
    }

    togglePause() {
        if (this.state === "PLAYING") {
            this.state = "PAUSED";
        } else if (this.state === "PAUSED") {
            this.state = "PLAYING";
        }
    }

    restart() {
        this.state = "START";
        this.wave = 1;
        this.score = 0;
        this.lives = 3;
        this.timer = 60;
        this.fireTimer = 0;
        this.enemyFireTimer = 1.5;
        this.enemyDirection = 1;
        this.enemySpeed = 100;

        // Deactivate projectiles
        for (const projectile of this.projectiles) {
            projectile.deactivate();
        }
        this.projectiles = [];

        for (const projectile of this.enemyProjectiles) {
            projectile.deactivate();
        }
        this.enemyProjectiles = [];

        // Deactivate existing enemies and rebuild grid
        for (const enemy of this.enemies) {
            enemy.deactivate();
        }
        this.createEnemyGrid();

        // Reset player position
        const worldWidth = this.getWorldWidth();
        const worldHeight = this.getWorldHeight();
        this.player.x = (worldWidth - this.player.width) / 2;
        this.player.y = worldHeight - this.player.height - 20;

        if (this.input && typeof this.input.clear === "function") {
            this.input.clear();
        }

        this.render();
    }

    isJustPressed(code) {
        return typeof this.input.isJustPressed === "function" && this.input.isJustPressed(code);
    }

    update(dt) {
        if (this.state === "WAVE_CLEAR") {
            this.waveClearTimer -= dt;
            if (this.waveClearTimer <= 0) {
                this.nextWave();
                this.state = "PLAYING";
            }
            return;
        }

        if (this.state === "START") {
            if (this.isJustPressed("Space") || this.isJustPressed("Enter")) {
                this.startGame();
                this.fireTimer = 0.25;
            }
            return;
        }

        if (this.state === "GAME_OVER" || this.state === "VICTORY") {
            if (this.isJustPressed("Space") || this.isJustPressed("Enter") || this.isJustPressed("KeyR")) {
                this.restart();
            }
            return;
        }

        if (this.isJustPressed("Escape") || this.isJustPressed("KeyP")) {
            this.togglePause();
        }

        if (this.isJustPressed("KeyR")) {
            this.restart();
            return;
        }

        if (this.state !== "PLAYING") {
            return;
        }

        let dx = 0;

        if (this.input.isPressed("ArrowLeft") || this.input.isPressed("KeyA")) {
            dx--;
        }

        if (this.input.isPressed("ArrowRight") || this.input.isPressed("KeyD")) {
            dx++;
        }

        if (this.input.isPressed("Space")) {
            this.fireProjectile();
        }

        if (this.fireTimer > 0) {
            this.fireTimer = Math.max(0, this.fireTimer - dt);
        }

        if (this.enemyFireTimer > 0) {
            this.enemyFireTimer = Math.max(0, this.enemyFireTimer - dt);
        } else {
            this.fireEnemyProjectile();
        }

        this.timer = Math.max(0, this.timer - dt);

        const worldWidth = this.getWorldWidth();
        const worldHeight = this.getWorldHeight();
        this.player.move(dx, 0, dt, worldWidth, worldHeight);
        this.moveEnemies(dt);
        this.updateProjectiles(dt);
        this.updateEnemyProjectiles(dt);
        this.checkCollisions();

        // Check state transitions
        if (this.lives <= 0 || this.timer <= 0) {
            this.state = "GAME_OVER";
        } else if (this.enemies.length === 0 || this.enemies.every((e) => !e.active)) {
            this.state = "WAVE_CLEAR";
            this.waveClearTimer = 2.0;
        }
    }

    render() {
        this.player.render();

        for (const enemy of this.enemies) {
            enemy.render();
        }

        for (const projectile of this.projectiles) {
            projectile.render();
        }

        for (const projectile of this.enemyProjectiles) {
            projectile.render();
        }

        this.updateHUD();
        this.renderOverlay();
    }

    updateHUD() {
        if (this.waveEl && this.wave !== this.lastWave) {
            this.waveEl.textContent = this.wave;
            this.lastWave = this.wave;
        }

        if (this.scoreEl && this.score !== this.lastScore) {
            this.scoreEl.textContent = this.score;
            this.lastScore = this.score;
        }

        if (!this.shieldsEl && typeof globalThis.document !== "undefined" && globalThis.document.getElementById) {
            this.shieldsEl = globalThis.document.getElementById("shields-value");
        }

        if (this.shieldsEl && this.lives !== this.lastLives) {
            let html = "";
            for (let i = 0; i < this.maxLives; i++) {
                const active = i < this.lives;
                html += `<svg class="shield-icon ${active ? '' : 'lost'}" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8s0 0 0 0z"/>
                </svg>`;
            }
            this.shieldsEl.innerHTML = html;
            this.lastLives = this.lives;
        }

        const ceilTimer = Math.ceil(this.timer);
        if (this.timerEl && ceilTimer !== this.lastTimer) {
            this.timerEl.textContent = ceilTimer;
            this.lastTimer = ceilTimer;
        }
    }

    renderOverlay() {
        if (
            this.lastOverlayState === this.state &&
            this.lastOverlayWave === this.wave &&
            this.lastOverlayScore === this.score
        ) {
            return;
        }

        this.lastOverlayState = this.state;
        this.lastOverlayWave = this.wave;
        this.lastOverlayScore = this.score;

        this.overlayElement = updateOverlay(
            this.world,
            this.overlayElement,
            this.state,
            this.wave,
            this.score,
        );
    }
}