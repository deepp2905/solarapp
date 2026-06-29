export type ItemStatus = "captured" | "to-capture" | "warning" | "error";

export type GpsStatus = "ok" | "failed" | "none";

export interface Evidence {
  fileName: string;
  displayName: string;
  ready: boolean;
  gps: GpsStatus;
  /** distance from site in miles, when GPS is available */
  distanceMi?: number;
  /** thumbnail image URL; falls back to a placeholder when absent */
  thumbnailUrl?: string;
  /** override note supplied by the installer when GPS failed */
  overrideNote?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  status: ItemStatus;
  filesCaptured?: number;
  evidence?: Evidence[];
  /**
   * Optional items are not required for completion: they're excluded from the
   * section/project totals and a project can be Complete with them still empty.
   * Optional items are always ordered last within their section.
   */
  optional?: boolean;
}

export interface Section {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export type ProjectStatus = "not-started" | "in-progress" | "complete";

export interface Project {
  id: string;
  name: string;
  address: string;
  /** short badge, e.g. "PV" or "ST" */
  type: string;
  /** authority having jurisdiction */
  ahj: string;
  status: ProjectStatus;
  /** GPS tolerance: a photo must be within this many miles of the site */
  gpsToleranceMi: number;
  sections: Section[];
}

// kebab-case slug from a title
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// shorthand item builder; status defaults to "to-capture"
function item(
  title: string,
  subtitle: string,
  extra: Partial<ChecklistItem> = {}
): ChecklistItem {
  return { id: slug(title), title, subtitle, status: "to-capture", ...extra };
}

// The standard SolarAPP+ checklist. Built fresh per project so each project
// owns an independent copy of its items (capture state is per-project).
function buildSections(): Section[] {
  return [
  {
    id: "site-overview",
    title: "Site Overview",
    items: [
      item(
        "Site Address",
        "Capture from the street or driveway for address + front view. Ensure the address number is legible and the full building facade is in frame.",
        {
          status: "captured",
          filesCaptured: 2,
          evidence: [
            {
              fileName: "CTD Thumbnail.png",
              displayName: "CTD Thumbnail.png",
              ready: true,
              gps: "failed",
              distanceMi: 32.6,
            },
            {
              fileName: "Bank Onboarding Thumbnail.png",
              displayName: "Bank Onboarding Thumbnail.png",
              ready: true,
              gps: "failed",
              distanceMi: 41.8,
            },
          ],
        }
      ),
      item(
        "Roof Overview",
        "Wide-angle or elevated photo showing the entire roof with all installed arrays — minimum 1 photo per mounting plane. Orient to ensure PV module count, fire setback pathways, and vent/obstacle locations are visible. Show tape measure in the photos as appropriate. Show no damaged or broken tiles or shingles around the work area."
      ),
      item(
        "Equipment Wall Overview",
        "A wide front shot showing all existing and new electrical equipment in a single frame. Add a side-angle shot showing working clearance in front of all equipment. Show full conduit runs from the roof and between all equipment.",
        { optional: true }
      ),
    ],
  },
  {
    id: "roof",
    title: "Roof",
    items: [
      item(
        "PV Module Nameplate Label",
        "Close-up of the module manufacturer nameplate on the back of at least one representative module. Must show manufacturer, model number, Voc, Isc, Vmp, Imp, STC power rating, and UL/certification mark."
      ),
      item(
        "Module-Level Power Electronics (MLPE) label",
        "Photo of the MLPE (DC-DC controller, microinverter, MCI) nameplate label"
      ),
      item(
        "Racking System Overview",
        "Overview of the racking/mounting system as installed on the roof."
      ),
      item(
        "Under-Array Wire Management",
        "Photo showing wiring secured and managed beneath the array."
      ),
      item(
        "Array Grounding and Bonding",
        "Close-up of the array grounding and bonding connections."
      ),
      item("Conduit", "Photo of the conduit runs serving the array."),
      item(
        "Junction Box (Cover On)",
        "Photo of the roof junction box with the cover installed."
      ),
      item(
        "Junction Box (Cover Off)",
        "Photo of the roof junction box with the cover removed showing connections."
      ),
      item(
        "Array Attachment and Flashing",
        "Close-up of an array attachment point and its flashing."
      ),
      item(
        "Conduit Penetration",
        "Close-up of the roof conduit penetration and its weather sealing.",
        { optional: true }
      ),
    ],
  },
  {
    id: "inverter",
    title: "Inverter",
    items: [
      item(
        "Inverter Overview",
        "Full view of the inverter mounted in its final location."
      ),
      item(
        "Inverter Nameplate",
        "Close-up of the inverter nameplate showing manufacturer, model, and serial number."
      ),
      item(
        "Inverter (Cover Off)",
        "Inverter with the cover removed showing internal wiring and connections."
      ),
      item(
        "PV Rapid Shutdown Remote Initiation Device",
        "Photo of the rapid shutdown initiation device and its labeling."
      ),
    ],
  },
  {
    id: "panelboards-busbars",
    title: "Panelboards/Busbars",
    items: [
      item(
        "Main Panel Nameplate Label",
        "Close-up of the main panel nameplate showing bus and main breaker ratings."
      ),
      item(
        "Main Service Panel (Deadfront On)",
        "Photo of the main service panel with the deadfront cover installed."
      ),
      item(
        "Main Service Panel (Deadfront Off)",
        "Photo of the main service panel with the deadfront removed showing breakers."
      ),
      item("Main OCPD Rating", "Close-up of the main overcurrent device rating."),
      item(
        "Backfeed Breaker Rating (Main)",
        "Close-up of the solar backfeed breaker rating in the main panel."
      ),
      item(
        "Subpanel Nameplate Label",
        "Close-up of the subpanel nameplate showing bus and main breaker ratings."
      ),
      item(
        "Subpanel (Deadfront On)",
        "Photo of the subpanel with the deadfront cover installed."
      ),
      item(
        "Subpanel (Deadfront Off)",
        "Photo of the subpanel with the deadfront removed showing breakers."
      ),
      item(
        "Subpanel OCPD Rating",
        "Close-up of the subpanel overcurrent device rating."
      ),
      item(
        "Backfeed Breaker Rating (Subpanel)",
        "Close-up of the solar backfeed breaker rating in the subpanel."
      ),
      item(
        "Grounding Electrode System Connection",
        "Close-up of the grounding electrode system connection."
      ),
      item(
        "Equipment Grounding Conductor",
        "Close-up of the equipment grounding conductor connection."
      ),
      item(
        "AC Disconnect",
        "Photo of the AC disconnect in its final mounted location."
      ),
      // Optional items, kept at the end of the section.
      item("Water Bond", "Close-up of the water pipe bonding connection.", {
        optional: true,
      }),
      item("Gas Bond", "Close-up of the gas pipe bonding connection.", {
        optional: true,
      }),
    ],
  },
  {
      id: "system-tests",
      title: "System Tests",
      items: [
        item(
          "Power Control System Test",
          "Documentation or photo evidence of the power control system test."
        ),
      ],
    },
  ];
}

// Second project has one extra item so its count differs (1/34 vs 1/33).
function buildSectionsWithExtra(): Section[] {
  const sections = buildSections();
  const systemTests = sections.find((s) => s.id === "system-tests");
  systemTests?.items.push(
    item(
      "Battery System Test",
      "Documentation or photo evidence of the battery system test."
    )
  );
  return sections;
}

// Demo project definitions. `sections` is built per project so each owns an
// independent checklist; `buildSectionsWithExtra` gives one a differing count.
// `progress` (0–1) seeds how many items start captured, so card progress
// bars/percentages stay derived from real item state — not hardcoded.
interface ProjectSeed {
  id: string;
  name: string;
  address: string;
  type: string;
  ahj: string;
  status: ProjectStatus;
  progress: number;
  withExtra?: boolean;
}

const PROJECT_SEEDS: ProjectSeed[] = [
  { id: "sample-project", name: "Sample Project", address: "350 California Street, San Francisco, CA", type: "ST", ahj: "City of Santa Clara", status: "in-progress", progress: 0.12 },
  { id: "mission-st-retrofit", name: "Mission St Retrofit", address: "350 Mission Street, San Francisco, CA", type: "ST", ahj: "City of Milpitas", status: "in-progress", progress: 0.45, withExtra: true },
  { id: "harborview-solar", name: "Harborview Solar", address: "88 Embarcadero, San Francisco, CA", type: "PV", ahj: "City of Oakland", status: "in-progress", progress: 0.78 },
  { id: "redwood-commons", name: "Redwood Commons", address: "1200 Broadway, Redwood City, CA", type: "PV", ahj: "City of Santa Clara", status: "complete", progress: 1 },
  { id: "sunset-ridge", name: "Sunset Ridge", address: "45 Ocean Ave, San Francisco, CA", type: "ST", ahj: "City of San Jose", status: "complete", progress: 1 },
  { id: "lakeside-array", name: "Lakeside Array", address: "9 Lakeshore Dr, Oakland, CA", type: "PV", ahj: "City of Oakland", status: "complete", progress: 1 },
  { id: "summit-battery", name: "Summit Battery", address: "500 Summit Rd, San Jose, CA", type: "ST", ahj: "City of San Jose", status: "complete", progress: 1 },
  { id: "bayfront-install", name: "Bayfront Install", address: "12 Bay St, Milpitas, CA", type: "PV", ahj: "City of Milpitas", status: "not-started", progress: 0 },
];

const RESOLVED_OVERRIDE_NOTE =
  "Interior install — no GPS signal at the equipment location; address confirmed on site.";

// A captured item must not carry an *unresolved* GPS failure. Any failed
// evidence on a captured item gets a documented override reason, so a 100%
// project never contains a dangling GPS failure.
function resolveCapturedEvidence(item: ChecklistItem): void {
  item.evidence?.forEach((ev) => {
    if (ev.gps === "failed" && !ev.overrideNote) {
      ev.overrideNote = RESOLVED_OVERRIDE_NOTE;
    }
  });
}

// A single passing placeholder photo, used to seed a captured item that has no
// pre-authored evidence so its derived status is "captured".
function placeholderEvidence(): Evidence {
  return {
    fileName: "site-photo.jpg",
    displayName: "site-photo.jpg",
    ready: true,
    gps: "ok",
  };
}

// Seed the first `fraction` of a section list's items as captured by giving
// them evidence; the rest are left empty (Pending). Status is then *derived*
// from evidence so the seed always satisfies the capture rules
// (see deriveItemStatus): no item is left Pending while holding photos, and no
// captured item carries an unresolved GPS failure.
function seedProgress(sections: Section[], fraction: number): Section[] {
  const items = sections.flatMap((s) => s.items);
  const target = Math.round(items.length * fraction);
  items.forEach((item, i) => {
    if (i < target) {
      // Captured: ensure it has at least one photo, and excuse any failures.
      if (!item.evidence || item.evidence.length === 0) {
        item.evidence = [placeholderEvidence()];
      }
      resolveCapturedEvidence(item);
    } else {
      // Pending: clear any pre-authored evidence so it derives to "to-capture".
      delete item.evidence;
      delete item.filesCaptured;
    }
    item.status = deriveItemStatus(item.evidence);
    item.filesCaptured = item.evidence?.length;
  });
  return sections;
}

// Items (by id) seeded with an *unresolved* GPS failure per project, so a few
// in-progress projects surface the "GPS Failed!" state on the checklist. Each
// chosen item sits within that project's captured range so it actually renders.
const GPS_FAILURE_SEED: Record<string, { itemId: string; distanceMi: number }[]> =
  {
    "sample-project": [{ itemId: slug("Site Address"), distanceMi: 32.6 }],
    "mission-st-retrofit": [
      { itemId: slug("Roof Overview"), distanceMi: 18.4 },
      { itemId: slug("Inverter Nameplate"), distanceMi: 27.1 },
    ],
    "harborview-solar": [
      { itemId: slug("Main Panel Nameplate Label"), distanceMi: 9.2 },
    ],
  };

// Overwrite an item's evidence with a single unresolved GPS-failed photo and
// re-derive its status → "error" (GPS Failed!). Runs after seedProgress so the
// failure is not auto-excused.
function seedGpsFailure(
  sections: Section[],
  itemId: string,
  distanceMi: number
): void {
  for (const section of sections) {
    const item = section.items.find((i) => i.id === itemId);
    if (!item) continue;
    item.evidence = [
      {
        fileName: "site-photo.jpg",
        displayName: "site-photo.jpg",
        ready: true,
        gps: "failed",
        distanceMi,
      },
    ];
    item.filesCaptured = item.evidence.length;
    item.status = deriveItemStatus(item.evidence);
    return;
  }
}

export const PROJECTS: Project[] = PROJECT_SEEDS.map(
  ({ withExtra, progress, id, ...seed }) => {
    const sections = seedProgress(
      withExtra ? buildSectionsWithExtra() : buildSections(),
      progress
    );
    GPS_FAILURE_SEED[id]?.forEach(({ itemId, distanceMi }) =>
      seedGpsFailure(sections, itemId, distanceMi)
    );
    return { ...seed, id, gpsToleranceMi: 0.1, sections };
  }
);

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  complete: "Complete",
  "in-progress": "In progress",
  "not-started": "Not started",
};

