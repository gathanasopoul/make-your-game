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
        this.element.innerHTML = `
            <svg viewBox="0 0 6 14" width="100%" height="100%">
                <rect x="1" y="0" width="4" height="14" rx="2" fill="#ffd54f" />
                <rect x="2" y="2" width="2" height="10" rx="1" fill="#ffffff" />
            </svg>
        `;

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
