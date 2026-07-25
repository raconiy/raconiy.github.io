(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Hero load: reveal immediately for above-the-fold copy
  document.querySelectorAll(".hero [data-reveal], .site-header").forEach((el) => {
    requestAnimationFrame(() => el.classList.add("is-visible"));
  });

  // Subtle parallax on hero image
  const media = document.querySelector("[data-parallax] img");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (media && !reduce) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const offset = Math.min(y * 0.18, 120);
        media.style.transform = `scale(1.06) translate3d(0, ${offset}px, 0)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
