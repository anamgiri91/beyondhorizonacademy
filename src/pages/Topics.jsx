import PathCard from "../components/PathCard.jsx";
import { learningPaths, satResources } from "../data/siteData.js";

function Topics({ onNavigate }) {
  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Topic library</p>
        <h1>Two learning areas, one reliable foundation</h1>
        <p>
          Topics organize the course catalog by learning goal, so future visualizations and quizzes can fit into a clear structure.
        </p>
      </div>

      <div className="path-grid">
        {learningPaths.map((path) => (
          <PathCard key={path.href} path={path} onNavigate={onNavigate} />
        ))}
      </div>

      <section className="resource-section embedded">
        <h2>SAT Study Links</h2>
        <ul>
          {satResources.map((resource) => (
            <li key={resource.label}>
              <a href={resource.href} target="_blank" rel="noreferrer">
                {resource.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default Topics;
