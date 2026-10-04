const menuBtn = document.getElementById("menuBtn");
const navbar = document.querySelector(".navbar");

// ============ MOBILE MENU ============
menuBtn.addEventListener("click", () => {
    const open = navbar.classList.toggle("show");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.firstElementChild.className = open ? "bi bi-x-lg" : "bi bi-list";
});

navbar.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", () => {
        navbar.classList.remove("show");
        menuBtn.firstElementChild.className = "bi bi-list";
    })
);

// ============ HEADER SHADOW + BACK TO TOP ============
const header = document.querySelector(".header");
const toTop = document.createElement("button");
toTop.className = "to-top";
toTop.setAttribute("aria-label", "Back to top");
toTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.body.appendChild(toTop);

window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
    toTop.classList.toggle("visible", window.scrollY > 500);
}, { passive: true });

// ============ SCROLL REVEAL (runs once per element) ============
const revealTargets = document.querySelectorAll(
    ".section-heading, .timeline-card, .achievement-card, .skill-box, .contact-item"
);

const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
    });
}, { threshold: 0.12 });

revealTargets.forEach(el => {
    el.classList.add("reveal");
    // small stagger for items inside the same grid
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains("reveal") || revealTargets.length);
    const i = siblings.indexOf(el) % 3;
    el.style.transitionDelay = `${i * 80}ms`;
    revealObserver.observe(el);
});

// clear the delay after reveal so hover isn't sluggish
document.addEventListener("transitionend", e => {
    if (e.target.classList?.contains("in")) e.target.style.transitionDelay = "0ms";
});

// ============ ACTIVE NAV LINK (scroll-spy) ============
const navLinks = [...document.querySelectorAll(".navbar a[href^='#']")];

const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(l =>
            l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
        );
    });
}, { rootMargin: "-40% 0px -55% 0px" });

navLinks.forEach(l => {
    const sec = document.querySelector(l.getAttribute("href"));
    if (sec) spy.observe(sec);
});