(() => {
  const carousel = document.querySelector(".prewalk-carousel");
  if (carousel) {
    const slides = [...carousel.querySelectorAll(".prewalk-slide")];
    let index = 0;
    const show = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.hidden = i !== index;
      });
      carousel.querySelector(".carousel-status").textContent =
        `${index + 1} / ${slides.length}`;
    };
    carousel.querySelector(".carousel-controls").hidden = false;
    carousel
      .querySelector(".carousel-prev")
      .addEventListener("click", () => show(index - 1));
    carousel
      .querySelector(".carousel-next")
      .addEventListener("click", () => show(index + 1));
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        show(index + (event.key === "ArrowLeft" ? -1 : 1));
      }
    });
    let start = null;
    carousel.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" && !event.target.closest("a,button"))
        start = { x: event.clientX, y: event.clientY };
    });
    carousel.addEventListener("pointerup", (event) => {
      if (!start) return;
      const dx = event.clientX - start.x,
        dy = event.clientY - start.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5)
        show(index + (dx < 0 ? 1 : -1));
      start = null;
    });
    carousel.addEventListener("pointercancel", () => {
      start = null;
    });
  }
  const stage = document.querySelector(".tardis-stage");
  const toggle = document.querySelector(".motion-toggle");
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const gif = document.querySelector(".tardis-gif");
  const still = document.querySelector(".tardis-still");
  let inView = false;
  const renderPlayback = () => {
    if (!gif.complete || !gif.naturalWidth) return;
    const stop = paused || preference.matches || document.hidden || !inView;
    if (stop && still.hidden)
      still.getContext("2d").drawImage(gif, 0, 0, still.width, still.height);
    still.hidden = !stop;
    gif.style.visibility = stop ? "hidden" : "visible";
  };
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
    renderPlayback();
  };
  toggle.addEventListener("click", () => {
    paused = !paused;
    update();
  });
  preference.addEventListener("change", update);
  gif.addEventListener("load", renderPlayback);
  update();
  if ("IntersectionObserver" in window) {
    const visibility = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          inView = entry.isIntersecting;
          stage.classList.toggle("is-in-view", inView);
          renderPlayback();
        }),
      { threshold: 0.1 },
    );
    visibility.observe(stage);
    if (!preference.matches)
      document
        .querySelectorAll(".project-card")
        .forEach((card) => card.classList.add("motion-card"));
  }
  document.addEventListener("visibilitychange", () => {
    renderPlayback();
    stage.classList.toggle(
      "is-paused",
      document.hidden || paused || preference.matches,
    );
  });
})();
