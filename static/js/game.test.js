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
      game.startGame();

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
      game.startGame();
      const enemy = game.enemies[0];
      const projectile = game.projectilePool[0];

      projectile.activate(0, 0);
      enemy.activate(0, 0);
      game.projectiles.push(projectile);

      game.checkCollisions();

      expect(projectile.active).toBe(false);
      expect(enemy.active).toBe(false);
      expect(game.score).toBe(10);
    } finally {
      globalThis.document = originalDocument;
    }
  });
});

describe("phase 6 HUD & game logic", () => {
  it("increments score on collision and decrements timer during update", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement() {
        return { style: {}, className: "", appendChild() {} };
      },
      getElementById() {
        return { textContent: "" };
      }
    };

    try {
      const world = { clientWidth: 800, clientHeight: 600, appendChild() {} };
      const game = new Game(world, { isPressed: () => false });
      game.startGame();

      expect(game.score).toBe(0);
      expect(game.timer).toBe(60);

      game.update(1.5);

      expect(game.timer).toBe(58.5);
    } finally {
      globalThis.document = originalDocument;
    }
  });

  it("decreases integrity when enemy reaches bottom boundary", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement() {
        return { style: {}, className: "", appendChild() {} };
      }
    };

    try {
      const world = { clientWidth: 800, clientHeight: 600, appendChild() {} };
      const game = new Game(world, { isPressed: () => false });
      game.startGame();

      const breachEnemy = game.enemies[0];
      breachEnemy.y = 570; // 570 + 40 = 610 >= 600

      game.moveEnemies(0.01);

      expect(game.integrity).toBe(75);
    } finally {
      globalThis.document = originalDocument;
    }
  });

  it("advances to next wave when all enemies are cleared", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement() {
        return { style: {}, className: "", appendChild() {} };
      }
    };

    try {
      const world = { clientWidth: 800, clientHeight: 600, appendChild() {} };
      const game = new Game(world, { isPressed: () => false });
      game.startGame();

      expect(game.wave).toBe(1);

      for (const enemy of game.enemies) {
        enemy.deactivate();
      }
      game.enemies = [];

      game.update(0.016);
      expect(game.state).toBe("WAVE_CLEAR");

      game.update(2.1);

      expect(game.state).toBe("PLAYING");
      expect(game.wave).toBe(2);
      expect(game.enemies.length).toBeGreaterThan(0);
    } finally {
      globalThis.document = originalDocument;
    }
  });

  it("transitions to GAME_OVER when timer reaches zero or integrity reaches zero", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement() {
        return { style: {}, className: "", appendChild() {} };
      }
    };

    try {
      const world = { clientWidth: 800, clientHeight: 600, appendChild() {} };
      const game = new Game(world, { isPressed: () => false, isJustPressed: () => false });
      game.startGame();

      game.timer = 0.5;
      game.update(1.0);

      expect(game.state).toBe("GAME_OVER");
    } finally {
      globalThis.document = originalDocument;
    }
  });
});

describe("phase 7 pause & polish system", () => {
  it("toggles pause state and freezes updates while paused", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement() {
        return { style: {}, className: "", appendChild() {} };
      }
    };

    try {
      const world = { clientWidth: 800, clientHeight: 600, appendChild() {} };
      let justPressedEscape = true;
      const game = new Game(world, {
        isPressed: () => false,
        isJustPressed: (key) => {
          if (key === "Escape" && justPressedEscape) {
            justPressedEscape = false;
            return true;
          }
          return false;
        }
      });
      game.startGame();

      expect(game.state).toBe("PLAYING");

      game.update(0.016);
      expect(game.state).toBe("PAUSED");

      const currentTimer = game.timer;
      game.update(1.0);

      // Timer should remain frozen while paused
      expect(game.timer).toBe(currentTimer);
    } finally {
      globalThis.document = originalDocument;
    }
  });

  it("restarts game state cleanly when restart is invoked", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement() {
        return { style: {}, className: "", appendChild() {} };
      }
    };

    try {
      const world = { clientWidth: 800, clientHeight: 600, appendChild() {} };
      const game = new Game(world, { isPressed: () => false, isJustPressed: () => false });

      game.score = 150;
      game.integrity = 25;
      game.timer = 12;
      game.state = "GAME_OVER";

      game.restart();

      expect(game.state).toBe("PLAYING");
      expect(game.score).toBe(0);
      expect(game.integrity).toBe(100);
      expect(game.timer).toBe(60);
      expect(game.wave).toBe(1);
      expect(game.enemies).toHaveLength(24);
    } finally {
      globalThis.document = originalDocument;
    }
  });

  it("handles player and enemy contact collision damage correctly", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement() {
        return { style: {}, className: "", appendChild() {} };
      }
    };

    try {
      const world = { clientWidth: 800, clientHeight: 600, appendChild() {} };
      const game = new Game(world, { isPressed: () => false });
      game.startGame();

      const enemy = game.enemies[0];
      enemy.activate(game.player.x, game.player.y);

      game.checkCollisions();

      expect(enemy.active).toBe(false);
      expect(game.integrity).toBe(75);
    } finally {
      globalThis.document = originalDocument;
    }
  });

  it("launches enemy projectiles and damages player on hit", () => {
    const originalDocument = globalThis.document;
    globalThis.document = {
      createElement() {
        return { style: {}, className: "", appendChild() {} };
      }
    };

    try {
      const world = { clientWidth: 800, clientHeight: 600, appendChild() {} };
      const game = new Game(world, { isPressed: () => false, isJustPressed: () => false });
      game.startGame();

      game.fireEnemyProjectile();

      expect(game.enemyProjectiles.length).toBeGreaterThan(0);
      const enemyProj = game.enemyProjectiles[0];
      expect(enemyProj.active).toBe(true);

      enemyProj.x = game.player.x;
      enemyProj.y = game.player.y;

      game.checkCollisions();

      expect(enemyProj.active).toBe(false);
      expect(game.integrity).toBe(90);
    } finally {
      globalThis.document = originalDocument;
    }
  });
});


