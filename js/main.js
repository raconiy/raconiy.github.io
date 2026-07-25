(() => {
  const year = document.getElementById("y");
  if (year) year.textContent = String(new Date().getFullYear());

  // Scroll progress
  const bar = document.getElementById("progress");
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    if (bar) bar.style.width = `${p}%`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Soft spotlight on intro
  const intro = document.getElementById("intro");
  if (intro && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    intro.addEventListener("pointermove", (e) => {
      const r = intro.getBoundingClientRect();
      intro.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      intro.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  }

  // Rotating mood line
  const mood = document.getElementById("mood");
  const moods = [
    "thinking in photons",
    "debugging the rain",
    "spacing like a shooting guard",
    "reading the next 20 moves",
    "listening after practice",
    "RAW → world",
  ];
  let moodIdx = 0;
  if (mood) {
    window.setInterval(() => {
      moodIdx = (moodIdx + 1) % moods.length;
      mood.style.opacity = "0";
      window.setTimeout(() => {
        mood.textContent = moods[moodIdx];
        mood.style.opacity = "0.9";
      }, 220);
    }, 2800);
  }

  // Theme toggle
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  // Copy email
  const btn = document.getElementById("copy-email");
  const toast = document.getElementById("toast");
  if (btn) {
    btn.addEventListener("click", async () => {
      const email = btn.getAttribute("data-email") || "";
      try {
        await navigator.clipboard.writeText(email);
        if (toast) {
          toast.hidden = false;
          toast.classList.add("show");
          window.setTimeout(() => toast.classList.remove("show"), 1400);
        }
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  }
})();
