import { handleInternalLinkClick, isExternalLink } from "../utils/links.js";

function CourseCard({ title, description, image, href, meta, onNavigate }) {
  const external = isExternalLink(href);

  return (
    <article className="course-card">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        onClick={external ? undefined : (event) => handleInternalLinkClick(event, onNavigate)}
      >
        <img src={image} alt="" className="course-card__image" />
        <div className="course-card__body">
          {meta ? <span className="card-meta">{meta}</span> : null}
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </a>
    </article>
  );
}

export default CourseCard;
