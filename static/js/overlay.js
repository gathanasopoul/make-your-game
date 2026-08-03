export function updateOverlay(world, overlayElement, state, wave, score) {
    if (typeof globalThis.document === "undefined" || !globalThis.document.createElement) {
        return null;
    }

    if (state === "PLAYING") {
        if (overlayElement && overlayElement.parentNode) {
            overlayElement.parentNode.removeChild(overlayElement);
        }
        return null;
    }

    let currentOverlay = overlayElement;
    if (!currentOverlay) {
        currentOverlay = globalThis.document.createElement("div");
        currentOverlay.className = "game-overlay";
        if (world && world.appendChild) {
            world.appendChild(currentOverlay);
        }
    }

    if (state === "WAVE_CLEAR") {
        currentOverlay.className = "game-overlay wave-clear";
        currentOverlay.innerHTML = `
            <h1 style="color: #00ffcc; text-shadow: 0 0 20px #00ffcc; font-size: 38px;">WAVE ${wave} CLEARED</h1>
            <p style="color: #ffd54f; font-size: 18px; margin-top: 10px; font-weight: bold;">+20s SYSTEM RECOVERY BONUS</p>
            <h2 style="color: #fff; font-size: 22px; margin-top: 24px; letter-spacing: 2px;">WAVE ${wave + 1} INCOMING...</h2>
        `;
    } else if (state === "START") {
        currentOverlay.className = "game-overlay start";
        currentOverlay.innerHTML = `
            <h1>SYSTEM OVERRIDE</h1>
            <p style="margin-bottom: 20px; color: #00ffcc; font-size: 16px;">DEFEND THE SYSTEM AGAINST MALWARE INVASION</p>
            <div style="font-size: 14px; line-height: 1.8; margin-bottom: 24px; text-align: left; background: rgba(0, 255, 204, 0.08); padding: 16px 24px; border: 1px solid #00ffcc; border-radius: 6px; box-shadow: 0 0 10px rgba(0, 255, 204, 0.2);">
                <div style="color: #fff; margin-bottom: 6px;">🎮 <strong>[A / D]</strong> or <strong>[← / →]</strong> : Move Spacecraft</div>
                <div style="color: #fff; margin-bottom: 6px;">⚡ <strong>[SPACE]</strong> : Fire Anti-Malware Packets</div>
                <div style="color: #fff; margin-bottom: 6px;">⏸️ <strong>[P / ESC]</strong> : Pause / Resume System</div>
                <div style="color: #fff;">🔄 <strong>[R]</strong> : Reboot System</div>
            </div>
            <button class="menu-btn" onclick="if(window.gameInstance) window.gameInstance.startGame()">INITIALIZE DEFENSE [SPACE]</button>
        `;
    } else if (state === "PAUSED") {
        currentOverlay.className = "game-overlay paused";
        currentOverlay.innerHTML = `
            <h1>SYSTEM PAUSED</h1>
            <button class="menu-btn" onclick="if(window.gameInstance) window.gameInstance.togglePause()">Resume [P / ESC]</button>
            <button class="menu-btn" onclick="if(window.gameInstance) window.gameInstance.restart()">Restart System [R]</button>
        `;
    } else if (state === "VICTORY") {
        currentOverlay.className = "game-overlay victory";
        currentOverlay.innerHTML = `
            <h1>SYSTEM SECURED</h1>
            <p>Final Recovered: ${score}MB</p>
            <p style="font-size: 16px; color: #00ffcc; margin-top: 6px;">Reached Wave ${wave}</p>
            <button class="menu-btn" onclick="if(window.gameInstance) window.gameInstance.restart()">Restart System [R]</button>
        `;
    } else if (state === "GAME_OVER") {
        currentOverlay.className = "game-overlay game-over";
        currentOverlay.innerHTML = `
            <h1>SYSTEM COMPROMISED</h1>
            <p>Score: ${score}MB</p>
            <p style="font-size: 16px; color: #ff0055; margin-top: 6px;">Reached Wave ${wave}</p>
            <button class="menu-btn" onclick="if(window.gameInstance) window.gameInstance.restart()">Restart System [R]</button>
        `;
    }

    return currentOverlay;
}
