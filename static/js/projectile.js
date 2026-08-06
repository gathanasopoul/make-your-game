export class Projectile {
    constructor(world, isEnemy = false) {
        this.world = world;
        this.isEnemy = isEnemy;

        this.width = 6;
        this.height = 14;
        this.speed = isEnemy ? 250 : 400;

        this.x = 0;
        this.y = 0;
        this.active = false;

        this.element = document.createElement("div");
        this.element.className = isEnemy ? "projectile enemy-projectile" : "projectile";
        this.element.innerHTML = isEnemy
            ? `
            <svg viewBox="0 0 6 14" width="100%" height="100%">
                <rect x="1" y="0" width="4" height="14" rx="2" fill="#ff0055" />
                <rect x="2" y="2" width="2" height="10" rx="1" fill="#ffffff" />
            </svg>
        `
            : `
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
        this.lastX = null;
        this.lastY = null;
        this.active = true;
        this.element.style.display = "block";
        this.render();
    }

    hide() {
        this.element.style.display = "none";
    }

    move(dt, worldHeight = 600) {
        if (!this.active) {
            return;
        }

        if (this.isEnemy) {
            this.y += Math.abs(this.speed) * dt;
            if (this.y > worldHeight) {
                this.deactivate();
            }
        } else {
            this.y -= Math.abs(this.speed) * dt;

            if (this.y + this.height < 0) {
                this.deactivate();
            }
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

        const rx = Math.round(this.x);
        const ry = Math.round(this.y);

        if (rx === this.lastX && ry === this.lastY) {
            return;
        }

        this.lastX = rx;
        this.lastY = ry;

        if (this.isEnemy) {
            this.element.style.transform = `translate(${rx}px, ${ry}px) rotate(180deg)`;
        } else {
            this.element.style.transform = `translate(${rx}px, ${ry}px)`;
        }
    }
}
