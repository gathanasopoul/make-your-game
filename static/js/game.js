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

        // Create player element
        this.playerElement = document.createElement("div");
        this.playerElement.className = "player";

        this.playerElement.style.position = "absolute";
        this.playerElement.style.width = `${this.player.width}px`;
        this.playerElement.style.height = `${this.player.height}px`;
        this.playerElement.style.background = "#4CAF50";
        this.playerElement.style.borderRadius = "4px";

        this.world.appendChild(this.playerElement);

        this.render();
    }

    // Update player position
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

        this.player.x += dx * this.player.speed * dt;
        this.player.y += dy * this.player.speed * dt;

        // Keep player inside game area
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