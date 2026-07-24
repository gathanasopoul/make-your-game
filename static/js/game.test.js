import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Game } from "./game.js";

describe("game implementation", () => {
  it("does not use canvas rendering for the game", () => {
    const gameSource = readFileSync(new URL("./game.js", import.meta.url), "utf8");
    const htmlSource = readFileSync(new URL("../index.html", import.meta.url), "utf8");

    expect(gameSource).not.toMatch(/getContext\s*\(/);
    expect(gameSource).not.toContain("canvas");
    expect(htmlSource).not.toContain("<canvas");
  });

  it("places the player at the bottom center of the play area", () => {
    const originalDocument = global.document;
    const createdElements = [];

    global.document = {
      createElement(tagName) {
        const element = {
          tagName,
          style: {},
          className: ""
        };
        createdElements.push(element);
        return element;
      }
    };

    try {
      const container = {
        appendChild() {}
      };
      const game = new Game(container, { isPressed: () => false });

      expect(game.player.x).toBe(800 / 2 - 25);
      expect(game.player.y).toBe(600 - 50);
    } finally {
      global.document = originalDocument;
    }
  });
});
