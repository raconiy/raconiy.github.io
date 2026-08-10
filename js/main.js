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
    { name: "San Francisco", region: "United States" },
    { name: "Los Angeles", region: "United States" },
    { name: "Las Vegas", region: "United States" },
    { name: "Chicago", region: "United States" },
    { name: "New York", region: "United States" },
    { name: "Boston", region: "United States" },
    { name: "Philadelphia", region: "United States" },
    { name: "Washington, D.C.", region: "United States" },
    { name: "Manchester", region: "United Kingdom" },
    { name: "Southampton", region: "United Kingdom" },
    { name: "London", region: "United Kingdom" },
    { name: "Vladivostok", region: "Russia" },
    { name: "Tokyo", region: "Japan" },
    { name: "Sydney", region: "Australia" },
    { name: "Melbourne", region: "Australia" },
    { name: "Yunnan", region: "China" },
    { name: "Beijing", region: "China" },
    { name: "Heilongjiang", region: "China" },
    { name: "Sichuan", region: "China" },
    { name: "Tibet", region: "China" },
    { name: "Shanghai", region: "China" },
    { name: "Suzhou", region: "China" },
    { name: "Hangzhou", region: "China", home: true },
  ];

  const countEl = document.getElementById("place-count");
  if (countEl) countEl.textContent = String(places.length);

  const groupsEl = document.getElementById("travel-groups");
  if (!groupsEl) return;

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
      chip.addEventListener("click", () => {
        Array.prototype.forEach.call(
          groupsEl.querySelectorAll(".travel-chip"),
          (el) => el.classList.toggle("is-active", el === chip)
        );
      });
      chips.appendChild(chip);
    });
    block.appendChild(chips);
    groupsEl.appendChild(block);
  });
})();
