import { InputHandler } from "./input.js";
import { Game } from "./game.js";

const canvas = document.getElementById("gameCanvas");

if (!canvas) {
    throw new Error("Game canvas not found");
}

const input = new InputHandler();
const game = new Game(canvas, input);

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