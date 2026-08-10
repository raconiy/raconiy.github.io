(() => {
  const year = document.getElementById("y");
  if (year) year.textContent = String(new Date().getFullYear());

  // Theme toggle
  const root = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const getTheme = () => root.getAttribute("data-theme") || "light";
  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (window.__travelMap) window.__travelMap.setTheme(theme);
  };
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      setTheme(getTheme() === "dark" ? "light" : "dark");
    });
  }

  // Reveal on scroll
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
  if (hero) requestAnimationFrame(() => hero.classList.add("is-visible"));

  // Active nav
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

  // Travel map
  const mapEl = document.getElementById("travel-map");
  if (!mapEl || typeof L === "undefined") return;

  const places = [
    { name: "San Francisco", region: "United States", lat: 37.7749, lng: -122.4194 },
    { name: "Los Angeles", region: "United States", lat: 34.0522, lng: -118.2437 },
    { name: "Las Vegas", region: "United States", lat: 36.1699, lng: -115.1398 },
    { name: "Chicago", region: "United States", lat: 41.8781, lng: -87.6298 },
    { name: "New York", region: "United States", lat: 40.7128, lng: -74.006 },
    { name: "Boston", region: "United States", lat: 42.3601, lng: -71.0589 },
    { name: "Philadelphia", region: "United States", lat: 39.9526, lng: -75.1652 },
    { name: "Washington, D.C.", region: "United States", lat: 38.9072, lng: -77.0369 },
    { name: "Manchester", region: "United Kingdom", lat: 53.4808, lng: -2.2426 },
    { name: "Southampton", region: "United Kingdom", lat: 50.9097, lng: -1.4044 },
    { name: "London", region: "United Kingdom", lat: 51.5074, lng: -0.1278 },
    { name: "Vladivostok", region: "Russia", lat: 43.1332, lng: 131.9113 },
    { name: "Tokyo", region: "Japan", lat: 35.6762, lng: 139.6503 },
    { name: "Sydney", region: "Australia", lat: -33.8688, lng: 151.2093 },
    { name: "Melbourne", region: "Australia", lat: -37.8136, lng: 144.9631 },
    { name: "Yunnan", region: "China", lat: 25.0389, lng: 102.7183 },
    { name: "Beijing", region: "China", lat: 39.9042, lng: 116.4074 },
    { name: "Heilongjiang", region: "China", lat: 45.8038, lng: 126.534 },
    { name: "Sichuan", region: "China", lat: 30.5728, lng: 104.0668 },
    { name: "Tibet", region: "China", lat: 29.652, lng: 91.1721 },
    { name: "Shanghai", region: "China", lat: 31.2304, lng: 121.4737 },
    { name: "Suzhou", region: "China", lat: 31.2989, lng: 120.5853 },
    { name: "Hangzhou", region: "China", lat: 30.2741, lng: 120.1551, home: true },
  ];

  const countEl = document.getElementById("place-count");
  if (countEl) countEl.textContent = String(places.length);

  const groupsEl = document.getElementById("travel-groups");
  const byRegion = places.reduce((acc, place) => {
    (acc[place.region] ||= []).push(place);
    return acc;
  }, {});

  const regionOrder = [
    "United States",
    "United Kingdom",
    "Russia",
    "Japan",
    "Australia",
    "China",
  ];

  const lightTiles = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 18,
    }
  );
  const darkTiles = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 18,
    }
  );

  const map = L.map(mapEl, {
    zoomControl: true,
    scrollWheelZoom: false,
    worldCopyJump: true,
  });

  let activeTiles = getTheme() === "dark" ? darkTiles : lightTiles;
  activeTiles.addTo(map);

  const stitchIcon = (home = false) =>
    L.divIcon({
      className: "stitch-pin",
      html: `<div class="stitch-marker${home ? " is-home" : ""}"><img src="assets/stitch-marker.png" alt="" width="44" height="44" /></div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });

  const markers = places.map((place) => {
    const marker = L.marker([place.lat, place.lng], {
      icon: stitchIcon(Boolean(place.home)),
      title: place.name,
    }).addTo(map);
    marker.bindPopup(
      `<strong>${place.name}</strong><br><span style="opacity:.75">${place.region}${place.home ? " · Home" : ""}</span>`
    );
    return { place, marker };
  });

  const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
  map.fitBounds(bounds.pad(0.22));

  const focusPlace = (placeName) => {
    const found = markers.find((m) => m.place.name === placeName);
    if (!found) return;
    map.flyTo([found.place.lat, found.place.lng], Math.max(map.getZoom(), 5), {
      duration: 0.85,
    });
    found.marker.openPopup();
    groupsEl?.querySelectorAll(".travel-chip").forEach((chip) => {
      chip.classList.toggle("is-active", chip.dataset.place === placeName);
    });
  };

  if (groupsEl) {
    regionOrder.forEach((region) => {
      const list = byRegion[region];
      if (!list) return;
      const block = document.createElement("div");
      block.className = "travel-group";
      block.innerHTML = `<h3>${region}</h3>`;
      const chips = document.createElement("div");
      chips.className = "travel-chips";
      list.forEach((place) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "travel-chip";
        chip.dataset.place = place.name;
        chip.textContent = place.home ? `${place.name} · Home` : place.name;
        chip.addEventListener("click", () => focusPlace(place.name));
        chips.appendChild(chip);
      });
      block.appendChild(chips);
      groupsEl.appendChild(block);
    });
  }

  // Enable wheel zoom after first interaction
  map.once("click", () => map.scrollWheelZoom.enable());

  window.__travelMap = {
    setTheme(theme) {
      map.removeLayer(activeTiles);
      activeTiles = theme === "dark" ? darkTiles : lightTiles;
      activeTiles.addTo(map);
    },
  };

  // Fix tile sizing after reveal animation / layout
  const invalidate = () => map.invalidateSize();
  setTimeout(invalidate, 120);
  window.addEventListener("resize", invalidate);
  const travelSection = document.getElementById("travel");
  if (travelSection && "IntersectionObserver" in window) {
    const mapIO = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        invalidate();
        mapIO.disconnect();
      }
    });
    mapIO.observe(travelSection);
  }
})();
