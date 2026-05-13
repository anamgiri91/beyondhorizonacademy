import { useEffect, useMemo, useState } from "react";
import InteractiveLab from "../components/InteractiveLab.jsx";
import LessonPreview from "../components/LessonPreview.jsx";
import { courseCatalog } from "../data/courseCatalog.js";
import { handleInternalLinkClick } from "../utils/links.js";

function readCompletedLessons(courseKey) {
  try {
    return JSON.parse(localStorage.getItem(`bha:${courseKey}:completedLessons`) ?? "[]");
  } catch {
    return [];
  }
}

function CourseProgressRing({ value }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (value / 100) * circumference;

  return (
    <div className="course-progress-ring" aria-label={`Overall course progress ${value}%`}>
      <svg viewBox="0 0 104 104" role="img" aria-hidden="true">
        <circle className="ring-track" cx="52" cy="52" r={radius} />
        <circle
          className="ring-value"
          cx="52"
          cy="52"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div>
        <strong>{value}%</strong>
        <span>complete</span>
      </div>
    </div>
  );
}

function CourseDetail({ page, onNavigate }) {
  const course = courseCatalog[page];
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(() => readCompletedLessons(page));

  const completedSet = useMemo(() => new Set(completedLessons), [completedLessons]);

  useEffect(() => {
    setActiveLessonIndex(0);
    setCompletedLessons(readCompletedLessons(page));
  }, [page]);

  if (!course) {
    return null;
  }

  const activeLesson = course.lessons[activeLessonIndex];
  const activeLessonComplete = completedSet.has(activeLessonIndex);
  const overallProgress = Math.round((completedSet.size / course.lessons.length) * 100);
  const activeLessonProgress = activeLessonComplete ? 100 : 35;

  function toggleLessonComplete() {
    setCompletedLessons((current) => {
      const nextSet = new Set(current);

      if (nextSet.has(activeLessonIndex)) {
        nextSet.delete(activeLessonIndex);
      } else {
        nextSet.add(activeLessonIndex);
      }

      const next = [...nextSet].sort((a, b) => a - b);
      localStorage.setItem(`bha:${page}:completedLessons`, JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="course-detail">
      <div className="course-detail__header">
        <a href="/courses" onClick={(event) => handleInternalLinkClick(event, onNavigate)}>
          Back to Catalog
        </a>
        <p className="eyebrow">{course.category}</p>
        <h1>{course.title}</h1>
        <p>{course.summary}</p>

        <div className="course-meta" aria-label="Course details">
          <span>{course.level}</span>
          <span>{course.duration}</span>
        </div>
      </div>

      <div className="course-progress-panel">
        <CourseProgressRing value={overallProgress} />
        <div className="course-progress-copy">
          <div>
            <p className="eyebrow">Progress tracking</p>
            <h2>{completedSet.size} of {course.lessons.length} lessons complete</h2>
          </div>
          <div className="course-progress-bar" aria-label={`Course progress ${overallProgress}%`}>
            <span style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      <div className="tag-list" aria-label="Best for">
        {course.bestFor.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="lesson-viewer">
        <aside className="lesson-sidebar" aria-label="Lessons">
          {course.lessons.map((lesson, index) => {
            const lessonComplete = completedSet.has(index);
            const lessonPercent = lessonComplete ? 100 : index === activeLessonIndex ? activeLessonProgress : 0;

            return (
              <button
                key={lesson.title}
                className={[index === activeLessonIndex ? "active" : "", lessonComplete ? "complete" : ""].join(" ")}
                type="button"
                onClick={() => setActiveLessonIndex(index)}
              >
                <span className="lesson-row-label">
                  Lesson {index + 1}
                  <i>{lessonComplete ? "✓" : `${lessonPercent}%`}</i>
                </span>
                {lesson.title}
                <b aria-hidden="true"><em style={{ width: `${lessonPercent}%` }} /></b>
              </button>
            );
          })}
        </aside>

        <article className="lesson-panel">
          <div className="lesson-panel__topline">
            <div>
              <p className="eyebrow">Lesson {activeLessonIndex + 1}</p>
              <h2>{activeLesson.title}</h2>
            </div>
            <span className={activeLessonComplete ? "lesson-badge complete" : "lesson-badge"}>
              {activeLessonComplete ? "Completed" : `${activeLessonProgress}% viewed`}
            </span>
          </div>
          <p>{activeLesson.focus}</p>
          <div className="lesson-progress-bar" aria-label={`Active lesson progress ${activeLessonProgress}%`}>
            <span style={{ width: `${activeLessonProgress}%` }} />
          </div>
          <div className="activity-callout">
            <strong>Active learning idea</strong>
            <span>{activeLesson.activity}</span>
          </div>
          <button className="lesson-complete-button" type="button" onClick={toggleLessonComplete}>
            {activeLessonComplete ? "Mark as Incomplete" : "Mark Lesson Complete"}
          </button>
        </article>
      </div>

      <InteractiveLab courseSlug={page} />

      <div className="course-detail__grid">
        <section className="detail-panel">
          <h2>Course Roadmap</h2>
          <div className="lesson-preview-grid">
            {course.lessons.map((lesson, index) => (
              <div className={completedSet.has(index) ? "roadmap-complete" : ""} key={lesson.title}>
                <LessonPreview lesson={lesson} index={index} />
              </div>
            ))}
          </div>
        </section>

        <section className="detail-panel">
          <h2>Learning Outcomes</h2>
          <ul className="outcome-list">
            {course.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>

          <div className="study-note">
            <strong>Study note</strong>
            <p>{course.studyNote}</p>
          </div>
        </section>
      </div>
    </section>
  );
}

export default CourseDetail;
