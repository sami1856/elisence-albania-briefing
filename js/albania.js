(() => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  const header = document.querySelector(".site-header");
  const navItems = document.querySelectorAll("[data-nav-item]");

  const setOpen = (open) => {
    if (!toggle || !nav) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 900px)").matches) {
          setOpen(false);
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (!window.matchMedia("(max-width: 900px)").matches) return;
      if (header && header.contains(event.target)) return;
      setOpen(false);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });

    window.addEventListener("resize", () => {
      if (!window.matchMedia("(max-width: 900px)").matches) {
        setOpen(false);
      }
    });
  }

  // Lightweight active-state handoff for future sections (no scrollspy).
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((other) => {
        other.classList.remove("is-active");
        other.removeAttribute("aria-current");
      });
      item.classList.add("is-active");
      item.setAttribute("aria-current", "page");
    });
  });

  // Safe handling for future anchors that do not yet exist as full sections.
  document.querySelectorAll('[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") {
        event.preventDefault();
        return;
      }

      const target = document.querySelector(id);
      if (!target) {
        event.preventDefault();
      }
    });
  });

  // One-time section entrance for Founder Note + Manifesto Block 03.
  // Tall manifesto must use a near-zero threshold: 0.18 of a multi-viewport
  // section can never fit, which left all panels stuck at opacity:0.
  const revealNodes = document.querySelectorAll("[data-reveal]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const reveal = (node) => node.classList.add("is-visible");

    const shortObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    const tallObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -6% 0px" }
    );

    revealNodes.forEach((node) => {
      if (node.classList.contains("manifesto") || node.classList.contains("albania-manifesto")) {
        tallObserver.observe(node);
      } else {
        shortObserver.observe(node);
      }
    });
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }
})();
