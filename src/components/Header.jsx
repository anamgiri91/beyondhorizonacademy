import AuthPanel from "./AuthPanel.jsx";
import { navLinks } from "../data/siteData.js";
import { handleInternalLinkClick } from "../utils/links.js";

function Header({ auth, darkTheme, onNavigate, onToggleTheme }) {
  return (
    <header className="site-header">
      <a className="brand" href="/about" onClick={(event) => handleInternalLinkClick(event, onNavigate)}>
        <img src="/logo.jpeg" alt="Beyond Horizon Academy logo" />
        <span>Beyond Horizon Academy</span>
      </a>

      <nav aria-label="Main navigation">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(event) => handleInternalLinkClick(event, onNavigate)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <AuthPanel auth={auth} />

      <button
        className="theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-pressed={darkTheme}
        aria-label={darkTheme ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span aria-hidden="true">{darkTheme ? "☀" : "◐"}</span>
        {darkTheme ? "Light" : "Dark"}
      </button>
    </header>
  );
}

export default Header;
