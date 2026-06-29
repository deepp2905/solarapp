import { Link } from "react-router-dom";
import type { ChecklistItem } from "../data";
import { IconChevronRight } from "./Icon";

interface Props {
  projectId: string;
  prev: ChecklistItem | null;
  next: ChecklistItem | null;
}

/**
 * Prev / next pager shown at the bottom of an item-detail page. Back is a
 * secondary button (left chevron + title); Next is a primary button (title +
 * right chevron). Either side collapses when at the start/end of the list,
 * while space-between keeps the remaining button anchored to its edge.
 */
export default function ItemPager({ projectId, prev, next }: Props) {
  if (!prev && !next) return null;

  const href = (id: string) => `/project/${projectId}/item/${id}`;

  return (
    <nav className="item-pager" aria-label="Checklist item navigation">
      {prev ? (
        <Link to={href(prev.id)} className="item-pager-btn item-pager-prev">
          <IconChevronRight className="item-pager-icon item-pager-icon-back" />
          <span className="item-pager-title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link to={href(next.id)} className="item-pager-btn item-pager-next">
          <span className="item-pager-title">{next.title}</span>
          <IconChevronRight className="item-pager-icon" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
