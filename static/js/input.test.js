import { describe, expect, it } from "vitest";
import { applyKeyState } from "./input.js";

describe("applyKeyState", () => {
  it("sets a key to pressed on the first keydown event", () => {
    const keys = {};

    applyKeyState(keys, { code: "ArrowLeft", repeat: false }, true);

    expect(keys.ArrowLeft).toBe(true);
  });

  it("ignores repeated keydown events so movement does not flicker", () => {
    const keys = {};

    applyKeyState(keys, { code: "ArrowLeft", repeat: false }, true);
    applyKeyState(keys, { code: "ArrowLeft", repeat: true }, true);

    expect(keys.ArrowLeft).toBe(true);
  });

  it("clears a key on keyup events", () => {
    const keys = {};

    applyKeyState(keys, { code: "ArrowLeft", repeat: false }, true);
    applyKeyState(keys, { code: "ArrowLeft", repeat: false }, false);

    expect(keys.ArrowLeft).toBe(false);
  });
});
