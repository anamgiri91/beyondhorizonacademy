import { handleInternalLinkClick } from "../utils/links.js";

function PathCard({ path, onNavigate }) {
  return (
    <article className="path-card">
      <a href={path.href} onClick={(event) => handleInternalLinkClick(event, onNavigate)}>
        <h2>{path.title}</h2>
        <p>{path.description}</p>
        <ul>
          {path.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </a>
    </article>
  );
}

export default PathCard;
