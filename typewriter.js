/* =========================================================
   typewriter.js  -  SELF-CONTAINED typewriter effect

   Needs NO other CSS or JS file. It adds its own styles.
   Add ONE line at the very bottom of index.html:
       <script src="typewriter.js"></script>

   1. HERO: "Hello, I'm" -> name -> photo -> title -> description -> "I build ..."
   2. TITLES: section headings, column titles and contact boxes type
      themselves when you scroll to them.
========================================================= */
(function () {
    "use strict";

    // true  = titles type AGAIN every time you scroll back to them
    // false = titles type only the first time
    var REPLAY_ON_SCROLL = true;

    if (window.__typewriterLoaded) return;      // protects against loading the file twice
    window.__typewriterLoaded = true;

    console.log("typewriter.js is running");     // you can delete this line later


    /* ---------------------------------------------------------
       1. STYLES (added to the page by this file)
       t-ch = one letter. It starts hidden, and the animation
       "twShow" makes it visible after its own delay (--d).
       The animation only runs while the parent has class "tw-go".
    --------------------------------------------------------- */
    var style = document.createElement("style");
    style.textContent =
        "t-ch{opacity:0}" +
        ".tw-go t-ch{animation:twShow .01s linear var(--d,0s) forwards}" +
        "@keyframes twShow{from{opacity:0}to{opacity:1}}" +
        ".typed-line{min-height:1.8em;margin-bottom:18px;color:var(--text-mute,#90a0c4);font-size:clamp(16px,2vw,20px)}" +
        ".typed-word{color:var(--accent,#5b8cff);font-weight:600}" +
        ".typed-cursor{display:inline-block;width:2px;height:1.1em;margin-left:3px;" +
            "background:var(--accent,#5b8cff);vertical-align:-.2em;animation:twBlink 1s steps(1) infinite}" +
        "@keyframes twBlink{50%{opacity:0}}";
    document.head.appendChild(style);


    /* ---------------------------------------------------------
       2. HELPER: turn the text inside an element into letters
       state.t    = the time (in seconds) the NEXT letter will appear
       state.step = seconds between two letters
    --------------------------------------------------------- */
    function split(node, state) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {

            if (child.nodeType === 3) {                              // plain text
                var text = child.textContent.replace(/\s+/g, " ");   // tidy spaces/new lines
                var frag = document.createDocumentFragment();

                Array.from(text).forEach(function (ch) {
                    var s = document.createElement("t-ch");
                    s.textContent = ch;
                    s.setAttribute("aria-hidden", "true");
                    if (ch !== " ") {
                        s.style.setProperty("--d", state.t.toFixed(3) + "s");
                        state.t += state.step;
                    }
                    frag.appendChild(s);
                });

                child.parentNode.replaceChild(frag, child);

            } else if (child.nodeType === 1) {                       // an element inside (like the | )
                split(child, state);
            }
        });
    }

    // prepare one element (only once)
    function prepare(el, state) {
        if (!el || el.getAttribute("data-tw")) return false;
        el.setAttribute("data-tw", "1");
        el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
        split(el, state);
        return true;
    }


    /* ---------------------------------------------------------
       3. HERO: lines type one after another when the page loads
    --------------------------------------------------------- */
    function runHero() {
        var lines = [
            [".home-content .intro", 0.05],
            [".home-content h1", 0.05],
            [".home-content h2", 0.05],
            [".home-content .home-description", 0.018]
        ];

        var state = { t: 0.3, step: 0.05 };
        var prepared = [];
        var nameDone = 0;                            // moment when the name finishes typing

        lines.forEach(function (item) {
            var el = document.querySelector(item[0]);
            state.step = item[1];
            if (prepare(el, state)) prepared.push(el);
            if (item[0] === ".home-content h1") nameDone = state.t;
            state.t += 0.25;                         // short pause between lines
        });

        // the photo appears right AFTER your name has been typed
        var photo = document.querySelector(".home-image");
        if (photo) photo.style.animationDelay = (nameDone + 0.2) + "s";

        // start the animation on all hero lines
        prepared.forEach(function (el) { el.classList.add("tw-go"); });

        var heroDone = state.t;                      // moment when the hero typing ends

        // buttons and social icons fade in after the typing
        var buttons = document.querySelector(".home-buttons");
        var social = document.querySelector(".social-links");
        if (buttons) buttons.style.animationDelay = (heroDone + 0.3) + "s";
        if (social) social.style.animationDelay = (heroDone + 0.7) + "s";

        // the "I build ..." line goes right below the description
        var desc = document.querySelector(".home-content .home-description");
        if (!desc || document.querySelector(".typed-line")) return;

        var line = document.createElement("p");
        line.className = "typed-line";
        line.innerHTML = 'I build <span class="typed-word"></span><span class="typed-cursor"></span>';
        line.style.animationDelay = (heroDone + 0.1) + "s";
        desc.parentNode.insertBefore(line, desc.nextSibling);

        var word = line.querySelector(".typed-word");
        var phrases = [
            "scalable web applications",
            "clean REST APIs",
            "responsive user interfaces",
            "reliable software"
        ];

        var p = 0, c = 0, deleting = false;

        function tick() {
            var full = phrases[p];
            c += deleting ? -1 : 1;
            word.textContent = full.slice(0, c);

            var wait = deleting ? 35 : 70;
            if (!deleting && c === full.length) { wait = 1600; deleting = true; }
            else if (deleting && c === 0) { deleting = false; p = (p + 1) % phrases.length; wait = 400; }

            setTimeout(tick, wait);
        }

        setTimeout(tick, (heroDone + 0.5) * 1000);
    }


    /* ---------------------------------------------------------
       4. TITLES: type when they scroll into view
       We simply check the position of every title box each time
       the page scrolls (no special browser features needed).
    --------------------------------------------------------- */
    var boxes = [];                                  // all title boxes we watch

    // box = the area we watch, parts = the texts inside it, step = seconds per letter
    function group(box, parts, step) {
        var state = { t: 0.2, step: step };

        parts.forEach(function (el) {
            if (prepare(el, state)) state.t += 0.15;       // pause between parts
        });

        boxes.push(box);
    }

    // runs on every scroll: starts (or restarts) typing for boxes on the screen
    function checkBoxes() {
        var vh = window.innerHeight || document.documentElement.clientHeight;

        boxes.forEach(function (box) {
            var r = box.getBoundingClientRect();
            var visible = r.top < vh * 0.88 && r.bottom > vh * 0.05;   // inside the screen
            var offscreen = r.bottom < 0 || r.top > vh;                 // completely outside

            if (visible && !box.classList.contains("tw-go")) {
                box.classList.add("tw-go");                              // start typing
            } else if (REPLAY_ON_SCROLL && offscreen && box.classList.contains("tw-go")) {
                box.classList.remove("tw-go");                           // reset, ready to type again
            }
        });
    }

    function runTitles() {
        // Section headings: small title first, then big title
        document.querySelectorAll(".section-heading").forEach(function (box) {
            group(box, [box.querySelector("p"), box.querySelector("h2")], 0.04);
        });

        // Education / Experience column titles
        // These titles are "display:flex; gap:10px" in style.css, which would put a
        // 10px gap between EVERY letter. So we first put the text inside ONE wrapper.
        document.querySelectorAll(".column-title").forEach(function (title) {
            var wrapper = document.createElement("span");
            wrapper.className = "tw-wrap";
            Array.prototype.slice.call(title.childNodes).forEach(function (n) {
                if (n.nodeType === 3 && n.textContent.trim()) wrapper.appendChild(n);
            });
            title.appendChild(wrapper);
            group(title, [wrapper], 0.05);
        });

        // Contact boxes: name first, then link text
        document.querySelectorAll(".contact-item").forEach(function (box) {
            group(box, [box.querySelector("h3"), box.querySelector("a")], 0.04);
        });

        window.addEventListener("scroll", checkBoxes, { passive: true });
        window.addEventListener("resize", checkBoxes);
        checkBoxes();                                // also check once right now

        console.log("typewriter.js: " + boxes.length + " titles are ready");
    }


    /* ---------------------------------------------------------
       5. START  (each part is protected, so one problem
          can never stop the other part from working)
    --------------------------------------------------------- */
    function start() {
        try { runHero(); }   catch (e) { console.error("typewriter hero error:", e); }
        try { runTitles(); } catch (e) { console.error("typewriter titles error:", e); }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();