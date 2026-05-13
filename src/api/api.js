const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
const TOKEN_STORAGE_KEYS = ["bha:supabaseAccessToken", "supabase.auth.token"];

function choiceIndexToLetter(index) {
  return String.fromCharCode(65 + index);
}

function answerLetterToIndex(letter) {
  return ["A", "B", "C", "D"].indexOf(letter);
}

export function getStoredAccessToken() {
  for (const key of TOKEN_STORAGE_KEYS) {
    const value = localStorage.getItem(key);

    if (!value) {
      continue;
    }

    try {
      const parsed = JSON.parse(value);
      const token = parsed?.access_token ?? parsed?.currentSession?.access_token;
      if (token) {
        return token;
      }
    } catch {
      return value;
    }
  }

  return null;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export function toPracticeQuestion(question) {
  const choices = ["A", "B", "C", "D"].map((letter) => question.choices?.[letter] ?? "");
  const answer = answerLetterToIndex(question.correct_answer);

  return {
    backendId: question.id,
    backendSource: true,
    domain: question.domain === "sat_math" ? "SAT Math" : "SAT English",
    skill: question.skill,
    prompt: question.prompt,
    choices,
    answer: answer >= 0 ? answer : 0,
    explanation: question.explanation ?? "Review the solution steps and compare them with your selected answer.",
    solutionSteps: question.solution_steps ?? [],
    difficulty: question.difficulty ? question.difficulty[0].toUpperCase() + question.difficulty.slice(1) : "Medium",
    style: question.source_label ? `Backend - ${question.source_label}` : "Backend question",
  };
}

export async function checkApiHealth() {
  return request("/health");
}

export async function fetchQuestions({ domain, topic, difficulty, limit = 25 }) {
  const params = new URLSearchParams({ limit: String(limit) });

  if (domain) params.set("domain", domain);
  if (topic) params.set("topic", topic);
  if (difficulty) params.set("difficulty", difficulty);

  const questions = await request(`/questions?${params.toString()}`);
  return questions.map(toPracticeQuestion);
}

export async function submitQuestionAttempt({ questionId, selectedChoiceIndex, timeSpentSeconds }) {
  const token = getStoredAccessToken();

  if (!token || !questionId || selectedChoiceIndex < 0) {
    return { skipped: true };
  }

  return request("/questions/submit", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      question_id: questionId,
      selected_answer: choiceIndexToLetter(selectedChoiceIndex),
      time_spent_seconds: timeSpentSeconds,
    }),
  });
}


function authHeaders() {
  const token = getStoredAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchAttemptSummary() {
  if (!getStoredAccessToken()) {
    return null;
  }

  return request("/progress/attempt-summary", {
    headers: authHeaders(),
  });
}

export async function fetchLearningAnalytics() {
  if (!getStoredAccessToken()) {
    return null;
  }

  return request("/progress/analytics", {
    headers: authHeaders(),
  });
}

export async function fetchBackendBookmarks() {
  if (!getStoredAccessToken()) {
    return [];
  }

  return request("/user/bookmarks", {
    headers: authHeaders(),
  });
}

export async function saveBackendBookmark(questionId) {
  if (!getStoredAccessToken() || !questionId) {
    return { skipped: true };
  }

  return request("/user/bookmarks", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ question_id: questionId }),
  });
}

export async function deleteBackendBookmark(questionId) {
  if (!getStoredAccessToken() || !questionId) {
    return { skipped: true };
  }

  return request(`/user/bookmarks/${questionId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}


export { API_BASE_URL };
