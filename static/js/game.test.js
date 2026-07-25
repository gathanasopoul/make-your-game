import { describe, expect, it } from "vitest";
import { Game } from "./game.js";

describe("phase 4 enemy system", () => {
  it("creates an enemy grid from the object pool", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement() {
        return {
          style: {},
          className: "",
          appendChild() {}
        };
      }
    };

    try {
      const world = {
        clientWidth: 800,
        clientHeight: 600,
        appendChild() {}
      };

      const game = new Game(world, { isPressed: () => false });

      expect(game.enemies).toHaveLength(24);
      expect(game.enemyPool).toHaveLength(24);
    } finally {
      globalThis.document = originalDocument;
    }
  });

  it("reverses direction and drops when an enemy hits the edge", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement() {
        return {
          style: {},
          className: "",
          appendChild() {}
        };
      }
    };

    try {
      const world = {
        clientWidth: 800,
        clientHeight: 600,
        appendChild() {}
      };

      const game = new Game(world, { isPressed: () => false });
      game.enemySpeed = 1000;
      game.enemyDirection = 1;

      const edgeEnemy = game.enemies[0];
      edgeEnemy.x = 760;
      game.enemyDirection = 1;

      for (const enemy of game.enemies) {
        enemy.x = 760;
      }

      game.moveEnemies(0.1);

      expect(game.enemyDirection).toBe(-1);
      expect(edgeEnemy.y).toBeGreaterThan(0);
    } finally {
      globalThis.document = originalDocument;
    }
  });
});

describe("phase 5 projectile system", () => {
  it("fires a projectile from the player when space is pressed", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement() {
        return {
          style: {},
          className: "",
          appendChild() {}
        };
      }
    };

    try {
      const world = {
        clientWidth: 800,
        clientHeight: 600,
        appendChild() {}
      };

      const game = new Game(world, { isPressed: (key) => key === "Space" });

      game.update(0.016);

      expect(game.projectiles).toHaveLength(1);
      expect(game.projectiles[0].active).toBe(true);
    } finally {
      globalThis.document = originalDocument;
    }
  });

  it("removes a projectile and enemy when they collide", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement() {
        return {
          style: {},
          className: "",
          appendChild() {}
        };
      }
    };

    try {
      const world = {
        clientWidth: 800,
        clientHeight: 600,
        appendChild() {}
      };

      const game = new Game(world, { isPressed: () => false });
      const enemy = game.enemies[0];
      const projectile = game.projectilePool[0];

      projectile.activate(0, 0);
      enemy.activate(0, 0);
      game.projectiles.push(projectile);

      game.checkCollisions();

      expect(projectile.active).toBe(false);
      expect(enemy.active).toBe(false);
    } finally {
      globalThis.document = originalDocument;
    }
  });
});
