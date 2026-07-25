export class Projectile {
    constructor(world) {
        this.world = world;

        this.width = 6;
        this.height = 14;
        this.speed = 400;

        this.x = 0;
        this.y = 0;
        this.active = false;

        this.element = document.createElement("div");
        this.element.className = "projectile";

        this.world.appendChild(this.element);
        this.hide();
    }

    activate(x, y) {
        this.x = x;
        this.y = y;
        this.active = true;
        this.element.style.display = "block";
        this.render();
    }

    hide() {
        this.element.style.display = "none";
    }

    move(dt) {
        if (!this.active) {
            return;
        }

        this.y -= this.speed * dt;

        if (this.y + this.height < 0) {
            this.deactivate();
        }
    }

    deactivate() {
        this.active = false;
        this.hide();
    }

    render() {
        if (!this.active) {
            return;
        }

        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}
