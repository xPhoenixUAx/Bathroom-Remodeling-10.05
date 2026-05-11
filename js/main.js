(function () {
  const config = window.SITE_CONFIG || {};
  const selectors = {
    companyName: "[data-company-name]",
    phoneText: "[data-phone-text]",
    emailText: "[data-email-text]",
    companyId: "[data-company-id]",
    companyAddress: "[data-company-address]",
    businessHours: "[data-business-hours]",
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
    setText(selectors.businessHours, config.businessHours);
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

  function initActiveLinks() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    const servicePages = new Set([
      "services.html",
      "full-bathroom-remodeling.html",
      "shower-tub-remodeling.html",
      "tile-flooring.html",
      "vanities-storage-lighting.html",
      "accessible-bathrooms.html"
    ]);

    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
      const href = link.getAttribute("href").split("#")[0];
      if (href === current) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });

    if (servicePages.has(current)) {
      document.querySelectorAll('.nav-dropdown__trigger[href="services.html"], .mobile-service-dropdown summary').forEach((item) => {
        item.classList.add("is-active");
      });
    }
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

  function initFloatingCta() {
    if (document.querySelector(".floating-cta")) return;
    const cta = document.createElement("div");
    cta.className = "floating-cta";
    cta.innerHTML = `
      <a class="floating-cta__call" data-phone-link href="tel:${config.phone || ""}" aria-label="Call ${config.companyName || "us"}">
        <i data-lucide="phone"></i>
        <span data-phone-text>${config.phoneDisplay || "Call"}</span>
      </a>
      <a class="floating-cta__project" href="contact.html">
        <i data-lucide="clipboard-check"></i>
        <span>${config.ctaPrimary || "Plan My Project"}</span>
      </a>
    `;
    document.body.appendChild(cta);
  }

  function initCookieBanner() {
    const storageKey = "bathworks_cookie_choice";
    if (localStorage.getItem(storageKey)) return;

    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie preferences");
    banner.innerHTML = `
      <div class="cookie-banner__copy">
        <strong>Cookie preferences</strong>
        <p>We use cookies to keep the site functional, understand traffic, and improve project inquiry flows.</p>
      </div>
      <div class="cookie-banner__actions">
        <a class="cookie-banner__link" href="cookie.html">Policy</a>
        <button type="button" data-cookie-choice="declined">Decline</button>
        <button type="button" data-cookie-choice="accepted">Accept</button>
      </div>
    `;
    document.body.appendChild(banner);

    banner.querySelectorAll("[data-cookie-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        localStorage.setItem(storageKey, button.getAttribute("data-cookie-choice"));
        banner.classList.add("is-hiding");
        window.setTimeout(() => banner.remove(), 240);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    hydrateConfig();
    initHeader();
    initMenu();
    initSmoothScroll();
    initActiveLinks();
    initReveal();
    initFloatingCta();
    initCookieBanner();
    if (window.lucide) window.lucide.createIcons({ strokeWidth: 1.75 });
  });
})();
