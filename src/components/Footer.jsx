import { navLinks, projectShowcase, roadmapItems } from "../data/siteData.js";
import { handleInternalLinkClick } from "../utils/links.js";

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <div className="footer-logo-row">
          <img src="/logo.jpeg" alt="Beyond Horizon Academy logo" />
          <div>
            <strong>Beyond Horizon Academy</strong>
            <span>Frontend-first learning platform</span>
          </div>
        </div>
        <p>
          A polished React dashboard for SAT prep and computer science learning, designed to grow
          into a full-stack product with progress tracking, analytics, and adaptive practice.
        </p>
      </div>

      <div className="site-footer__column">
        <h2>Navigate</h2>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={(event) => handleInternalLinkClick(event, onNavigate)}>
            {link.label}
          </a>
        ))}
      </div>

      <div className="site-footer__column">
        <h2>Built To Show</h2>
        {projectShowcase.slice(0, 3).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="site-footer__column">
        <h2>Next Phase</h2>
        {roadmapItems.slice(0, 3).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
