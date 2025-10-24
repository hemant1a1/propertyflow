import { createIcons, icons } from 'https://unpkg.com/lucide@0.263.0/dist/esm/lucide.js';
import * as Alpine from 'https://unpkg.com/alpinejs@3.x.x/dist/module.esm.js';
import * as persist from 'https://unpkg.com/@alpinejs/persist@3.x.x/dist/module.esm.js';

// Initialize Alpine.js with persist plugin
Alpine.default.plugin(persist.default);
Alpine.default.start();

document.addEventListener("DOMContentLoaded", async () => {
  const preloader = document.getElementById("preloader");
  document.body.classList.add("opacity-0", "transition-opacity", "duration-300");

  // ✅ Update footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ✅ Load partials
  const includes = document.querySelectorAll("[data-include]");
  const loadPartial = async (el) => {
    const src = el.getAttribute("data-include");
    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(res.statusText);
      el.innerHTML = await res.text();
    } catch (err) {
      el.innerHTML = `<div class="text-red-500 text-sm p-2">Include failed: ${src}</div>`;
      console.error(`Failed to load partial: ${src}`, err);
    }
  };

  await Promise.all(Array.from(includes).map(loadPartial));

  // ✅ Initialize all Lucide icons once after partials are loaded
  createIcons({ icons });

  // ✅ Hide preloader smoothly
  if (preloader) {
    preloader.classList.add("opacity-0");
    preloader.classList.add("pointer-events-none");

    // Remove preloader after transition ends
    preloader.addEventListener("transitionend", () => preloader.remove(), { once: true });
  }

  // ✅ Fade in main content
  requestAnimationFrame(() => {
    document.body.classList.remove("opacity-0");
  });

  // ✅ Fire custom event
  document.dispatchEvent(new Event("partials:ready"));
});
