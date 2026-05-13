import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, deleteBackendBookmark, fetchAttemptSummary, fetchBackendBookmarks, fetchQuestions, saveBackendBookmark, submitQuestionAttempt } from "../api/api.js";
import { satEnglishPractice, satPractice } from "../data/interactiveContent.js";

const QUESTION_SECONDS = 90;
const REVIEW_DELAY_MS = 2 * 24 * 60 * 60 * 1000;

const cheatSheets = {
  math: {
    title: "SAT Math Formula Sheet",
    groups: [
      {
        heading: "Lines",
        items: ["Slope: (y2 - y1) / (x2 - x1)", "Slope-intercept: y = mx + b", "Point-slope: y - y1 = m(x - x1)"],
      },
      {
        heading: "Quadratics",
        items: ["Vertex form: a(x - h)^2 + k", "Solutions: x = (-b ± sqrt(b^2 - 4ac)) / 2a", "Axis of symmetry: x = -b / 2a"],
      },
      {
        heading: "Geometry",
        items: ["Triangle area: 1/2 bh", "Circle area: pi r^2", "Right triangles: a^2 + b^2 = c^2"],
      },
      {
        heading: "Data",
        items: ["Percent change: change / original x 100", "Mean: sum / count", "Probability: favorable / total"],
      },
    ],
  },
  english: {
    title: "SAT English Strategy Sheet",
    groups: [
      {
        heading: "Evidence",
        items: ["Match the exact claim, not just the topic", "Avoid choices that add new claims", "Quantitative answers must stay within the data"],
      },
      {
        heading: "Transitions",
        items: ["Contrast: however, nevertheless, by contrast", "Addition: moreover, additionally", "Result: therefore, thus"],
      },
      {
        heading: "Grammar",
        items: ["Semicolon joins two complete sentences", "Subject-verb agreement beats nearby distractors", "Shorter is better only when meaning and grammar stay correct"],
      },
      {
        heading: "Reading",
        items: ["Main idea covers the whole text", "Inference answers are cautious", "Purpose questions ask what a sentence does"],
      },
    ],
  },
};


function buildBackendEnglishModules(questions) {
  if (!questions.length) {
    return null;
  }

  return [
    {
      domain: "Backend SAT English",
      description: "Questions loaded from the FastAPI and Supabase backend.",
      realTestTips: [
        "Use the same reasoning process as local practice.",
        "Backend attempts can power analytics once the student is signed in.",
      ],
      questionTypes: [
        {
          type: "Backend Question Set",
          description: "Live SAT English questions from the backend question table.",
          tips: ["Answer carefully.", "Review each step before moving on."],
          questions,
        },
      ],
    },
  ];
}


function AnalyticsPanel({ stats }) {
  if (!stats) {
    return (
      <div className="analytics-panel muted">
        <strong>Backend analytics</strong>
        <span>Sign in and answer backend questions to build your stats.</span>
      </div>
    );
  }

  const weakSkill = Object.entries(stats.by_skill ?? {}).sort((a, b) => {
    const aRate = a[1].correct / Math.max(a[1].total, 1);
    const bRate = b[1].correct / Math.max(b[1].total, 1);
    return aRate - bRate;
  })[0];

  return (
    <div className="analytics-panel">
      <strong>Backend analytics</strong>
      <div>
        <span>{stats.total_attempts} attempts</span>
        <span>{Math.round((stats.accuracy ?? 0) * 100)}% accuracy</span>
        <span>{weakSkill ? `Review: ${weakSkill[0]}` : "No weak area yet"}</span>
      </div>
    </div>
  );
}

function BackendStatus({ status, source, count }) {
  const label = status === "connected"
    ? "Backend connected - " + count + " question" + (count === 1 ? "" : "s")
    : status === "empty"
      ? "Backend connected - using local fallback"
      : status === "offline"
        ? "Backend offline - using local fallback"
        : "Checking backend...";

  return (
    <div className={status === "connected" ? "backend-status connected" : "backend-status"}>
      <span>{label}</span>
      <small>{source === "backend" ? API_BASE_URL : "Local practice bank"}</small>
    </div>
  );
}

function choiceLabel(index) {
  return String.fromCharCode(65 + index);
}

