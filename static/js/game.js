import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

export class Game {
    constructor(world, input) {
        this.world = world;
        this.input = input;

        this.player = new Player(world);

        this.enemies = [];

        this.createEnemyGrid();
    }

    // Create enemy formation
    createEnemyGrid() {
        const rows = 3;
        const columns = 8;

        const startX = 80;
        const startY = 60;

        const spacingX = 60;
        const spacingY = 60;

        this.enemySpeed = 100;
        this.enemyDirection = 1;
        this.enemyDropDistance = 30;

        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const x = startX + column * spacingX;
                const y = startY + row * spacingY;

                this.enemies.push(
                    new Enemy(this.world, x, y),
                );
            }
        }
    }

    // Move enemy fleet
    moveEnemies(dt) {
    let reachedEdge = false;

    for (const enemy of this.enemies) {
        const nextX =
            enemy.x + this.enemySpeed * this.enemyDirection * dt;

        if (
            nextX <= 0 ||
            nextX + enemy.width >= this.world.clientWidth
        ) {
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
        enemy.move(
            this.enemySpeed * this.enemyDirection * dt,
        );
    }
}

    // Update game state
    update(dt) {
        let dx = 0;
        let dy = 0;

        // Horizontal input
        if (this.input.isPressed("ArrowLeft")) {
            dx--;
        }

        if (this.input.isPressed("ArrowRight")) {
            dx++;
        }

        // Vertical input
        if (this.input.isPressed("ArrowUp")) {
            dy--;
        }

        if (this.input.isPressed("ArrowDown")) {
            dy++;
        }

        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const length = Math.hypot(dx, dy);

            dx /= length;
            dy /= length;
        }

        this.player.move(dx, dy, dt);

        this.moveEnemies(dt);

        this.render();
    }

    // Render game
    render() {
        this.player.render();

        for (const enemy of this.enemies) {
            enemy.render();
        }
    }
}