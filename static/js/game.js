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
        this.integrity = 100;
        this.timer = 60;
        this.overlayElement = null;

        // Cached HUD DOM elements to avoid document.getElementById queries during render loop
        this.waveEl = typeof globalThis.document !== "undefined" && globalThis.document.getElementById
            ? globalThis.document.getElementById("wave-value")
            : null;
        this.scoreEl = typeof globalThis.document !== "undefined" && globalThis.document.getElementById
            ? globalThis.document.getElementById("score-value")
            : null;
        this.integrityEl = typeof globalThis.document !== "undefined" && globalThis.document.getElementById
            ? globalThis.document.getElementById("integrity-value")
            : null;
        this.timerEl = typeof globalThis.document !== "undefined" && globalThis.document.getElementById
            ? globalThis.document.getElementById("timer-value")
            : null;

        this.lastWave = -1;
        this.lastScore = -1;
        this.lastIntegrity = -1;
        this.lastTimer = -1;

        this.createEnemyPool();
        this.createEnemyGrid();
        this.createProjectilePool();
        this.createEnemyProjectilePool();
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

        const activeEnemies = this.enemies.filter((enemy) => enemy.active);
        if (activeEnemies.length === 0) {
            return;
        }

        const projectile = this.enemyProjectilePool.find((item) => !item.active);
        if (!projectile) {
            return;
        }

        // Get bottom-most active enemy in each column to ensure clean front-line fire
        const bottomEnemiesMap = {};
        for (const enemy of activeEnemies) {
            const colKey = Math.round(enemy.x);
            if (!bottomEnemiesMap[colKey] || enemy.y > bottomEnemiesMap[colKey].y) {
                bottomEnemiesMap[colKey] = enemy;
            }
        }
        const bottomEnemies = Object.values(bottomEnemiesMap);
        const shooter = bottomEnemies[Math.floor(Math.random() * bottomEnemies.length)];

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
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];

            if (!projectile.active) {
                this.projectiles.splice(i, 1);
            } else {
                projectile.move(dt);
            }
        }
    }

    updateEnemyProjectiles(dt) {
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
            const projectile = this.enemyProjectiles[i];

            if (!projectile.active) {
                this.enemyProjectiles.splice(i, 1);
            } else {
                projectile.move(dt);
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
                    this.projectiles.splice(i, 1);
                    this.enemies.splice(j, 1);
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
                this.enemies.splice(j, 1);
                this.integrity = Math.max(0, this.integrity - 25);
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
                this.enemyProjectiles.splice(i, 1);
                this.integrity = Math.max(0, this.integrity - 10);
            }
        }
    }

    getWorldWidth() {
        return (this.world && this.world.clientWidth) ? this.world.clientWidth : 800;
    }

    getWorldHeight() {
        return (this.world && this.world.clientHeight) ? this.world.clientHeight : 600;
    }

    moveEnemies(dt) {
        let reachedEdge = false;
        const worldWidth = this.getWorldWidth();
        const worldHeight = this.getWorldHeight();

        for (const enemy of this.enemies) {
            const nextX = enemy.x + this.enemySpeed * this.enemyDirection * dt;

            if (nextX <= 0 || nextX + enemy.width >= worldWidth) {
                reachedEdge = true;
                break;
            }
        }

        if (reachedEdge) {
            this.enemyDirection *= -1;

            for (const enemy of this.enemies) {
                enemy.move(0, this.enemyDropDistance);
            }

            return;
        }

        for (const enemy of this.enemies) {
            enemy.move(this.enemySpeed * this.enemyDirection * dt);
        }

        // Check if any enemy reached bottom of game world
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (enemy.y + enemy.height >= worldHeight) {
                enemy.deactivate();
                this.enemies.splice(i, 1);
                this.integrity = Math.max(0, this.integrity - 25);
            }
        }
    }

    startGame() {
        this.state = "PLAYING";
    }

    nextWave() {
        this.wave++;
        this.enemySpeed = Math.min(350, this.enemySpeed + 20);
        this.integrity = Math.min(100, this.integrity + 20);
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
        this.state = "PLAYING";
        this.wave = 1;
        this.score = 0;
        this.integrity = 100;
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

        this.render();
    }

    update(dt) {
        const isJustPressed = (code) =>
            typeof this.input.isJustPressed === "function" && this.input.isJustPressed(code);

        if (this.state === "WAVE_CLEAR") {
            this.waveClearTimer -= dt;
            if (this.waveClearTimer <= 0) {
                this.nextWave();
                this.state = "PLAYING";
            }
            return;
        }

        if (this.state === "START") {
            if (isJustPressed("Space") || isJustPressed("Enter") || (typeof this.input.isPressed === "function" && this.input.isPressed("Space"))) {
                this.startGame();
            }
            return;
        }

        if (isJustPressed("Escape") || isJustPressed("KeyP")) {
            this.togglePause();
        }

        if (isJustPressed("KeyR")) {
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

        this.player.move(dx, 0, dt);
        this.moveEnemies(dt);
        this.updateProjectiles(dt);
        this.updateEnemyProjectiles(dt);
        this.checkCollisions();

        // Check state transitions
        if (this.integrity <= 0 || this.timer <= 0) {
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

        if (this.integrityEl && this.integrity !== this.lastIntegrity) {
            this.integrityEl.textContent = this.integrity;
            this.lastIntegrity = this.integrity;
        }

        const ceilTimer = Math.ceil(this.timer);
        if (this.timerEl && ceilTimer !== this.lastTimer) {
            this.timerEl.textContent = ceilTimer;
            this.lastTimer = ceilTimer;
        }
    }

    renderOverlay() {
        this.overlayElement = updateOverlay(
            this.world,
            this.overlayElement,
            this.state,
            this.wave,
            this.score,
        );
    }
}