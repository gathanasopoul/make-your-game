export class Enemy {
    constructor(world, x, y) {
        this.world = world;

        this.x = x;
        this.y = y;

        this.width = 40;
        this.height = 40;

        // Create enemy element
        this.element = document.createElement("div");
        this.element.className = "enemy";

        this.world.appendChild(this.element);

        this.render();
    }

    // Move enemy
    move(dx, dy = 0) {
        this.x += dx;
        this.y += dy;
}

    // Render enemy
    render() {
        this.element.style.transform =
            `translate(${this.x}px, ${this.y}px)`;
    }
}