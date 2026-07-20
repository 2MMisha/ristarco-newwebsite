(function () {
  var STORE_KEY = "rsm-a11y-prefs";
  var FONT_STEPS = ["", "a11y-font-lg", "a11y-font-xl"];

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function save(prefs) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(prefs)); } catch (e) {}
  }

  function apply(prefs) {
    var body = document.body;
    var fontStep = prefs.fontStep || 0;

    FONT_STEPS.forEach(function (cls) { if (cls) body.classList.remove(cls); });
    if (FONT_STEPS[fontStep]) body.classList.add(FONT_STEPS[fontStep]);

    body.classList.toggle("a11y-contrast", !!prefs.contrast);
    body.classList.toggle("a11y-underline-links", !!prefs.underlineLinks);
    body.classList.toggle("a11y-readable-font", !!prefs.readableFont);
    body.classList.toggle("js-anim-ready", true); // keep anim gate consistent

    try {
      if (prefs.motion === "reduce") {
        localStorage.setItem("rsm-a11y-motion", "reduce");
        document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
      } else {
        localStorage.removeItem("rsm-a11y-motion");
      }
    } catch (e) {}
  }

  var prefs = load();
  apply(prefs);

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-a11y-widget]");
    if (!root) return;

    var toggleBtn = root.querySelector("[data-a11y-toggle]");
    var panel = root.querySelector("[data-a11y-panel]");

    // Reflect current prefs in the toggle switches
    root.querySelectorAll("[data-a11y-toggle-flag]").forEach(function (input) {
      var flag = input.getAttribute("data-a11y-toggle-flag");
      var key = flag === "contrast" ? "contrast"
        : flag === "underline-links" ? "underlineLinks"
        : flag === "readable-font" ? "readableFont"
        : "motion";
      input.checked = flag === "motion" ? prefs.motion === "reduce" : !!prefs[key];

      input.addEventListener("change", function () {
        if (flag === "motion") {
          prefs.motion = input.checked ? "reduce" : "";
        } else {
          prefs[key] = input.checked;
        }
        save(prefs);
        apply(prefs);
      });
    });

    toggleBtn.addEventListener("click", function () {
      var open = panel.hasAttribute("hidden");
      if (open) { panel.removeAttribute("hidden"); } else { panel.setAttribute("hidden", ""); }
      toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) panel.setAttribute("hidden", "");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { panel.setAttribute("hidden", ""); toggleBtn.setAttribute("aria-expanded", "false"); }
    });

    root.querySelectorAll("[data-a11y-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-a11y-action");
        if (action === "font-increase") prefs.fontStep = Math.min(2, (prefs.fontStep || 0) + 1);
        if (action === "font-decrease") prefs.fontStep = Math.max(0, (prefs.fontStep || 0) - 1);
        if (action === "font-reset") prefs.fontStep = 0;
        if (action === "reset") {
          prefs = {};
          root.querySelectorAll("[data-a11y-toggle-flag]").forEach(function (i) { i.checked = false; });
        }
        save(prefs);
        apply(prefs);
      });
    });
  });
})();
