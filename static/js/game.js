export class Game {
    constructor(canvas, input) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.input = input;

        // Player entity initial state
        this.player = {
            x: canvas.width / 2 - 25,
            y: canvas.height / 2 - 25,
            width: 50,
            height: 50,
            speed: 300 // pixels per second
        };
    }

    update(dt) {
        // Move player based on inputs using Delta Time
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

        // Clamp player inside canvas bounds
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
        this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, this.player.y));
    }

    render() {
        // 1. Clear frame
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2. Draw Player
        this.ctx.fillStyle = "#00ffcc";
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    }
}