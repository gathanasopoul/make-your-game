import { Player } from "./player.js";

export class Game {
    constructor(world, input) {
        this.world = world;
        this.input = input;

        this.player = new Player(world);
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

        this.render();
    }

    // Render game
    render() {
        this.player.render();
    }
}