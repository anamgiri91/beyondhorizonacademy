import CourseCard from "../components/CourseCard.jsx";
import PathCard from "../components/PathCard.jsx";
import StatStrip from "../components/StatStrip.jsx";
import { courseList } from "../data/courseCatalog.js";
import {
  learningPaths,
  learningWorkflow,
  platformFeatures,
  projectShowcase,
  roadmapItems,
  stats,
} from "../data/siteData.js";
import { handleInternalLinkClick } from "../utils/links.js";

function Home({ onNavigate }) {
  const featuredCourses = courseList.slice(0, 4);

  return (
    <>
      <section className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <p className="eyebrow">SAT and Computer Science Learning Platform</p>
          <h1>Learn with structured lessons, active practice, and visual-first explanations.</h1>
          <p>
            Beyond Horizon Academy is a frontend-first learning dashboard for SAT prep and
            computer science foundations, built around clear thinking, visual tools, and modular
            practice that can grow into a full-stack product.
          </p>

          <div className="hero-actions">
            <a href="/courses" onClick={(event) => handleInternalLinkClick(event, onNavigate)}>
              Explore Courses
            </a>
            <a href="/english" onClick={(event) => handleInternalLinkClick(event, onNavigate)}>
              Try SAT Practice
            </a>
          </div>
        </div>

        <div className="dashboard-hero__media hero-product-card" aria-label="Product preview">
          <div className="product-window">
            <div className="product-window__bar">
              <span />
              <span />
              <span />
            </div>
            <div className="product-window__body">
              <div className="product-sidebar-preview">
                <strong>SAT English</strong>
                <span className="active">Mixed Practice</span>
                <span>Information and Ideas</span>
                <span>Grammar</span>
              </div>
              <div className="product-main-preview">
                <span className="preview-pill">Question 7 of 20</span>
                <h2>Why is this answer correct?</h2>
                <p>
                  Students see the reasoning, the trap answers, and the shortcut they should reuse
                  on the real test.
                </p>
                <div className="preview-answer-grid">
                  <span />
                  <span />
                  <span className="correct" />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatStrip stats={stats} />

      <section className="page-section">
        <div className="section-heading">
          <p className="eyebrow">Product focus</p>
          <h2>Built like a real learning product</h2>
          <p>
            The first version emphasizes frontend quality: clear information architecture,
            polished interactions, reusable components, and learning experiences recruiters can
            understand quickly.
          </p>
        </div>
        <div className="feature-grid">
          {platformFeatures.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div>
                <span>{feature.metric}</span>
                <small>{feature.label}</small>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <p className="eyebrow">Learning paths</p>
          <h2>Choose a focused track</h2>
        </div>
        <div className="path-grid">
          {learningPaths.map((path) => (
            <PathCard key={path.href} path={path} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      <section className="page-section workflow-section">
        <div className="section-heading">
          <p className="eyebrow">Student workflow</p>
          <h2>From mistake to reusable intuition</h2>
        </div>
        <div className="workflow-grid">
          {learningWorkflow.map((item) => (
            <article className="workflow-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <p className="eyebrow">Course catalog</p>
          <h2>Start with a core course</h2>
        </div>
        <div className="course-grid compact">
          {featuredCourses.map((course) => (
            <CourseCard
              key={course.slug}
              title={course.title}
              description={course.summary}
              image={course.image}
              href={course.href}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      <section className="page-section showcase-section">
        <div className="showcase-panel">
          <div>
            <p className="eyebrow">Project showcase</p>
            <h2>What this demonstrates</h2>
            <ul className="showcase-list">
              {projectShowcase.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Next build phase</p>
            <h2>Full-stack roadmap</h2>
            <ul className="showcase-list roadmap-list">
              {roadmapItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
