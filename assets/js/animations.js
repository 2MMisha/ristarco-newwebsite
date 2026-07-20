(function () {
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var userReduced = false;
  try { userReduced = localStorage.getItem("rsm-a11y-motion") === "reduce"; } catch (e) {}

  document.body.classList.add("js-anim-ready");

  if (prefersReduced || userReduced) return; // content stays fully visible, no animation

  var targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || targets.length === 0) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  targets.forEach(function (el) { observer.observe(el); });
})();