/** Default card sort priority: not started → in progress → complete. */
export const PROJECT_STATUS_ORDER: Record<ProjectStatus, number> = {
  "not-started": 0,
  "in-progress": 1,
  complete: 2,
};

/** Counts of projects per status, in display order (complete → in-progress → not-started). */
export function projectStatusCounts(
  projects: Project[] = PROJECTS
): { status: ProjectStatus; count: number }[] {
  const order: ProjectStatus[] = ["complete", "in-progress", "not-started"];
  return order
    .map((status) => ({
      status,
      count: projects.filter((p) => deriveProjectStatus(p) === status).length,
    }))
    .filter((s) => s.count > 0);
}

export function findProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function flatItems(project: Project): ChecklistItem[] {
  return project.sections.flatMap((s) => s.items);
}

// Optional items are excluded from completion math: they don't add to the
// required total, and a project can be Complete with them still empty.
const isRequired = (i: ChecklistItem) => !i.optional;

export function totalItems(project: Project): number {
  return flatItems(project).filter(isRequired).length;
}

export function capturedItems(project: Project): number {
  return flatItems(project).filter(
    (i) => isRequired(i) && i.status === "captured"
  ).length;
}

/**
 * Project status derived from item completion:
 *  - 0 captured            → "not-started"
 *  - all items captured    → "complete"
 *  - otherwise             → "in-progress"
 */
