export function applyKeyState(keys, event, isPressed, justPressedKeys = null) {
    if (!event) {
        return;
    }

    if (event.repeat && isPressed) {
        return;
    }

    const code = event.code || "";
    const key = event.key || "";
    const primary = code || key;

    const lowerCode = code ? code.toLowerCase() : "";
    const lowerKey = key ? key.toLowerCase() : "";
    const rawCode = code && code.startsWith("Key") ? code.slice(3) : "";
    const lowerRawCode = rawCode ? rawCode.toLowerCase() : "";

    if (isPressed && !keys[primary] && justPressedKeys) {
        justPressedKeys[primary] = true;
        if (code) justPressedKeys[code] = true;
        if (key) justPressedKeys[key] = true;
        if (lowerCode) justPressedKeys[lowerCode] = true;
        if (lowerKey) justPressedKeys[lowerKey] = true;
        if (rawCode) justPressedKeys[rawCode] = true;
        if (lowerRawCode) justPressedKeys[lowerRawCode] = true;
    }

    keys[primary] = isPressed;
    if (code) keys[code] = isPressed;
    if (key) keys[key] = isPressed;
    if (lowerCode) keys[lowerCode] = isPressed;
    if (lowerKey) keys[lowerKey] = isPressed;
    if (rawCode) keys[rawCode] = isPressed;
    if (lowerRawCode) keys[lowerRawCode] = isPressed;
}

export class InputHandler {
    constructor() {
        this.keys = {};
        this.justPressedKeys = {};

        if (typeof window !== "undefined" && window.addEventListener) {
            const preventKeys = new Set(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyA", "KeyD", "KeyP", "KeyR", "Escape", "Enter", " "]);

            window.addEventListener("keydown", (e) => {
                if (preventKeys.has(e.code) || preventKeys.has(e.key)) {
                    if (typeof e.preventDefault === "function") {
                        e.preventDefault();
                    }
                }
                applyKeyState(this.keys, e, true, this.justPressedKeys);
            });

            window.addEventListener("keyup", (e) => {
                if (preventKeys.has(e.code) || preventKeys.has(e.key)) {
                    if (typeof e.preventDefault === "function") {
                        e.preventDefault();
                    }
                }
                applyKeyState(this.keys, e, false);
            });

            window.addEventListener("blur", () => {
                this.keys = {};
                this.justPressedKeys = {};
            });
        }
    }

    clear() {
        this.keys = {};
        this.justPressedKeys = {};
    }

    isPressed(keyCode) {
        return !!this.keys[keyCode];
    }

    isJustPressed(keyCode) {
        if (this.justPressedKeys[keyCode]) {
            this.justPressedKeys[keyCode] = false;
            return true;
        }
        return false;
    }
}