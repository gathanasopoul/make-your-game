
## Concept 1: "System Override" (Space Invaders Reskin)

**The Vibe:** A cyberpunk/hacker aesthetic. You play as a localized firewall program at the bottom of the screen. Your goal is to shoot packets of data upwards to intercept and destroy descending waves of malware, trojans, and computer viruses.

### Why it works for DOM Performance:
* **Predictable Movement:** Space Invaders is very structured. Instead of animating 50 individual enemy `<div>` tags (which could cause layout thrashing and jank), we can group all the "malware" into a single parent container. We then animate that single container left and right using `transform: translateX()`. 
* **Object Pooling:** Bullets and enemies can be pre-rendered and toggled using `opacity` or `visibility: hidden` instead of adding/removing elements from the DOM dynamically. This keeps garbage collection low and prevents frame drops.

### UI Integration:
* **Score:** "Megabytes Recovered"
* **Lives:** "System Integrity Level"
* **Timer:** "Time until Total System Failure"

---
---

## Core Technical Requirements to Remember
Regardless of which concept the team chooses, we must ensure our engine architecture adheres to the following:
1. **The Loop:** Use `requestAnimationFrame` for the main game loop to ensure we hit that required 60 FPS target.
2. **DOM Optimization:** Never animate `top`, `left`, `width`, or `height`. Only use hardware-accelerated properties like `transform` and `opacity`.
3. **Smooth Controls:** Keyboard event listeners should only update boolean states (e.g., `keys['ArrowLeft'] = true`). The actual player movement logic must happen inside the `requestAnimationFrame` loop to prevent stuttering and avoid the need to spam keys.
4. **Minimal Layers:** Keep the DOM tree as flat as possible to reduce rendering complexity and optimize performance.
