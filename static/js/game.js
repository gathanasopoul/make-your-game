export class Game {
    constructor(world, input) {
        this.world = world;
        this.input = input;

        // Player state
        this.player = {
            x: 380,
            y: 280,
            width: 40,
            height: 40,
            speed: 250,
        };

        // Create player
        this.playerElement = document.createElement("div");
        this.playerElement.className = "player";

        this.world.appendChild(this.playerElement);

        this.render();
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

        // Move player
        this.player.x += dx * this.player.speed * dt;
        this.player.y += dy * this.player.speed * dt;

        // Keep inside world
        this.player.x = Math.max(
            0,
            Math.min(
                this.player.x,
                this.world.clientWidth - this.player.width,
            ),
        );

        this.player.y = Math.max(
            0,
            Math.min(
                this.player.y,
                this.world.clientHeight - this.player.height,
            ),
        );
    }

    // Render player
    render() {
        this.playerElement.style.transform =
            `translate(${this.player.x}px, ${this.player.y}px)`;
    }
}