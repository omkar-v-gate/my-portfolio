// theme.js : makes the soft glow follow your mouse smoothly

// Skip on phones (no mouse) and when the visitor turned animations off
const wantsMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasRealMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (wantsMotion && hasRealMouse) {

    // 1. Create the glow element (styled in theme.css as ".cursor-glow")
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    // 2. Where the mouse IS (targetX/Y) and where the glow currently IS (x/y)
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;

    // 3. When the mouse moves, remember its position and show the glow
    window.addEventListener("mousemove", event => {
        targetX = event.clientX;
        targetY = event.clientY;
        glow.style.opacity = 1;
    });

    // 4. When the mouse leaves the window, fade the glow out
    document.addEventListener("mouseleave", () => {
        glow.style.opacity = 0;
    });

    // 5. Every frame, move the glow 12% of the way toward the mouse.
    //    This gives the smooth "trailing" feeling instead of a sudden jump.
    function follow() {
        x += (targetX - x) * 0.12;
        y += (targetY - y) * 0.12;
        glow.style.transform = "translate(" + x + "px, " + y + "px)";
        requestAnimationFrame(follow);
    }
    follow();
}