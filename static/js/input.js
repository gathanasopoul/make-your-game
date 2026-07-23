export function applyKeyState(keys, event, isPressed) {
    if (!event || !event.code) {
        return;
    }

    if (event.repeat && isPressed) {
        return;
    }

    keys[event.code] = isPressed;
}

export class InputHandler {
    constructor() {
        this.keys = {};

        window.addEventListener("keydown", (e) => {
            applyKeyState(this.keys, e, true);
        });

        window.addEventListener("keyup", (e) => {
            applyKeyState(this.keys, e, false);
        });
    }

    isPressed(keyCode) {
        return !!this.keys[keyCode];
    }
}