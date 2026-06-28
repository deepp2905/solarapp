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
        "Wide shot of the roof showing the full array and surrounding layout."
      ),
      item(
        "Equipment Wall Overview",
        "Wide shot of the equipment wall showing all mounted devices together."
      ),
    ],
  },
  {
    id: "roof",
    title: "Roof",
    items: [
      item(
        "PV Module Nameplate Label",
        "Close-up of the PV module nameplate showing manufacturer, model, and ratings."
      ),
      item(
        "Module-Level Power Electronics (MLPE) label",
        "Close-up of the MLPE (optimizer/microinverter) label showing model and serial."
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
        "Close-up of the roof conduit penetration and its weather sealing."
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
      item("Water Bond", "Close-up of the water pipe bonding connection."),
      item("Gas Bond", "Close-up of the gas pipe bonding connection."),
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

export const PROJECTS: Project[] = [
  {
    id: "sample-project",
    name: "Sample Project",
    address: "350 California Street, San Francisco, CA",
    type: "PV",
    ahj: "City of Santa Clara",
    status: "not-started",
    gpsToleranceMi: 0.1,
    sections: buildSections(),
  },
  {
    id: "sample-project-2",
    name: "Sample Project 2",
    address: "350 Mission Street, San Francisco, CA",
    type: "ST",
    ahj: "City of Milpitas",
    status: "not-started",
    gpsToleranceMi: 0.1,
    sections: buildSectionsWithExtra(),
  },
];

export function findProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function flatItems(project: Project): ChecklistItem[] {
  return project.sections.flatMap((s) => s.items);
}

export function totalItems(project: Project): number {
  return flatItems(project).length;
}

export function capturedItems(project: Project): number {
  return flatItems(project).filter((i) => i.status === "captured").length;
}

export function findItem(project: Project, itemId: string) {
  for (const section of project.sections) {
    const it = section.items.find((i) => i.id === itemId);
    if (it) return { section, item: it };
  }
  return null;
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
