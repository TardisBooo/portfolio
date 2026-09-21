(() => {
  const root = document.documentElement;
  const body = document.body;
  const languageButtons = [...document.querySelectorAll("[data-language]")];
  const images = [...document.querySelectorAll("[data-alt-en]")];
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const projectCards = [
    ...document.querySelectorAll(".project-card[data-category]"),
  ];
  const projectGrid = document.querySelector("#project-grid");
  const emptyState = document.querySelector("#filter-empty");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  // Progressive disclosure preserves the complete project copy in the document.
  projectCards.forEach((card) => {
    const content = card.querySelector(".project-card-body");
    const paragraphs = [
      ...content.querySelectorAll(":scope > p:not(.project-lead)"),
    ];
    if (!paragraphs.length) return;
    const details = document.createElement("details");
    details.className = "project-description";
    const summary = document.createElement("summary");
    summary.innerHTML =
      '<span class="lang-en">The details</span><span class="lang-zh">展开项目细节</span>';
    details.append(summary);
    paragraphs[0].before(details);
    paragraphs.forEach((paragraph) => details.append(paragraph));
  });

  const setLanguage = (language, updateUrl = true) => {
    const next = language === "zh" ? "zh" : "en";
    body.dataset.lang = next;
    root.lang = next === "zh" ? "zh-CN" : "en";
    languageButtons.forEach((button) => {
      const active = button.dataset.language === next;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    images.forEach((image) => {
      image.alt = image.dataset[next === "zh" ? "altZh" : "altEn"];
    });
    try {
      localStorage.setItem("tardis-portfolio-language", next);
    } catch (_) {}
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.history.replaceState({}, "", url);
    }
  };

  languageButtons.forEach((button) =>
    button.addEventListener("click", () =>
      setLanguage(button.dataset.language),
    ),
  );

  const setFilter = (filter) => {
    const next = filter || "all";
    if (projectGrid) projectGrid.dataset.filter = next;
    let visible = 0;
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === next;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach((card) => {
      const show = next === "all" || card.dataset.category === next;
      card.classList.toggle("is-hidden", !show);
      if (!show)
        card.querySelectorAll("video").forEach((video) => video.pause());
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible > 0;
  };

  filterButtons.forEach((button) =>
    button.addEventListener("click", () => setFilter(button.dataset.filter)),
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const current = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("is-current", current);
            if (current) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -35px 0px" },
    );
    if (!motionPreference.matches) {
      document
        .querySelectorAll(
          ".project-card, .section-heading, .thinking-layout, .closing",
        )
        .forEach((element) => {
          element.classList.add("reveal-ready");
          revealObserver.observe(element);
        });
    }
    motionPreference.addEventListener("change", () => {
      if (!motionPreference.matches) return;
      revealObserver.disconnect();
      document
        .querySelectorAll(".reveal-ready")
        .forEach((element) => element.classList.add("is-visible"));
    });

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) entry.target.pause();
      });
    });
    document
      .querySelectorAll("video")
      .forEach((video) => videoObserver.observe(video));
  }

  const queryLanguage = new URLSearchParams(window.location.search).get("lang");
  let initialLanguage =
    queryLanguage === "zh" || queryLanguage === "en" ? queryLanguage : "en";
  if (!queryLanguage) {
    try {
      initialLanguage =
        localStorage.getItem("tardis-portfolio-language") || initialLanguage;
    } catch (_) {}
  }
  setLanguage(initialLanguage, false);
  setFilter("all");
})();
