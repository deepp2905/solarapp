import { IconChevron, IconSearch } from "./Icon";

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  ahj: string;
  onAhjChange: (value: string) => void;
  jurisdictions: string[];
}

export default function ProjectFilters({
  query,
  onQueryChange,
  ahj,
  onAhjChange,
  jurisdictions,
}: Props) {
  return (
    <div className="filters">
      <label className="field field-grow">
        <span className="field-label">Search</span>
        <span className="input-wrap">
          <IconSearch className="input-icon" />
          <input
            className="input"
            type="search"
            placeholder="Title, address, permit number, or SolarAPP ID"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </span>
      </label>

      <label className="field field-ahj">
        <span className="field-label">Jurisdiction (AHJ)</span>
        <span className="input-wrap">
          <select
            className="input select"
            value={ahj}
            onChange={(e) => onAhjChange(e.target.value)}
          >
            <option value="all">All jurisdictions</option>
            {jurisdictions.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
          <IconChevron className="input-icon input-icon-right select-caret" />
        </span>
      </label>
    </div>
  );
}
