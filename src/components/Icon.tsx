// Inline SVG icons. Each is a small, self-contained component so there is no
// sprite-loading / file:// concern under Vite.
type Props = { className?: string };

export const IconPlus = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 5v14M5 12h14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconChevronRight = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="m9 18 6-6-6-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconSearch = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
    <path
      d="m20 20-3.5-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const IconDashed = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="3 3"
    />
  </svg>
);

export const IconCheck = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path
      d="M7.5 12.5l3 3 6-6.5"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconWarning = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path d="M12 7v6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="1.25" fill="#fff" />
  </svg>
);

export const IconError = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path d="M12 7v6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="1.25" fill="#fff" />
  </svg>
);

// Bare checkmark (no circle) — used as the selected tick in the custom select.
export const IconTick = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M5 12.5l4.5 4.5L19 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconChevron = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M6 15l6-6 6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconCamera = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="11.5" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const IconUpload = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M12 4v12M8 8l4-4 4 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconImage = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" />
    <path
      d="M21 16l-5-5L5 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconTrash = ({ className }: Props) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 11v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 11v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 6h18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
