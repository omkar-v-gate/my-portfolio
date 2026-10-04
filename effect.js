(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // ============ SCROLL PROGRESS BAR ============
    const bar = document.createElement("div");
    bar.className = "progress";
    document.body.appendChild(bar);

    const updateProgress = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    // ============ MARK FINISHED REVEALS (restores snappy hover) ============
    document.addEventListener("transitionend", e => {
        if (e.propertyName === "opacity" && e.target.classList?.contains("in")) {
            e.target.classList.add("done");
        }
    });

    // ============ SKILLS: stagger by column so each row cascades ============
    document.querySelectorAll(".skill-box").forEach((box, i) => {
        box.style.transitionDelay = `${(i % 2) * 110}ms`;
    });

    if (reduceMotion || !canHover) return;   // remaining effects are mouse-only

    // ============ SPOTLIGHT + 3D TILT ON CARDS ============
    document.querySelectorAll(".timeline-card, .achievement-card, .skill-box, .contact-item")
        .forEach(card => card.classList.add("spot"));

    document.querySelectorAll(".achievement-card, .skill-box, .contact-item").forEach(card => {
        card.classList.add("tilt");
        const strength = card.classList.contains("skill-box") ? 4 : 6;

        card.addEventListener("mousemove", e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            card.style.setProperty("--mx", `${x * 100}%`);
            card.style.setProperty("--my", `${y * 100}%`);
            card.style.setProperty("--rx", `${(0.5 - y) * strength}deg`);
            card.style.setProperty("--ry", `${(x - 0.5) * strength * 1.3}deg`);
        });

        card.addEventListener("mouseleave", () => {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
        });
    });

    // timeline cards: spotlight only (no tilt, they hold more text)
    document.querySelectorAll(".timeline-card").forEach(card => {
        card.addEventListener("mousemove", e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
            card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
        });
    });

    // ============ MAGNETIC BUTTONS ============
    document.querySelectorAll(".btn, .social-links a, .footer-social a").forEach(el => {
        el.addEventListener("mousemove", e => {
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            el.style.setProperty("--tx", `${dx * 0.22}px`);
            el.style.setProperty("--ty", `${dy * 0.22}px`);
        });
        el.addEventListener("mouseleave", () => {
            el.style.setProperty("--tx", "0px");
            el.style.setProperty("--ty", "0px");
        });
    });

    // ============ HERO PHOTO PARALLAX ============
    const hero = document.querySelector(".home");
    if (hero) {
        hero.addEventListener("mousemove", e => {
            const r = hero.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            hero.style.setProperty("--px", `${x * -18}px`);
            hero.style.setProperty("--py", `${y * -14}px`);
        });
        hero.addEventListener("mouseleave", () => {
            hero.style.setProperty("--px", "0px");
            hero.style.setProperty("--py", "0px");
        });
    }
})();