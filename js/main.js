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
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      intro.style.setProperty("--mx", `${x}%`);
      intro.style.setProperty("--my", `${y}%`);
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
          window.setTimeout(() => {
            toast.classList.remove("show");
          }, 1400);
        }
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  }
})();
