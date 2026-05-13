const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
const TOKEN_KEY = "bha:supabaseAccessToken";
const USER_KEY = "bha:supabaseUser";

function authHeaders() {
  return {
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  };
}

function ensureAuthConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in the frontend .env file.");
  }
}

export function getStoredAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);

  if (!token || !rawUser) {
    return { token: null, user: null };
  }

  try {
    return { token, user: JSON.parse(rawUser) };
  } catch {
    return { token, user: null };
  }
}

export function saveAuthSession(session) {
  const token = session?.access_token;
  const user = session?.user;

  if (!token || !user) {
    return null;
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("bha-auth-change"));
  return { token, user };
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("bha-auth-change"));
}

export function captureOAuthSessionFromUrl() {
  if (!window.location.hash.includes("access_token=")) {
    return null;
  }

  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = params.get("access_token");

  if (!token) {
    return null;
  }

  const user = {
    id: params.get("user_id") ?? "supabase-user",
    email: params.get("email") ?? "Google user",
  };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  window.dispatchEvent(new Event("bha-auth-change"));
  return { token, user };
}

async function authRequest(path, body) {
  ensureAuthConfig();
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.msg ?? data?.error_description ?? data?.message ?? "Supabase auth failed");
  }

  return data;
}

export async function signInWithEmail(email, password) {
  const session = await authRequest("/auth/v1/token?grant_type=password", { email, password });
  return saveAuthSession(session);
}

export async function signUpWithEmail(email, password) {
  const session = await authRequest("/auth/v1/signup", { email, password });
  return saveAuthSession(session) ?? { token: null, user: session.user };
}

export function signInWithGoogle() {
  ensureAuthConfig();
  const redirectTo = encodeURIComponent(window.location.origin + window.location.pathname);
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`;
}

export { SUPABASE_ANON_KEY, SUPABASE_URL, TOKEN_KEY };
