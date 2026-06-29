import { IconSearch } from "./Icon";
import Select from "./Select";

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
        <Select
          value={ahj}
          onChange={onAhjChange}
          ariaLabel="Jurisdiction (AHJ)"
          options={[
            { value: "all", label: "All jurisdictions" },
            ...jurisdictions.map((j) => ({ value: j, label: j })),
          ]}
        />
      </label>
    </div>
  );
}
