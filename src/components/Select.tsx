import { useEffect, useId, useRef, useState } from "react";
import { IconChevron, IconTick } from "./Icon";

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

// Custom dropdown that replaces the native <select> so the popup matches the
// platform's color + typography theme instead of the OS chrome. Supports mouse
// and keyboard (arrows, Home/End, Enter/Space, Esc, type-ahead).
export default function Select({
  value,
  options,
  onChange,
  placeholder = "Select…",
  ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ buffer: "", timer: 0 });
  const listId = useId();

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Sync the active option to the selection each time the popup opens, and keep
  // it scrolled into view as the user navigates.
  useEffect(() => {
    if (open) setActive(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.children[active] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const commit = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  };

  const typeAhead = (key: string) => {
    window.clearTimeout(typeahead.current.timer);
    typeahead.current.buffer += key.toLowerCase();
    const buffer = typeahead.current.buffer;
    const match = options.findIndex((o) =>
      o.label.toLowerCase().startsWith(buffer),
    );
    if (match >= 0) setActive(match);
    typeahead.current.timer = window.setTimeout(() => {
      typeahead.current.buffer = "";
    }, 500);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else setActive((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpen(true);
        else setActive((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) commit(active);
        else setOpen(true);
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (e.key.length === 1) typeAhead(e.key);
    }
  };

  return (
    <div className="custom-select" ref={rootRef}>
      <button
        type="button"
        className="input select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span className={selected ? undefined : "select-placeholder"}>
          {selected ? selected.label : placeholder}
        </span>
        <IconChevron className="input-icon input-icon-right select-caret" />
      </button>

      {open && (
        <ul
          className="select-menu"
          role="listbox"
          id={listId}
          ref={listRef}
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={
                "select-option" +
                (index === active ? " is-active" : "") +
                (option.value === value ? " is-selected" : "")
              }
              onMouseEnter={() => setActive(index)}
              onClick={() => commit(index)}
            >
              <span>{option.label}</span>
              {option.value === value && <IconTick className="select-tick" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
