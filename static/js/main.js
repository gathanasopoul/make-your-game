import { InputHandler } from "./input.js";
import { Game } from "./game.js";

const world = document.getElementById("game-world");

if (!world) {
    throw new Error("Game world not found");
}

const input = new InputHandler();

const game = new Game(world, input);
if (typeof window !== "undefined") {
    window.gameInstance = game;
}

let lastTime = 0;

function gameLoop(timestamp) {

    if (!lastTime) {
        lastTime = timestamp;
    }

    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);

    lastTime = timestamp;

    game.update(dt);

    game.render();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);