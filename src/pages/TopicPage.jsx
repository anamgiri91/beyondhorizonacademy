import CourseCard from "../components/CourseCard.jsx";
import { computerScienceCourses, satCourses } from "../data/courseCatalog.js";

const topicContent = {
  sat: {
    eyebrow: "SAT track",
    title: "SAT Prep Dashboard",
    description:
      "Build math and reading skills with focused lessons, practice strategy, and clear explanations.",
    courses: satCourses,
  },
  computerScience: {
    eyebrow: "Computer science track",
    title: "Computer Science Dashboard",
    description:
      "Learn programming and data structures with modular lessons that are ready for future visualizations.",
    courses: computerScienceCourses,
  },
};

function TopicPage({ topic, onNavigate }) {
  const content = topicContent[topic];

  if (!content) {
    return null;
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </div>

      <div className="course-grid">
        {content.courses.map((course) => (
          <CourseCard
            key={course.slug}
            title={course.title}
            description={course.summary}
            image={course.image}
            href={course.href}
            meta={course.level}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}

export default TopicPage;
