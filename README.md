# System Override (Space Invaders DOM Engine)

Welcome to the repository for **System Override**, our high-performance, vanilla JavaScript, DOM-based game. 

This project is built from scratch without any external rendering frameworks or `<canvas>`, targeting a continuous **60 FPS** on modern browsers.

---

## 🚀 Quick Start & Rules

To ensure everyone on the team is aligned, please read our master development guide:
👉 **[Git Workflow and Team Development Rules](git-workflow-rules.md)**

### Key Rules to Remember:
1. **Never commit directly to `main`.** Always work on a feature branch (`feature/your-task`) and merge via a Pull Request.
2. **Smooth Controls:** Do not read keystrokes directly for continuous actions. Modify boolean states and update movement in the `requestAnimationFrame` loop.
3. **No Canvas or Frameworks:** Use plain HTML elements styled with performance-optimized CSS (`transform` and `opacity` only).
4. **No `file://` protocol:** Run a local HTTP server (such as Live Server in VS Code or `python3 -m http.server`) when testing.

---

## 📋 Team Work Breakdown Structure (WBS)

Refer to the **[WBS Section of the Git Workflow Rules](git-workflow-rules.md#3-work-breakdown-structure-system-override-concept)** to find your assignment:

*   **Developer A:** Task 1.1 (Project Init & Pipeline) & Task 4.1 (HUD & Scoring)
*   **Developer B:** Task 1.2 (Game Loop & Inputs) & Task 4.2 (Game States & Pause Overlay)
*   **Developer C:** Task 2.1 (Player Spacecraft) & Task 4.2 (Game States & Pause Overlay)
*   **Developer D:** Task 2.2 (Enemy Malware Grid & Pooling)
*   **Developer E:** Task 3.1 (Projectiles & Collisions)

---

## 🛠️ Project Requirements

Our constraints and objectives are fully detailed in the official assignment document:
👉 **[Assignment Details (make-your-game.md)](make-your-game.md)**
