(function () {
  const config = window.SITE_CONFIG || {};
  const selectors = {
    companyName: "[data-company-name]",
    phoneText: "[data-phone-text]",
    emailText: "[data-email-text]",
    companyId: "[data-company-id]",
    companyAddress: "[data-company-address]",
    footerPrimary: "[data-footer-text-primary]",
    footerSecondary: "[data-footer-text-secondary]",
    disclaimerShort: "[data-disclaimer-short]",
    disclaimerFull: "[data-disclaimer-full]",
    footerDisclaimerLegal: "[data-footer-disclaimer-legal]",
    year: "[data-current-year]"
  };

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value || "";
    });
  }

  function hydrateConfig() {
    setText(selectors.companyName, config.companyName);
    setText(selectors.phoneText, config.phoneDisplay);
    setText(selectors.emailText, config.email);
    setText(selectors.companyId, config.companyId);
    setText(selectors.companyAddress, [config.addressLine1, config.addressLine2].filter(Boolean).join(", "));
    setText(selectors.footerPrimary, config.footerTextPrimary);
    setText(selectors.footerSecondary, config.footerTextSecondary);
    setText(selectors.disclaimerShort, config.disclaimerShort);
    setText(selectors.disclaimerFull, config.disclaimerFull);
    setText(selectors.footerDisclaimerLegal, config.footerDisclaimerLegal);
    setText(selectors.year, new Date().getFullYear());

    document.querySelectorAll("[data-phone-link]").forEach((link) => {
      link.setAttribute("href", `tel:${config.phone || ""}`);
      if (!link.textContent.trim()) link.textContent = config.phoneButtonLabel || config.phoneDisplay || "Call";
    });
    document.querySelectorAll("[data-email-link]").forEach((link) => {
      link.setAttribute("href", `mailto:${config.email || ""}`);
      if (!link.textContent.trim()) link.textContent = config.email || "Email";
    });
    document.querySelectorAll("[data-cta-primary]").forEach((node) => {
      node.textContent = config.ctaPrimary || node.textContent;
    });
    document.querySelectorAll("[data-cta-secondary]").forEach((node) => {
      node.textContent = config.ctaSecondary || node.textContent;
    });

    document.querySelectorAll(".site-footer").forEach((footer) => {
      if (footer.querySelector("[data-footer-disclaimer-legal]")) return;
      const disclaimer = document.createElement("p");
      disclaimer.className = "footer-legal-disclaimer";
      disclaimer.setAttribute("data-footer-disclaimer-legal", "");
      disclaimer.textContent = config.footerDisclaimerLegal || "";
      footer.appendChild(disclaimer);
    });
  }

  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 18);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");
    const close = document.querySelector("[data-menu-close]");
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      document.body.classList.toggle("menu-open", open);
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      if (open) close && close.focus();
    };

    toggle.addEventListener("click", () => setOpen(true));
    close && close.addEventListener("click", () => setOpen(false));
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        const offset = document.querySelector(".site-header")?.offsetHeight || 0;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset - 16, behavior: "smooth" });
      });
    });
  }

  function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    items.forEach((item) => observer.observe(item));
  }

  document.addEventListener("DOMContentLoaded", () => {
    hydrateConfig();
    initHeader();
    initMenu();
    initSmoothScroll();
    initReveal();
    if (window.lucide) window.lucide.createIcons({ strokeWidth: 1.75 });
  });
})();