export function deriveProjectStatus(project: Project): ProjectStatus {
  const total = totalItems(project);
  const done = capturedItems(project);
  if (done === 0) return "not-started";
  if (done === total) return "complete";
  return "in-progress";
}

/** Captured count within a single section (required items only). */
export function sectionCaptured(section: Section): number {
  return section.items.filter(
    (i) => isRequired(i) && i.status === "captured"
  ).length;
}

/** Required-item count within a single section (denominator for "N of M"). */
export function sectionTotal(section: Section): number {
  return section.items.filter(isRequired).length;
}

/** A section needs attention if any of its items is in an error state. */
export function sectionNeedsAttention(section: Section): boolean {
  return section.items.some((i) => i.status === "error");
}

/** Short status sub-label shown under an item's title on the checklist. */
export function itemStatusLabel(item: ChecklistItem): string {
  switch (item.status) {
    case "captured":
      return item.filesCaptured
        ? `${item.filesCaptured} file${item.filesCaptured === 1 ? "" : "s"} captured`
        : "Captured";
    case "error":
      return "GPS Failed!";
    case "warning":
      return "Needs review";
    default:
      // An empty optional item reads "Optional", not "Pending".
      return item.optional ? "Optional" : "Pending";
  }
}

/**
 * Derive an item's status from its evidence, per the capture rules:
 *  - no images                                   → "to-capture" (Pending)
 *  - any image with a GPS failure not yet excused
 *    by a saved override note                    → "error" (GPS Failed!)
 *  - otherwise (has images, all failures excused
 *    or none failed)                             → "captured" (Completed)
 *
 * A failed GPS photo is "excused" once an override reason is saved onto it
 * (`overrideNote`), which flips the item back to captured.
 */
