(() => {
  const stage = document.querySelector(".tardis-stage");
  const toggle = document.querySelector(".motion-toggle");
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  toggle.hidden = false;
  let paused = false;
  const update = () => {
    stage.classList.toggle("is-paused", paused || preference.matches);
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.querySelector(".lang-en").textContent = paused
      ? "Resume rotation"
      : "Pause rotation";
    toggle.querySelector(".lang-zh").textContent = paused
      ? "继续旋转"
      : "暂停旋转";
  };
  toggle.addEventListener("click", () => {
    paused = !paused;
    update();
  });
  preference.addEventListener("change", update);
  update();
  if ("IntersectionObserver" in window) {
    const visibility = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) =>
          stage.classList.toggle("is-in-view", entry.isIntersecting),
        ),
      { threshold: 0.1 },
    );
    visibility.observe(stage);
    if (!preference.matches)
      document
        .querySelectorAll(".project-card")
        .forEach((card) => card.classList.add("motion-card"));
  }
  document.addEventListener("visibilitychange", () => {
    stage.classList.toggle(
      "is-paused",
      document.hidden || paused || preference.matches,
    );
  });
})();
