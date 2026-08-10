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

  const places = [
    { name: "San Francisco", region: "United States", x: 10.7, y: 28.85 },
    { name: "Los Angeles", region: "United States", x: 11.8, y: 31.34 },
    { name: "Las Vegas", region: "United States", x: 12.73, y: 29.89 },
    { name: "Chicago", region: "United States", x: 20.69, y: 25.83 },
    { name: "New York", region: "United States", x: 24.55, y: 26.53 },
    { name: "Boston", region: "United States", x: 25.42, y: 25.39 },
    { name: "Philadelphia", region: "United States", x: 24.2, y: 27.05 },
    { name: "Washington, D.C.", region: "United States", x: 23.64, y: 27.77 },
    { name: "Manchester", region: "United Kingdom", x: 45.26, y: 17.38 },
    { name: "Southampton", region: "United Kingdom", x: 45.44, y: 19.12 },
    { name: "London", region: "United Kingdom", x: 45.82, y: 18.71 },
    { name: "Vladivostok", region: "Russia", x: 83.23, y: 23.51 },
    { name: "Tokyo", region: "Japan", x: 85.27, y: 28.51 },
    { name: "Sydney", region: "Australia", x: 87.02, y: 75.63 },
    { name: "Melbourne", region: "Australia", x: 85.16, y: 78.35 },
    { name: "Yunnan", region: "China", x: 74.52, y: 35.98 },
    { name: "Beijing", region: "China", x: 78.75, y: 25.8 },
    { name: "Heilongjiang", region: "China", x: 81.76, y: 21.73 },
    { name: "Sichuan", region: "China", x: 75.03, y: 32.22 },
    { name: "Tibet", region: "China", x: 71.33, y: 32.93 },
    { name: "Shanghai", region: "China", x: 80.0, y: 31.65 },
    { name: "Suzhou", region: "China", x: 79.75, y: 31.61 },
    { name: "Hangzhou", region: "China", x: 79.6, y: 32.31, home: true },
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
      '<img src="assets/stitch-marker.png" alt="" width="40" height="40" /><span>' +
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
