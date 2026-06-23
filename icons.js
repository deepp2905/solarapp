// Loads the SVG sprite (icons.svg) and injects it into the document so that
// <use href="#icon-..."> references resolve. Works on http(s); on file://
// browsers may block the fetch, in which case <use> still resolves against the
// external file as a fallback. Call ensureSprite() before rendering icons.
window.ensureSprite = async function () {
  if (document.getElementById("svg-sprite")) return;
  try {
    const res = await fetch("icons.svg");
    const text = await res.text();
    const wrap = document.createElement("div");
    wrap.id = "svg-sprite";
    wrap.style.display = "none";
    wrap.innerHTML = text;
    document.body.prepend(wrap);
  } catch (e) {
    // file:// fallback — leave external references in place.
    console.warn("Could not inline sprite, using external refs.", e);
  }
};

// Returns SVG markup that references a sprite symbol by id.
// usage: icon("icon-check", "status-icon status-captured")
window.icon = function (id, cls) {
  const fallback = "icons.svg#" + id; // used if sprite wasn't inlined
  const href = document.getElementById("svg-sprite") ? "#" + id : fallback;
  return `<svg class="${cls || ""}" aria-hidden="true"><use href="${href}"></use></svg>`;
};