function questionKey(type, moduleIndex, questionTypeIndex, questionIndex, question) {
  return [type, moduleIndex, questionTypeIndex, questionIndex, question?.skill, question?.prompt?.slice(0, 48)].join(":");
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function difficultyForQuestion(question, index) {
  if (question?.difficulty) {
    return question.difficulty;
  }

  return ["Easy", "Medium", "Hard"][index % 3];
}

function solutionStepsForQuestion(question) {
  if (question?.solutionSteps?.length) {
    return question.solutionSteps;
  }

  const parts = question?.explanationParts;
  if (parts) {
    return [
      `Identify the skill: ${question.skill}.`,
      parts.whyCorrect,
      parts.intuition,
      parts.testTip,
    ];
  }

  const sentences = question?.explanation?.match(/[^.!?]+[.!?]/g) ?? [question?.explanation].filter(Boolean);
  return sentences.slice(0, 4).map((sentence) => sentence.trim());
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function ExplanationPanel({ question, visibleSteps, onRevealStep }) {
  const parts = question.explanationParts;
  const trapNotes = question.trapNotes ?? [];
  const solutionSteps = solutionStepsForQuestion(question);
  const shownSteps = solutionSteps.slice(0, visibleSteps);

  return (
    <div className="explanation-breakdown">
      <div className="solution-reveal">
        <div>
          <span>Step-by-step solution</span>
          <p>{shownSteps.length} of {solutionSteps.length} steps revealed</p>
        </div>
        <ol>
          {shownSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {visibleSteps < solutionSteps.length ? (
          <button className="lab-button secondary" type="button" onClick={onRevealStep}>
            Reveal Next Step
          </button>
        ) : null}
      </div>

      {parts ? (
        <>
          <div className="explanation-callout">
            <span>Why the answer works</span>
            <p>{parts.whyCorrect}</p>
          </div>

          <div>
            <span>Why the traps are tempting</span>
            <div className="trap-list">
              {question.choices.map((choice, index) => {
                if (index === question.answer) {
                  return null;
                }

                return (
                  <p key={choice}>
                    <strong>{choiceLabel(index)}</strong>
                    {trapNotes[index]}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="explanation-grid">
            <div>
              <span>Intuition to build</span>
              <p>{parts.intuition}</p>
            </div>
            <div>
              <span>Test-day shortcut</span>
              <p>{parts.testTip}</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function CheatSheet({ type, open, onToggle }) {
  const sheet = cheatSheets[type === "english" ? "english" : "math"];

  return (
    <aside className={open ? "formula-sheet open" : "formula-sheet"}>
      <button type="button" onClick={onToggle}>
        <span>{open ? "Hide" : "Show"}</span>
        {sheet.title}
      </button>
      {open ? (
        <div className="formula-sheet__content">
          {sheet.groups.map((group) => (
            <section key={group.heading}>
              <h3>{group.heading}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

function SatPractice({ type }) {
  const localPracticeSet = type === "english" ? satEnglishPractice : satPractice[type];
  const [backendQuestions, setBackendQuestions] = useState([]);
  const [backendStatus, setBackendStatus] = useState("checking");
  const backendPracticeSet = type === "english" ? { modules: buildBackendEnglishModules(backendQuestions) ?? [] } : backendQuestions;
  const hasBackendQuestions = backendQuestions.length > 0;
  const practiceSet = hasBackendQuestions ? backendPracticeSet : localPracticeSet;
  const modules = Array.isArray(practiceSet) ? null : practiceSet?.modules ?? [];
  const [moduleIndex, setModuleIndex] = useState(0);
  const [questionTypeIndex, setQuestionTypeIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [savedQuestions, setSavedQuestions] = useState(() => readJson("bha:savedQuestions", []));
  const [backendBookmarkIds, setBackendBookmarkIds] = useState(() => new Set());
  const [attemptSummary, setAttemptSummary] = useState(null);
  const [attempts, setAttempts] = useState(() => readJson("bha:practiceAttempts", []));
  const [sessionResults, setSessionResults] = useState([]);
  const [feedbackPulse, setFeedbackPulse] = useState(0);
  const [timedMode, setTimedMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [visibleSteps, setVisibleSteps] = useState(1);
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(true);

  useEffect(() => {
    let active = true;
    const domain = type === "english" ? "sat_english" : "sat_math";

    setBackendStatus("checking");
    fetchQuestions({ domain, limit: 50 })
      .then((questionsFromApi) => {
        if (!active) return;
        setBackendQuestions(questionsFromApi);
        setBackendStatus(questionsFromApi.length ? "connected" : "empty");
      })
      .catch(() => {
        if (!active) return;
        setBackendQuestions([]);
        setBackendStatus("offline");
      });

    return () => {
      active = false;
    };
  }, [type]);

  const activeModule = modules?.[moduleIndex];
  const activeQuestionType = activeModule?.questionTypes?.[questionTypeIndex];

  const questions = useMemo(() => {
    if (Array.isArray(practiceSet)) {
      return practiceSet;
    }

    return activeQuestionType?.questions ?? [];
  }, [activeQuestionType, practiceSet]);

  const question = questions[questionIndex];
  const activeQuestionKey = question ? questionKey(type, moduleIndex, questionTypeIndex, questionIndex, question) : "";
  const answered = selectedChoice !== null;
  const correct = selectedChoice === question?.answer;
  const difficulty = difficultyForQuestion(question, questionIndex);
  const saved = question?.backendId ? backendBookmarkIds.has(question.backendId) : savedQuestions.some((item) => item.key === activeQuestionKey);
  const answeredCount = selectedChoice === null ? questionIndex : questionIndex + 1;
  const progressPercent = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;

  const dueReviewIndexes = useMemo(() => {
    const now = Date.now();
    return questions.reduce((indexes, currentQuestion, index) => {
      const key = questionKey(type, moduleIndex, questionTypeIndex, index, currentQuestion);
      const missedAttempt = attempts.find((attempt) => attempt.key === key && !attempt.correct && now - new Date(attempt.attemptedAt).getTime() >= REVIEW_DELAY_MS);
      return missedAttempt ? [...indexes, index] : indexes;
    }, []);
  }, [attempts, moduleIndex, questionTypeIndex, questions, type]);

  useEffect(() => {
    localStorage.setItem("bha:savedQuestions", JSON.stringify(savedQuestions));
  }, [savedQuestions]);

  useEffect(() => {
    let active = true;

    async function loadStudentData() {
      try {
        const [bookmarks, summary] = await Promise.all([
          fetchBackendBookmarks(),
          fetchAttemptSummary(),
        ]);

        if (!active) return;
        setBackendBookmarkIds(new Set((bookmarks ?? []).map((bookmark) => bookmark.question_id)));
        setAttemptSummary(summary);
      } catch {
        if (!active) return;
        setBackendBookmarkIds(new Set());
        setAttemptSummary(null);
      }
    }

    loadStudentData();

    function refreshStudentData() {
      loadStudentData();
    }

    window.addEventListener("bha-auth-change", refreshStudentData);
    return () => {
      active = false;
      window.removeEventListener("bha-auth-change", refreshStudentData);
    };
  }, [feedbackPulse]);


  useEffect(() => {
    localStorage.setItem("bha:practiceAttempts", JSON.stringify(attempts.slice(-120)));
  }, [attempts]);

  useEffect(() => {
    setSelectedChoice(null);
    setTimeLeft(QUESTION_SECONDS);
    setVisibleSteps(1);
  }, [activeQuestionKey]);

  useEffect(() => {
    if (!timedMode || answered || !questions.length) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          answerQuestion(-1, true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [answered, activeQuestionKey, timedMode, questions.length]);

  if (!questions.length) {
    return null;
  }

  function resetForNavigation(index) {
    setQuestionIndex(index);
    setSelectedChoice(null);
    setTimeLeft(QUESTION_SECONDS);
    setVisibleSteps(1);
  }

  function changeModule(index) {
    setModuleIndex(index);
    setQuestionTypeIndex(0);
    resetForNavigation(0);
    setReviewMode(false);
  }

  function changeQuestionType(index) {
    setQuestionTypeIndex(index);
    resetForNavigation(0);
    setReviewMode(false);
  }

  function recordAttempt(choiceIndex, timedOut = false) {
    const isCorrect = choiceIndex === question.answer;
    const timeSpentSeconds = timedOut ? QUESTION_SECONDS : QUESTION_SECONDS - timeLeft;
    const attempt = {
      key: activeQuestionKey,
      type,
      skill: question.skill,
      difficulty,
      correct: isCorrect,
      timedOut,
      selectedChoice: choiceIndex,
      timeSpentSeconds,
      attemptedAt: new Date().toISOString(),
    };

    setAttempts((current) => [...current.filter((item) => item.key !== activeQuestionKey), attempt].slice(-120));
    setSessionResults((current) => [...current, { correct: isCorrect, difficulty }].slice(-8));

    submitQuestionAttempt({
      questionId: question.backendId,
      selectedChoiceIndex: choiceIndex,
      timeSpentSeconds,
    }).catch(() => {
      // Keep local practice smooth if auth/backend submission is not ready yet.
    });
  }

  function answerQuestion(index, timedOut = false) {
    if (selectedChoice !== null || !question) {
      return;
    }

    setSelectedChoice(index);
    setFeedbackPulse((current) => current + 1);
    recordAttempt(index, timedOut);
  }

  function targetDifficulty() {
    const recent = sessionResults.slice(-3);

    if (recent.length < 3) {
      return null;
    }

    if (recent.every((result) => result.correct)) {
      return "Hard";
    }

    if (recent.filter((result) => !result.correct).length >= 2) {
      return "Easy";
    }

    return "Medium";
  }

  function findNextAdaptiveIndex() {
    if (reviewMode && dueReviewIndexes.length) {
      const nextDue = dueReviewIndexes.find((index) => index > questionIndex) ?? dueReviewIndexes[0];
      return nextDue;
    }

    const target = adaptiveMode ? targetDifficulty() : null;

    if (!target) {
      return (questionIndex + 1) % questions.length;
    }

    const orderedIndexes = [...questions.keys()].map((_, offset) => (questionIndex + 1 + offset) % questions.length);
    return orderedIndexes.find((index) => difficultyForQuestion(questions[index], index) === target) ?? (questionIndex + 1) % questions.length;
  }

  function nextQuestion() {
    resetForNavigation(findNextAdaptiveIndex());
  }

  function toggleSavedQuestion() {
    if (question.backendId) {
      const nextSaved = !backendBookmarkIds.has(question.backendId);
      setBackendBookmarkIds((current) => {
        const next = new Set(current);
        if (nextSaved) {
          next.add(question.backendId);
        } else {
          next.delete(question.backendId);
        }
        return next;
      });

      const action = nextSaved ? saveBackendBookmark : deleteBackendBookmark;
      action(question.backendId).catch(() => {
        setBackendBookmarkIds((current) => {
          const next = new Set(current);
          if (nextSaved) {
            next.delete(question.backendId);
          } else {
            next.add(question.backendId);
          }
          return next;
        });
      });
      return;
    }

    setSavedQuestions((current) => {
      if (current.some((item) => item.key === activeQuestionKey)) {
        return current.filter((item) => item.key !== activeQuestionKey);
      }

      return [
        ...current,
        {
          key: activeQuestionKey,
          type,
          skill: question.skill,
          label: question.style ?? question.domain,
          prompt: question.prompt,
          savedAt: new Date().toISOString(),
        },
      ];
    });
  }

  function startReviewMode() {
    if (!dueReviewIndexes.length) {
      return;
    }

    setReviewMode(true);
    resetForNavigation(dueReviewIndexes[0]);
  }

  const practiceControls = (
    <div className="practice-mode-panel">
      <button className={timedMode ? "active" : ""} type="button" onClick={() => setTimedMode((current) => !current)}>
        Timed Mode · {timedMode ? "On" : "Off"}
      </button>
      <button className={adaptiveMode ? "active" : ""} type="button" onClick={() => setAdaptiveMode((current) => !current)}>
        Adaptive · {adaptiveMode ? "On" : "Off"}
      </button>
      <button className={reviewMode ? "active" : ""} type="button" onClick={startReviewMode} disabled={!dueReviewIndexes.length}>
        Review Due · {dueReviewIndexes.length}
      </button>
      <span className={timeLeft <= 15 && timedMode && !answered ? "timer urgent" : "timer"}>{timedMode ? formatTime(timeLeft) : "Untimed"}</span>
      <span className="difficulty-pill">{difficulty}</span>
    </div>
  );

  const questionBody = (
    <article className={["question-card", answered ? (correct ? "answer-correct" : "answer-wrong") : ""].join(" ")} key={`${activeQuestionKey}:${feedbackPulse}`}>
      <div className="question-card__header">
        <span>{question.style ?? question.domain}</span>
        <strong>{question.skill}</strong>
      </div>

      <div className="question-tools">
        <p className="question-prompt">{question.prompt}</p>
        <button className={saved ? "save-question saved" : "save-question"} type="button" onClick={toggleSavedQuestion}>
          <span aria-hidden="true">{saved ? "★" : "☆"}</span>
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      <div className={modules ? "choice-grid enhanced" : "choice-grid"}>
        {question.choices.map((choice, index) => {
          const isSelected = selectedChoice === index;
          const isCorrect = answered && index === question.answer;
          const isWrong = answered && isSelected && !isCorrect;

          return (
            <button
              key={choice}
              className={[isSelected ? "selected" : "", isCorrect ? "correct-choice" : "", isWrong ? "wrong-choice" : ""].join(" ")}
              type="button"
              onClick={() => answerQuestion(index)}
            >
              <span>{choiceLabel(index)}</span>
              {choice}
            </button>
          );
        })}
      </div>

      {answered ? (
        <div className={correct ? "feedback correct" : "feedback incorrect"}>
          <strong>{correct ? "Correct. Now lock in the reasoning." : selectedChoice === -1 ? "Time expired. Review the steps." : "Not quite. Use the trap check."}</strong>
          <ExplanationPanel
            question={question}
            visibleSteps={visibleSteps}
            onRevealStep={() => setVisibleSteps((current) => Math.min(current + 1, solutionStepsForQuestion(question).length))}
          />
        </div>
      ) : (
        <div className="thinking-reminder">
          <strong>Before choosing</strong>
          <p>Name the skill, predict what the answer must do, then compare choices.</p>
        </div>
      )}

      <div className="practice-actions">
        <button
          className="lab-button secondary"
          type="button"
          onClick={() => resetForNavigation(Math.max(questionIndex - 1, 0))}
          disabled={questionIndex === 0}
        >
          Previous
        </button>
        <button className="lab-button" type="button" onClick={nextQuestion}>
          {adaptiveMode ? "Next Adaptive Question" : "Next Question"}
        </button>
      </div>
    </article>
  );

  if (modules) {
    return (
      <section className="practice-shell with-formulas">
        <aside className="practice-sidebar" aria-label="English practice navigation">
          <div className="practice-sidebar__header">
            <p className="eyebrow">SAT English</p>
            <h2>Skill Practice</h2>
            <span>{questions.length} questions in this set</span>
          </div>

          <div className="saved-question-count" aria-label="Saved questions">
            <strong>{savedQuestions.length}</strong>
            <span>saved for review</span>
          </div>

          <div className="practice-domain-list">
            {modules.map((module, index) => (
              <button
                key={module.domain}
                className={index === moduleIndex ? "active" : ""}
                type="button"
                onClick={() => changeModule(index)}
              >
                <span>{index + 1}</span>
                {module.domain}
              </button>
            ))}
          </div>

          <div className="practice-type-list">
            <h3>Question Type</h3>
            {activeModule.questionTypes.map((questionType, index) => (
              <button
                key={questionType.type}
                className={index === questionTypeIndex ? "active" : ""}
                type="button"
                onClick={() => changeQuestionType(index)}
              >
                {questionType.type}
                <span>{questionType.questions.length} questions</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="practice-workspace">
          <div className="practice-topbar">
            <div>
              <p className="eyebrow">{activeModule.domain}</p>
              <h2>{activeQuestionType.type}</h2>
            </div>
            <div className="practice-progress" aria-label="Question progress">
              <span>
                {questionIndex + 1}/{questions.length} · {progressPercent}% complete
              </span>
              <div>
                <i style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          <BackendStatus status={backendStatus} source={hasBackendQuestions ? "backend" : "local"} count={backendQuestions.length} />
          <AnalyticsPanel stats={attemptSummary} />

          {practiceControls}

          <div className="practice-guidance">
            <p>{activeQuestionType.description}</p>
            <ul>
              {activeQuestionType.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>

          {questionBody}

          <div className="practice-strategy-panel">
            <h3>Real-test mindset</h3>
            <ul>
              {activeModule.realTestTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        <CheatSheet type="english" open={cheatSheetOpen} onToggle={() => setCheatSheetOpen((current) => !current)} />
      </section>
    );
  }

  return (
    <section className="math-practice-layout">
      <CheatSheet type="math" open={cheatSheetOpen} onToggle={() => setCheatSheetOpen((current) => !current)} />

      <div>
        <section className="interactive-card sat-question-practice">
          <div className="interactive-card__header">
            <p className="eyebrow">SAT Practice</p>
            <h2>Math Question Practice</h2>
            <span>{question.domain} • {question.skill}</span>
          </div>

          <div className="practice-progress compact" aria-label="Question progress">
            <span>
              Question {questionIndex + 1} of {questions.length} · {progressPercent}% complete
            </span>
            <div>
              <i style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <BackendStatus status={backendStatus} source={hasBackendQuestions ? "backend" : "local"} count={backendQuestions.length} />
          <AnalyticsPanel stats={attemptSummary} />

          {practiceControls}
          {questionBody}
        </section>
      </div>
    </section>
  );
}

export default SatPractice;
