// Renders the checklist (index.html).
(async function () {
  await window.ensureSprite();

  document.getElementById("project-name").textContent = window.PROJECT.name;
  document.getElementById("project-address").textContent =
    window.PROJECT.address;

  const pct = (window.CAPTURED_ITEMS / window.TOTAL_ITEMS) * 100;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById(
    "progress-count"
  ).textContent = `${window.CAPTURED_ITEMS}/${window.TOTAL_ITEMS}`;

  const container = document.getElementById("sections");

  container.innerHTML = window.SECTIONS.map((section) => {
    const done = section.items.filter((i) => i.status === "captured").length;

    const items = section.items
      .map((item) => {
        const { icon, cls } = window.statusIcon(item.status);
        const left = `
          <span class="item-left">
            ${window.icon(icon, "status-icon " + cls)}
            <span>
              <span class="item-title">${item.title}</span>
              ${
                item.status === "captured"
                  ? `<div class="item-files">${item.filesCaptured} files captured</div>`
                  : ""
              }
            </span>
          </span>`;

        const right =
          item.status === "captured"
            ? `<span class="thumb">IMG</span>`
            : `<span class="badge">To capture</span>`;

        return `<a class="item-row" href="item.html?id=${item.id}">${left}${right}</a>`;
      })
      .join("");

    return `
      <div class="section" data-section="${section.id}">
        <button class="section-head" type="button">
          <span class="section-title">${section.title}</span>
          <span class="section-meta">
            ${done} of ${section.items.length} complete
            ${window.icon("icon-chevron", "chevron")}
          </span>
        </button>
        ${items}
      </div>`;
  }).join("");

  // Collapse / expand
  container.querySelectorAll(".section-head").forEach((head) => {
    head.addEventListener("click", () => {
      head.closest(".section").classList.toggle("collapsed");
    });
  });
})();
