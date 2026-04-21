/* ============================================
   Portfolio — interactivity
   Plain vanilla JS (no frameworks, no build)
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Render Lucide icons (loaded via CDN in index.html)
  if (window.lucide) window.lucide.createIcons();

  // ---------- Loader: hide after window load ----------
  const loader = document.getElementById("loader");
  const hideLoader = () => loader && loader.classList.add("hidden");
  window.addEventListener("load", () => setTimeout(hideLoader, 800));
  // Safety net in case "load" never fires
  setTimeout(hideLoader, 2500);

  // ---------- Navbar: scroll state + mobile toggle ----------
  const navbar = document.getElementById("navbar");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  menuToggle?.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );

  // ---------- Reveal-on-scroll (IntersectionObserver) ----------
  const revealTargets = document.querySelectorAll(
    ".section, .card, .project, .skill, .hero-content"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          // Animate skill bars when they reveal
          if (entry.target.classList.contains("skill")) {
            const fill = entry.target.querySelector(".fill");
            const level = entry.target.dataset.level;
            if (fill && level) fill.style.width = level + "%";
          }
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => io.observe(el));

  // ---------- Portfolio filters ----------
  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      projects.forEach((p) => {
        const match = cat === "all" || p.dataset.cat === cat;
        p.classList.toggle("hide", !match);
      });
    });
  });

  // ---------- Project modal ----------
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalCat = document.getElementById("modalCat");

  const openModal = (project) => {
    const videoSrc = project.dataset.video || '';
    const videoEl = document.getElementById('modalVideo');
    const thumbVideo = project.querySelector('.thumb video');
    const thumbImg = project.querySelector('.thumb img');
    const posterSrc = thumbVideo?.poster || thumbImg?.src || '';
    
    if (videoEl && videoSrc) {
      videoEl.src = videoSrc;
      videoEl.poster = posterSrc;
      videoEl.load();
      videoEl.play();
    }
    modalTitle.textContent = project.dataset.title || "Project";
    modalCat.textContent = project.dataset.cat === "video" ? "Video Project" : "Image Project";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    const videoEl = document.getElementById('modalVideo');
    if (videoEl) {
      videoEl.pause();
      videoEl.currentTime = 0;
    }
    modal.hidden = true;
    document.body.style.overflow = "";
  };
  
  // Only attach click handler to video projects (with play-trigger class)
  const videoProjects = document.querySelectorAll(".project.play-trigger");
  videoProjects.forEach((p) => p.addEventListener("click", () => openModal(p)));
  
  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeModal)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  // ---------- Contact form (placeholder handler) ----------
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    if (!name || !email || !message) {
      status.textContent = "Please fill in every field.";
      status.className = "form-status error";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = "Please enter a valid email address.";
      status.className = "form-status error";
      return;
    }

    // Placeholder: wire this to your email service (Formspree, EmailJS, etc.)
    status.textContent = `Thanks ${name}! Your message has been queued (demo).`;
    status.className = "form-status success";
    form.reset();
  });

  // ---------- Footer year ----------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
