import CourseCard from "../components/CourseCard.jsx";
import { courseList } from "../data/courseCatalog.js";

function Courses({ onNavigate }) {
  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Course catalog</p>
        <h1>Learn SAT and computer science topics in one place</h1>
        <p>
          Each course is structured as a lesson viewer with modules, outcomes, strategy notes, and practice tools.
        </p>
      </div>

      <div className="course-grid">
        {courseList.map((course) => (
          <CourseCard
            key={course.slug}
            title={course.title}
            description={course.summary}
            image={course.image}
            href={course.href}
            meta={course.category}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}

export default Courses;
