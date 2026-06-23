export type Status = "captured" | "to-capture";

export interface ChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  status: Status;
  filesCaptured?: number;
}

export interface Section {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export const project = {
  name: "Sample Project 2",
  address: "350 Mission Street, San Francisco, CA",
};

export const sections: Section[] = [
  {
    id: "site-overview",
    title: "Site Overview",
    items: [
      {
        id: "site-address",
        title: "Site Address",
        subtitle:
          "Photo of the property address or street sign confirming the install location.",
        status: "captured",
        filesCaptured: 2,
      },
      {
        id: "electrical-diagram",
        title: "Electrical Diagram",
        subtitle:
          "Single-line electrical diagram showing the system layout and connections.",
        status: "to-capture",
      },
      {
        id: "site-walkthrough",
        title: "Site Walkthrough",
        subtitle:
          "Video or series of photos walking through the full installation site.",
        status: "to-capture",
      },
      {
        id: "equipment-wall-overview",
        title: "Equipment Wall Overview",
        subtitle:
          "Wide shot of the equipment wall showing all mounted devices together.",
        status: "to-capture",
      },
    ],
  },
  {
    id: "inverter",
    title: "Inverter",
    items: [
      {
        id: "inverter-nameplate",
        title: "Inverter Nameplate",
        subtitle:
          "Close-up of the inverter nameplate showing manufacturer, model, and serial number.",
        status: "to-capture",
      },
      {
        id: "inverter-overview",
        title: "Inverter Overview",
        subtitle: "Full view of the inverter mounted in its final location.",
        status: "to-capture",
      },
      {
        id: "inverter-cover-off",
        title: "Inverter (Cover Off)",
        subtitle:
          "Inverter with the cover removed showing internal wiring and connections.",
        status: "to-capture",
      },
    ],
  },
  {
    id: "battery",
    title: "Battery",
    items: [
      {
        id: "battery-overview",
        title: "Battery Overview",
        subtitle: "Full view of the battery unit mounted in its final location.",
        status: "to-capture",
      },
      {
        id: "battery-nameplate-label",
        title: "Battery Nameplate Label",
        subtitle:
          "Close-up of the battery nameplate label showing manufacturer, model, and serial number.",
        status: "to-capture",
      },
      {
        id: "backup-initiation-device-label",
        title: "Backup Initiation Device Label",
        subtitle:
          "Close-up of the BID nameplate label showing manufacturer, model number, and serial number. Mark Not Applicable if the BID is built into the inverter, or if this install has no battery.",
        status: "to-capture",
      },
      {
        id: "backup-initiation-device-deadfront-on",
        title: "Backup Initiation Device (Deadfront On)",
        subtitle:
          "Photo of the Backup Initiation Device with the deadfront cover on.",
        status: "to-capture",
      },
      {
        id: "backup-initiation-device-deadfront-off",
        title: "Backup Initiation Device (Deadfront Off)",
        subtitle:
          "Photo of the Backup Initiation Device with the deadfront cover off.",
        status: "to-capture",
      },
      {
        id: "battery-disconnect",
        title: "Battery Disconnect",
        subtitle:
          "Photo of the battery disconnect switch in its final mounted location.",
        status: "to-capture",
      },
    ],
  },
];

export const totalItems = sections.reduce((n, s) => n + s.items.length, 0);
export const capturedItems = sections.reduce(
  (n, s) => n + s.items.filter((i) => i.status === "captured").length,
  0
);

export function findItem(id: string) {
  for (const section of sections) {
    const item = section.items.find((i) => i.id === id);
    if (item) return { section, item };
  }
  return null;
}
