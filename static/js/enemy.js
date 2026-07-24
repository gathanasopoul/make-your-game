export class Enemy {
    constructor(world) {
        this.world = world;

        this.width = 40;
        this.height = 40;

        this.x = 0;
        this.y = 0;

        this.active = false;

        // Create enemy element
        this.element = document.createElement("div");
        this.element.className = "enemy";

        this.world.appendChild(this.element);

        this.hide();
    }

    // Activate enemy
    activate(x, y) {
        this.x = x;
        this.y = y;

        this.active = true;

        this.element.style.display = "block";

        this.render();
    }

    // Deactivate enemy
    deactivate() {
        this.active = false;

        this.hide();
    }

    // Hide enemy
    hide() {
        this.element.style.display = "none";
    }

    // Move enemy
    move(dx, dy = 0) {
        if (!this.active) {
            return;
        }

        this.x += dx;
        this.y += dy;
    }

    // Render enemy
    render() {
        if (!this.active) {
            return;
        }

        this.element.style.transform =
            `translate(${this.x}px, ${this.y}px)`;
    }
}