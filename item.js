// Renders a single checklist item page (item.html?id=...).
(async function () {
  await window.ensureSprite();

  const id = new URLSearchParams(location.search).get("id");
  const found = id ? window.findItem(id) : null;
  const root = document.getElementById("detail");

  if (!found) {
    root.innerHTML = `<p style="margin-top:40px">Item not found.
      <a href="index.html">Back to checklist</a></p>`;
    return;
  }

  const { item } = found;
  const index = window.FLAT_ITEMS.findIndex((i) => i.id === item.id);
  const prev = window.FLAT_ITEMS[index - 1];
  const next = window.FLAT_ITEMS[index + 1];
  const total = window.TOTAL_ITEMS;

  document.title = item.title;

  const navLeft = prev
    ? `<a class="muted" href="item.html?id=${prev.id}">${window.icon(
        "icon-arrow-left"
      )} ${prev.title}</a>`
    : `<span></span>`;

  const navRight = next
    ? `<a class="next" href="item.html?id=${next.id}">${next.title} ${window.icon(
        "icon-arrow-right"
      )}</a>`
    : `<span></span>`;

  root.innerHTML = `
    <nav class="breadcrumb">
      <a href="index.html">${window.PROJECT.name}</a>
      <span class="sep">›</span>
      <a href="index.html">Checklist</a>
      <span class="sep">›</span>
      <span class="current">${item.title}</span>
    </nav>

    <div class="detail-progress">
      <div class="progress-track">
        <div class="progress-fill" style="width:${
          ((index + 1) / total) * 100
        }%"></div>
      </div>
      <span class="progress-count">
        ${index + 1}/${total}
        <span>${index + 1} of ${total} items</span>
      </span>
    </div>

    <h1 class="detail-title">${item.title}</h1>
    <p class="detail-subtitle">${item.subtitle}</p>

    <div class="dropzone">
      <div class="dropzone-actions">
        <button class="btn btn-primary">${window.icon(
          "icon-camera"
        )} Take Photo</button>
        <button class="btn btn-secondary">${window.icon(
          "icon-image"
        )} Choose from Library</button>
      </div>
      <p class="dropzone-hint">…or drag photos here — you can drop several at once.</p>
    </div>

    <p class="location-note">
      ${window.icon("icon-pin")}
      Your browser will ask for location access so we can confirm the photo was taken on-site.
    </p>

    <div class="evidence-box">No evidence captured yet.</div>

    <a class="not-applicable" href="#">This item doesn't apply to my install</a>

    <div class="detail-nav">
      ${navLeft}
      ${navRight}
    </div>`;
})();
