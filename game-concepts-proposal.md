# Game Concept Proposals

Based on the project requirements—maintaining a strict 60 FPS, using plain JS/DOM, utilizing minimal layers, and avoiding canvas/frameworks—here are two highly optimized concepts. Both fit the pre-approved genre list while bringing a fresh, engaging theme.

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

## Concept 2: "Warehouse Night Shift" (Tetris Reskin)

**The Vibe:** You are an automated forklift operator in an endless shipping warehouse. You must organize differently shaped delivery crates into the tightest possible configurations before the delivery truck leaves.

### Why it works for DOM Performance:
* **No Continuous Animation:** Tetris is strictly grid-based. Elements move in fixed, discrete steps rather than continuous pixel-by-pixel animation.
* **Zero DOM Movement:** You don't actually need to use CSS `transform` to move `<div>` tags around. You can render a static HTML grid of `<div>` cells once at startup. The game logic just updates a 2D array in JavaScript, and the rendering loop simply changes the CSS background colors or classes of those static grid cells. This is incredibly lightweight and guarantees practically zero frame drops.

### UI Integration:
* **Score:** "Packages Shipped"
* **Lives:** "Strikes (3 strikes and you're fired!)"
* **Timer:** "End of Shift Countdown"

---

## Core Technical Requirements to Remember
Regardless of which concept the team chooses, we must ensure our engine architecture adheres to the following:
1. **The Loop:** Use `requestAnimationFrame` for the main game loop to ensure we hit that required 60 FPS target.
2. **DOM Optimization:** Never animate `top`, `left`, `width`, or `height`. Only use hardware-accelerated properties like `transform` and `opacity`.
3. **Smooth Controls:** Keyboard event listeners should only update boolean states (e.g., `keys['ArrowLeft'] = true`). The actual player movement logic must happen inside the `requestAnimationFrame` loop to prevent stuttering and avoid the need to spam keys.
4. **Minimal Layers:** Keep the DOM tree as flat as possible to reduce rendering complexity and optimize performance.
