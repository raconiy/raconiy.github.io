(() => {
  const year = document.getElementById("y");
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
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.05, 0.2)}s`;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const hero = document.querySelector(".hero");
  if (hero) {
    requestAnimationFrame(() => hero.classList.add("is-visible"));
  }

  // Active nav highlight while scrolling
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (navLinks.length && sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  // Back to top
  const toTop = document.querySelector(".to-top");
  if (toTop) {
    const onScroll = () => {
      toTop.classList.toggle("is-visible", window.scrollY > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Visitor map (whos.amung.us — same stack as many academic homepages)
  const mapHost = document.getElementById("visitor-map");
  if (mapHost) {
    const width = Math.max(280, Math.min(880, mapHost.clientWidth || 680));
    const height = Math.round(width / 2);
    const holder = document.createElement("div");
    holder.id = "raconiy-map";
    mapHost.appendChild(holder);
    window._wau = window._wau || [];
    window._wau.push([
      "map",
      "raconiy",
      "raconiy-map",
      String(width),
      String(height),
      "natural",
      "star-blue",
    ]);
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://waust.at/m.js";
    document.body.appendChild(script);
  }

  // Pageview counter
  const countEl = document.getElementById("visitor-count");
  if (countEl) {
    const COUNTER_URL =
      "https://api.counterapi.dev/v1/raconiy-github-io/homepage-visits/up";

    const extractCount = (payload) => {
      const candidates = [
        payload?.count,
        payload?.value,
        payload?.data?.count,
        payload?.data?.value,
        payload?.data,
      ];
      for (const candidate of candidates) {
        const value = Number(candidate);
        if (Number.isFinite(value)) return Math.max(0, Math.trunc(value));
      }
      return null;
    };

    fetch(COUNTER_URL, { cache: "no-store", mode: "cors" })
      .then((res) => {
        if (!res.ok) throw new Error(`counter ${res.status}`);
        return res.json();
      })
      .then((payload) => {
        const value = extractCount(payload);
        if (value == null) throw new Error("bad counter payload");
        countEl.classList.remove("is-loading");
        countEl.textContent = `${value.toLocaleString("en-US")} pageviews`;
      })
      .catch(() => {
        countEl.classList.remove("is-loading");
        countEl.textContent = "Visitor map is live";
      });
  }
})();
