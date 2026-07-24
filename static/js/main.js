import { InputHandler } from "./input.js";
import { Game } from "./game.js";

const container = document.getElementById("game-container");

if (!container) {
    throw new Error("Game container not found");
}

const input = new InputHandler();
const game = new Game(container, input);

let lastTime = 0;

function gameLoop(timestamp) {
    if (!lastTime) {
        lastTime = timestamp;
    }

    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    game.update(dt);
    game.render();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);