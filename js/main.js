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
    { name: "San Francisco", region: "United States", photo: "sf" },
    { name: "Los Angeles", region: "United States", photo: "la" },
    { name: "Las Vegas", region: "United States", photo: "vegas" },
    { name: "Chicago", region: "United States", photo: "chicago" },
    { name: "New York", region: "United States", photo: "nyc" },
    { name: "Boston", region: "United States", photo: "boston" },
    { name: "Philadelphia", region: "United States", photo: "philly" },
    { name: "Washington, D.C.", region: "United States", photo: "dc" },
    { name: "Manchester", region: "United Kingdom", photo: "manchester" },
    { name: "Southampton", region: "United Kingdom", photo: "southampton" },
    { name: "London", region: "United Kingdom", photo: "london" },
    { name: "Vladivostok", region: "Russia", photo: "vladivostok" },
    { name: "Tokyo", region: "Japan", photo: "tokyo" },
    { name: "Sydney", region: "Australia", photo: "sydney" },
    { name: "Melbourne", region: "Australia", photo: "melbourne" },
    { name: "Yunnan", region: "China", photo: "yunnan" },
    { name: "Beijing", region: "China", photo: "beijing" },
    { name: "Heilongjiang", region: "China", photo: "heilongjiang" },
    { name: "Sichuan", region: "China", photo: "sichuan" },
    { name: "Tibet", region: "China", photo: "tibet" },
    { name: "Shanghai", region: "China", photo: "shanghai" },
    { name: "Suzhou", region: "China", photo: "suzhou" },
    { name: "Hangzhou", region: "China", photo: "hangzhou", home: true },
  ];

  const countEl = document.getElementById("place-count");
  if (countEl) countEl.textContent = String(places.length);

  const groupsEl = document.getElementById("travel-groups");
  const photoEl = document.getElementById("city-photo");
  const nameEl = document.getElementById("city-name");
  const regionEl = document.getElementById("city-region");
  if (!groupsEl) return;

  const showCity = (place) => {
    if (photoEl) {
      photoEl.src = "assets/cities/" + place.photo + ".jpg";
      photoEl.alt = place.name;
    }
    if (nameEl) nameEl.textContent = place.name;
    if (regionEl) {
      regionEl.textContent = place.home
        ? place.region + " · Home"
        : place.region;
    }
    Array.prototype.forEach.call(
      groupsEl.querySelectorAll(".travel-chip"),
      (el) => {
        el.classList.toggle(
          "is-active",
          el.getAttribute("data-place") === place.name
        );
      }
    );
  };

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
      chip.addEventListener("click", () => showCity(place));
      chips.appendChild(chip);
    });
    block.appendChild(chips);
    groupsEl.appendChild(block);
  });

  const home = places.find((p) => p.home) || places[0];
  showCity(home);
})();