export function deriveItemStatus(evidence: Evidence[] = []): ItemStatus {
  if (evidence.length === 0) return "to-capture";
  const unresolvedFailure = evidence.some(
    (e) => e.gps === "failed" && !e.overrideNote
  );
  return unresolvedFailure ? "error" : "captured";
}

export function findItem(project: Project, itemId: string) {
  for (const section of project.sections) {
    const it = section.items.find((i) => i.id === itemId);
    if (it) return { section, item: it };
  }
  return null;
}

/**
 * Previous / next item in the flattened checklist order (across sections), for
 * the item-detail pager. Either side is null at the ends of the list.
 */
export function siblingItems(
  project: Project,
  itemId: string
): { prev: ChecklistItem | null; next: ChecklistItem | null } {
  const items = flatItems(project);
  const i = items.findIndex((it) => it.id === itemId);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? items[i - 1] : null,
    next: i < items.length - 1 ? items[i + 1] : null,
  };
}

export function statusIconId(status: ItemStatus): string {
  switch (status) {
    case "captured":
      return "icon-check";
    case "warning":
      return "icon-warning";
    case "error":
      return "icon-error";
    default:
      return "icon-dashed";
  }
}

export function statusClass(status: ItemStatus): string {
  switch (status) {
    case "captured":
      return "status-captured";
    case "warning":
      return "status-warning";
    case "error":
      return "status-error";
    default:
      return "status-pending";
  }
}
