(() => {
  const year = document.getElementById("y");
  if (year) year.textContent = String(new Date().getFullYear());

  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const getTheme = () => root.getAttribute("data-theme") || "light";
  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      setTheme(getTheme() === "dark" ? "light" : "dark");
    });
  }

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
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.05, 0.2)}s`;
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const hero = document.querySelector(".hero");
  if (hero) requestAnimationFrame(() => hero.classList.add("is-visible"));

  const navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-links a[href^="#"]')
  );
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

  const toTop = document.querySelector(".to-top");
  if (toTop) {
    const onScroll = () => {
      toTop.classList.toggle("is-visible", window.scrollY > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Positions calibrated to assets/world-*.svg (viewBox 950x620)
  const places = [
    { name: "San Francisco", region: "United States", x: 15.3, y: 33.5 },
    { name: "Los Angeles", region: "United States", x: 16.4, y: 35.5 },
    { name: "Las Vegas", region: "United States", x: 17.3, y: 34.3 },
    { name: "Chicago", region: "United States", x: 24.6, y: 31.4 },
    { name: "New York", region: "United States", x: 28.3, y: 32.0 },
    { name: "Boston", region: "United States", x: 29.0, y: 31.1 },
    { name: "Philadelphia", region: "United States", x: 27.9, y: 32.4 },
    { name: "Washington, D.C.", region: "United States", x: 27.4, y: 33.0 },
    { name: "Manchester", region: "United Kingdom", x: 47.4, y: 25.4 },
    { name: "Southampton", region: "United Kingdom", x: 47.7, y: 26.8 },
    { name: "London", region: "United Kingdom", x: 48.0, y: 26.4 },
    { name: "Vladivostok", region: "Russia", x: 83.5, y: 29.8 },
    { name: "Tokyo", region: "Japan", x: 85.9, y: 32.3 },
    { name: "Sydney", region: "Australia", x: 91.0, y: 73.6 },
    { name: "Melbourne", region: "Australia", x: 89.1, y: 75.7 },
    { name: "Yunnan", region: "China", x: 75.4, y: 40.7 },
    { name: "Beijing", region: "China", x: 79.1, y: 32.8 },
    { name: "Heilongjiang", region: "China", x: 81.8, y: 29.7 },
    { name: "Sichuan", region: "China", x: 75.8, y: 37.7 },
    { name: "Tibet", region: "China", x: 72.3, y: 38.2 },
    { name: "Shanghai", region: "China", x: 80.8, y: 36.8 },
    { name: "Suzhou", region: "China", x: 80.5, y: 36.9 },
    { name: "Hangzhou", region: "China", x: 80.3, y: 37.6, home: true },
  ];

  const countEl = document.getElementById("place-count");
  if (countEl) countEl.textContent = String(places.length);

  const pinsEl = document.getElementById("travel-pins");
  const groupsEl = document.getElementById("travel-groups");
  if (!pinsEl || !groupsEl) return;

  const regionOrder = [
    "United States",
    "United Kingdom",
    "Russia",
    "Japan",
    "Australia",
    "China",
  ];

  const byRegion = {};
  places.forEach((place) => {
    if (!byRegion[place.region]) byRegion[place.region] = [];
    byRegion[place.region].push(place);
  });

  const pinNodes = {};

  const focusPlace = (placeName) => {
    Object.keys(pinNodes).forEach((name) => {
      const btn = pinNodes[name];
      const active = name === placeName;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    Array.prototype.forEach.call(
      groupsEl.querySelectorAll(".travel-chip"),
      (chip) => {
        chip.classList.toggle("is-active", chip.getAttribute("data-place") === placeName);
      }
    );
  };

  places.forEach((place, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = place.home ? "travel-pin is-home" : "travel-pin";
    btn.style.left = place.x + "%";
    btn.style.top = place.y + "%";
    btn.style.setProperty("--delay", Math.min(index * 0.03, 0.45) + "s");
    btn.title = place.name;
    btn.setAttribute("aria-label", place.name + ", " + place.region);
    btn.innerHTML =
      '<img src="assets/stitch-marker.png" alt="" width="18" height="18" /><span>' +
      place.name +
      "</span>";
    btn.addEventListener("click", () => focusPlace(place.name));
    pinsEl.appendChild(btn);
    pinNodes[place.name] = btn;
  });

  regionOrder.forEach((region) => {
    const list = byRegion[region];
    if (!list) return;
    const block = document.createElement("div");
    block.className = "travel-group";
    const title = document.createElement("h3");
    title.textContent = region;
    block.appendChild(title);
    const chips = document.createElement("div");
    chips.className = "travel-chips";
    list.forEach((place) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "travel-chip";
      chip.setAttribute("data-place", place.name);
      chip.textContent = place.home ? place.name + " · Home" : place.name;
      chip.addEventListener("click", () => focusPlace(place.name));
      chips.appendChild(chip);
    });
    block.appendChild(chips);
    groupsEl.appendChild(block);
  });
})();
