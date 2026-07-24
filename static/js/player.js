export class Player {
    constructor(world) {
        this.world = world;

        this.x = 380;
        this.y = 280;

        this.width = 40;
        this.height = 40;

        this.speed = 250;

        // Create player element
        this.element = document.createElement("div");
        this.element.className = "player";

        this.world.appendChild(this.element);

        this.render();
    }

    // Move player
    move(dx, dy, dt) {
        this.x += dx * this.speed * dt;
        this.y += dy * this.speed * dt;

        this.x = Math.max(
            0,
            Math.min(this.x, this.world.clientWidth - this.width),
        );

        this.y = Math.max(
            0,
            Math.min(this.y, this.world.clientHeight - this.height),
        );
    }

    // Render player
    render() {
        this.element.style.transform =
            `translate(${this.x}px, ${this.y}px)`;
    }
}