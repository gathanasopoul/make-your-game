export class Game {
    constructor(container, input) {
        this.container = container;
        this.input = input;

        this.width = 800;
        this.height = 600;

        this.player = {
            x: this.width / 2 - 25,
            y: this.height - 50,
            width: 50,
            height: 50,
            speed: 300
        };

        this.playerEl = document.createElement("div");
        this.playerEl.className = "game-player";
        this.container.appendChild(this.playerEl);
    }

    update(dt) {
        if (this.input.isPressed("KeyW") || this.input.isPressed("ArrowUp")) {
            this.player.y -= this.player.speed * dt;
        }
        if (this.input.isPressed("KeyS") || this.input.isPressed("ArrowDown")) {
            this.player.y += this.player.speed * dt;
        }
        if (this.input.isPressed("KeyA") || this.input.isPressed("ArrowLeft")) {
            this.player.x -= this.player.speed * dt;
        }
        if (this.input.isPressed("KeyD") || this.input.isPressed("ArrowRight")) {
            this.player.x += this.player.speed * dt;
        }

        this.player.x = Math.max(0, Math.min(this.width - this.player.width, this.player.x));
        this.player.y = Math.max(0, Math.min(this.height - this.player.height, this.player.y));
    }

    render() {
        this.playerEl.style.transform = `translate(${this.player.x}px, ${this.player.y}px)`;
    }
}