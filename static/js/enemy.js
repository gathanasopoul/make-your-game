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
        this.element.innerHTML = `
            <svg viewBox="0 0 40 40" width="100%" height="100%">
                <!-- Outer virus spikes -->
                <path d="M20 2 L24 8 L32 4 L30 12 L38 16 L32 22 L38 28 L30 30 L32 38 L24 34 L20 40 L16 34 L8 38 L10 30 L2 28 L8 22 L2 16 L10 12 L8 4 L16 8 Z" fill="#ff0055" opacity="0.4"/>
                <!-- Main core skull/bug -->
                <rect x="10" y="10" width="20" height="20" rx="4" fill="#ff0055"/>
                <!-- Glowing digital eyes -->
                <rect x="13" y="14" width="5" height="5" fill="#00ffff"/>
                <rect x="22" y="14" width="5" height="5" fill="#00ffff"/>
                <!-- Glitch mouth -->
                <path d="M14 24 H26 V26 H14 Z" fill="#111"/>
                <rect x="16" y="24" width="2" height="2" fill="#ff0055"/>
                <rect x="22" y="24" width="2" height="2" fill="#ff0055"/>
            </svg>
        `;

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