import { Link } from "react-router-dom";
import { IconChevron } from "./Icon";

const USER = {
  initials: "DP",
  name: "Deep Patel",
  company: "Sunshine Installer LLC (Test)",
};

/** Global top navigation — fixed across every screen. */
export default function NavBar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <span className="nav-logo" aria-hidden="true">
            <svg viewBox="0 0 32 32" className="nav-logo-mark">
              <path
                d="M0 24L6.295 20.043L4.372 12.645L11.716 14.366L15.738 8L19.934 14.366L27.104 12.645L25.53 20.043L32 24H23.774C23.779 23.886 23.781 23.771 23.781 23.656C23.781 19.38 20.258 15.914 15.913 15.914C11.567 15.914 8.044 19.38 8.044 23.656C8.044 23.771 8.046 23.886 8.051 24H0Z"
                fill="#fff"
              />
            </svg>
          </span>
          <span className="nav-title">Virtual Inspection</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-pill nav-pill-active">
            Projects
          </Link>
        </nav>

        <button type="button" className="nav-user">
          <span className="nav-avatar">{USER.initials}</span>
          <span className="nav-user-text">
            <span className="nav-user-name">{USER.name}</span>
            <span className="nav-user-company">{USER.company}</span>
          </span>
          <IconChevron className="nav-user-caret" />
        </button>
      </div>
    </header>
  );
}
