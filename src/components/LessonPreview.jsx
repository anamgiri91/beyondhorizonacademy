function LessonPreview({ lesson, index }) {
  return (
    <article className="lesson-preview">
      <span>Lesson {index + 1}</span>
      <h3>{lesson.title}</h3>
      <p>{lesson.focus}</p>
    </article>
  );
}

export default LessonPreview;
