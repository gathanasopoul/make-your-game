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
        if (this.fireTimer > 0) {
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
        this.projectiles = this.projectiles.filter((projectile) => projectile.active);

        for (const projectile of this.projectiles) {
            projectile.move(dt);
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
                    this.projectiles.splice(i, 1);
                    this.enemies.splice(j, 1);
                    break;
                }
            }
        }
    }

    moveEnemies(dt) {
        let reachedEdge = false;

        for (const enemy of this.enemies) {
            const nextX = enemy.x + this.enemySpeed * this.enemyDirection * dt;

            if (nextX <= 0 || nextX + enemy.width >= this.world.clientWidth) {
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
    }

    update(dt) {
        let dx = 0;
        let dy = 0;

        if (this.input.isPressed("ArrowLeft")) {
            dx--;
        }

        if (this.input.isPressed("ArrowRight")) {
            dx++;
        }

        if (this.input.isPressed("ArrowUp")) {
            dy--;
        }

        if (this.input.isPressed("ArrowDown")) {
            dy++;
        }

        if (dx !== 0 && dy !== 0) {
            const length = Math.hypot(dx, dy);

            dx /= length;
            dy /= length;
        }

        if (this.input.isPressed("Space")) {
            this.fireProjectile();
        }

        if (this.fireTimer > 0) {
            this.fireTimer = Math.max(0, this.fireTimer - dt);
        }

        this.player.move(dx, dy, dt);
        this.moveEnemies(dt);
        this.updateProjectiles(dt);
        this.checkCollisions();
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
    }
}