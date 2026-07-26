import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { Projectile } from "./projectile.js";

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

        // Phase 6: HUD & Game Logic state
        this.state = "PLAYING";
        this.score = 0;
        this.integrity = 100;
        this.timer = 60;
        this.overlayElement = null;

        // Cached HUD DOM elements to avoid document.getElementById queries during render loop
        this.scoreEl = typeof globalThis.document !== "undefined" && globalThis.document.getElementById
            ? globalThis.document.getElementById("score-value")
            : null;
        this.integrityEl = typeof globalThis.document !== "undefined" && globalThis.document.getElementById
            ? globalThis.document.getElementById("integrity-value")
            : null;
        this.timerEl = typeof globalThis.document !== "undefined" && globalThis.document.getElementById
            ? globalThis.document.getElementById("timer-value")
            : null;

        this.lastScore = -1;
        this.lastIntegrity = -1;
        this.lastTimer = -1;

        this.createEnemyPool();
        this.createEnemyGrid();
        this.createProjectilePool();
    }

    createEnemyPool() {
        const poolSize = this.enemyRows * this.enemyColumns;

        for (let i = 0; i < poolSize; i++) {
            this.enemyPool.push(new Enemy(this.world));
        }
    }

    createEnemyGrid() {
        const startX = 80;
        const startY = 60;
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
        this.projectiles.push(projectile);
        this.fireTimer = this.fireCooldown;
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

    checkCollisions() {
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

        // Check if any enemy reached the bottom boundary
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (enemy.y + enemy.height >= worldHeight) {
                enemy.deactivate();
                this.enemies.splice(i, 1);
                this.integrity = Math.max(0, this.integrity - 25);
            }
        }
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
        this.score = 0;
        this.integrity = 100;
        this.timer = 60;
        this.fireTimer = 0;
        this.enemyDirection = 1;
        this.enemySpeed = 100;

        // Deactivate projectiles
        for (const projectile of this.projectiles) {
            projectile.deactivate();
        }
        this.projectiles = [];

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

        if (isJustPressed("Escape") || isJustPressed("KeyP")) {
            this.togglePause();
        }

        if (isJustPressed("KeyR") || (this.state !== "PLAYING" && this.input.isPressed("KeyR"))) {
            this.restart();
            return;
        }

        if (this.state !== "PLAYING") {
            this.render();
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

        this.timer = Math.max(0, this.timer - dt);

        this.player.move(dx, 0, dt);
        this.moveEnemies(dt);
        this.updateProjectiles(dt);
        this.checkCollisions();

        // Check state transitions
        if (this.integrity <= 0 || this.timer <= 0) {
            this.state = "GAME_OVER";
        } else if (this.enemies.length === 0 || this.enemies.every((e) => !e.active)) {
            this.state = "VICTORY";
        }

        this.render();
    }

    render() {
        this.player.render();

        for (const enemy of this.enemies) {
            enemy.render();
        }

        for (const projectile of this.projectiles) {
            projectile.render();
        }

        this.updateHUD();
        this.renderOverlay();
    }

    updateHUD() {
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
        if (typeof globalThis.document === "undefined" || !globalThis.document.createElement) {
            return;
        }

        if (this.state === "PLAYING") {
            if (this.overlayElement && this.overlayElement.parentNode) {
                this.overlayElement.parentNode.removeChild(this.overlayElement);
                this.overlayElement = null;
            }

            return;
        }

        if (!this.overlayElement) {
            this.overlayElement = globalThis.document.createElement("div");
            this.overlayElement.className = "game-overlay";
            if (this.world.appendChild) {
                this.world.appendChild(this.overlayElement);
            }
        }

        if (this.state === "PAUSED") {
            this.overlayElement.className = "game-overlay paused";
            this.overlayElement.innerHTML = `
                <h1>SYSTEM PAUSED</h1>
                <button class="menu-btn" onclick="if(window.gameInstance) window.gameInstance.togglePause()">Resume [P / ESC]</button>
                <button class="menu-btn" onclick="if(window.gameInstance) window.gameInstance.restart()">Restart System [R]</button>
            `;
        } else if (this.state === "VICTORY") {
            this.overlayElement.className = "game-overlay victory";
            this.overlayElement.innerHTML = `
                <h1>SYSTEM SECURED</h1>
                <p>Final Recovered: ${this.score}MB</p>
                <button class="menu-btn" onclick="if(window.gameInstance) window.gameInstance.restart()">Restart System [R]</button>
            `;
        } else if (this.state === "GAME_OVER") {
            this.overlayElement.className = "game-overlay game-over";
            this.overlayElement.innerHTML = `
                <h1>SYSTEM COMPROMISED</h1>
                <p>Score: ${this.score}MB</p>
                <button class="menu-btn" onclick="if(window.gameInstance) window.gameInstance.restart()">Restart System [R]</button>
            `;
        }
    }
}