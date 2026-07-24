import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

export class Game {
    constructor(world, input) {
        this.world = world;
        this.input = input;

        this.player = new Player(world);

        this.enemyPool = [];
        this.enemies = [];

        this.enemySpeed = 100;
        this.enemyDirection = 1;
        this.enemyDropDistance = 30;
        this.enemyRows = 3;
        this.enemyColumns = 8;

        this.createEnemyPool();
        this.createEnemyGrid();
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

        this.player.move(dx, dy, dt);
        this.moveEnemies(dt);
        this.render();
    }

    render() {
        this.player.render();

        for (const enemy of this.enemies) {
            enemy.render();
        }
    }
}