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

    if (isPressed && !keys[primary] && justPressedKeys) {
        justPressedKeys[primary] = true;
    }

    keys[primary] = isPressed;
    if (code) {
        keys[code] = isPressed;
    }
    if (key) {
        keys[key] = isPressed;
        keys[key.toLowerCase()] = isPressed;
    }
}

export class InputHandler {
    constructor() {
        this.keys = {};
        this.justPressedKeys = {};

        if (typeof window !== "undefined" && window.addEventListener) {
            window.addEventListener("keydown", (e) => {
                applyKeyState(this.keys, e, true, this.justPressedKeys);
            });

            window.addEventListener("keyup", (e) => {
                applyKeyState(this.keys, e, false);
            });

            window.addEventListener("blur", () => {
                this.keys = {};
                this.justPressedKeys = {};
            });
        }
    }

    isPressed(keyCode) {
        return !!this.keys[keyCode] || !!this.keys[keyCode.toLowerCase()];
    }

    isJustPressed(keyCode) {
        const raw = keyCode.startsWith("Key") ? keyCode.slice(3) : keyCode;
        const aliases = [
            keyCode,
            keyCode.toLowerCase(),
            raw,
            raw.toLowerCase(),
            raw.toUpperCase(),
            "Key" + raw.toUpperCase()
        ];

        for (const id of aliases) {
            if (this.justPressedKeys[id]) {
                for (const alias of aliases) {
                    delete this.justPressedKeys[alias];
                }
                return true;
            }
        }

        return false;
    }
}