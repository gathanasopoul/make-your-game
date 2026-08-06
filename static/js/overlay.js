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

    const stateKey = `${state}_${wave}_${score}`;
    if (currentOverlay.dataset && currentOverlay.dataset.renderedState === stateKey) {
        return currentOverlay;
    }
    if (!currentOverlay.dataset) {
        currentOverlay.dataset = {};
    }
    currentOverlay.dataset.renderedState = stateKey;

    if (state === "WAVE_CLEAR") {
        currentOverlay.className = "game-overlay wave-clear";
        currentOverlay.innerHTML = `
            <h1 class="overlay-title">WAVE ${wave} CLEARED</h1>
            <p class="overlay-subtitle" style="color: #34d399; font-weight: 600;">+1 ANTIVIRUS SHIELD RECOVERED</p>
            <div style="font-family: 'Orbitron', sans-serif; font-size: 18px; color: #38bdf8; letter-spacing: 1.5px; margin-top: 16px; font-weight: 700;">
                WAVE ${wave + 1} INCOMING...
            </div>
        `;
    } else if (state === "START") {
        currentOverlay.className = "game-overlay start";
        currentOverlay.innerHTML = `
            <h1 class="overlay-title">SYSTEM OVERRIDE</h1>
            <p class="overlay-subtitle">DEFEND THE SYSTEM AGAINST MALWARE INVASION</p>
            
            <div class="controls-card">
                <div class="control-row">
                    <span>Move Spacecraft</span>
                    <div class="key-group">
                        <span class="key-badge">A</span> / <span class="key-badge">D</span> or <span class="key-badge">←</span> / <span class="key-badge">→</span>
                    </div>
                </div>
                <div class="control-row">
                    <span>Fire Anti-Malware</span>
                    <div class="key-group">
                        <span class="key-badge">SPACE</span>
                    </div>
                </div>
                <div class="control-row">
                    <span>Pause System</span>
                    <div class="key-group">
                        <span class="key-badge">P</span> / <span class="key-badge">ESC</span>
                    </div>
                </div>
                <div class="control-row">
                    <span>Reboot System</span>
                    <div class="key-group">
                        <span class="key-badge">R</span>
                    </div>
                </div>
            </div>

            <button class="menu-btn menu-btn-primary" onclick="if(window.gameInstance) window.gameInstance.startGame()">
                INITIALIZE DEFENSE [SPACE]
            </button>
        `;
    } else if (state === "PAUSED") {
        currentOverlay.className = "game-overlay paused";
        currentOverlay.innerHTML = `
            <h1 class="overlay-title">SYSTEM PAUSED</h1>
            <p class="overlay-subtitle">TACTICAL BREAK IN PROGRESS</p>
            <button class="menu-btn menu-btn-primary" onclick="if(window.gameInstance) window.gameInstance.togglePause()">Resume [P / ESC]</button>
            <button class="menu-btn" onclick="if(window.gameInstance) window.gameInstance.restart()">Restart System [R]</button>
        `;
    } else if (state === "VICTORY") {
        currentOverlay.className = "game-overlay victory";
        currentOverlay.innerHTML = `
            <h1 class="overlay-title">SYSTEM SECURED</h1>
            <p class="overlay-subtitle">Recovered: <strong>${score} MB</strong></p>
            <div style="font-size: 15px; color: #34d399; margin-bottom: 20px; font-weight: 600;">Reached Wave ${wave}</div>
            <button class="menu-btn menu-btn-primary" onclick="if(window.gameInstance) window.gameInstance.restart()">Restart System [R]</button>
        `;
    } else if (state === "GAME_OVER") {
        currentOverlay.className = "game-overlay game-over";
        currentOverlay.innerHTML = `
            <h1 class="overlay-title">SYSTEM COMPROMISED</h1>
            <p class="overlay-subtitle">Data Recovered: <strong>${score} MB</strong></p>
            <div style="font-size: 15px; color: #f43f5e; margin-bottom: 20px; font-weight: 600;">Reached Wave ${wave}</div>
            <button class="menu-btn menu-btn-primary" onclick="if(window.gameInstance) window.gameInstance.restart()">Restart System [R]</button>
        `;
    }

    return currentOverlay;
}
