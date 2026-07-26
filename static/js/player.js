export class Player {
    constructor(world) {
        this.world = world;

        this.width = 40;
        this.height = 40;

        this.speed = 250;

        const worldWidth = this.world.clientWidth || 800;
        const worldHeight = this.world.clientHeight || 600;

        // Start at bottom center
        this.x = (worldWidth - this.width) / 2;
        this.y = worldHeight - this.height - 20;

        // Create player element
        this.element = document.createElement("div");
        this.element.className = "player";
        this.element.innerHTML = `
            <svg viewBox="0 0 40 40" width="100%" height="100%">
                <!-- Shield aura -->
                <polygon points="20,2 38,14 38,30 20,38 2,30 2,14" fill="none" stroke="#00ffcc" stroke-width="1.5" opacity="0.6"/>
                <!-- Ship main body -->
                <polygon points="20,5 34,26 26,24 20,35 14,24 6,26" fill="#00ffcc" />
                <polygon points="20,10 28,24 20,20 12,24" fill="#003322" />
                <!-- Engine core -->
                <circle cx="20" cy="28" r="3" fill="#ff00aa" />
            </svg>
        `;

        this.world.appendChild(this.element);

        this.render();
    }

    // Move player horizontally
    move(dx, dy, dt) {
        this.x += dx * this.speed * dt;

        const worldWidth = this.world.clientWidth || 800;
        const worldHeight = this.world.clientHeight || 600;

        // Keep inside horizontal game area
        this.x = Math.max(
            0,
            Math.min(this.x, worldWidth - this.width),
        );

        // Fixed vertical position at bottom
        this.y = worldHeight - this.height - 20;
    }

    // Render player
    render() {
        this.element.style.transform =
            `translate(${this.x}px, ${this.y}px)`;
    }
}