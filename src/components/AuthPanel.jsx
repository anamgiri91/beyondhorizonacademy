import { useState } from "react";
import { signInWithEmail, signInWithGoogle, signUpWithEmail, SUPABASE_ANON_KEY, SUPABASE_URL } from "../api/auth.js";

function AuthPanel({ auth }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const configured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

  async function submit(event) {
    event.preventDefault();
    setStatus("Working...");

    try {
      if (mode === "signup") {
        await signUpWithEmail(email, password);
        setStatus("Account created. Check your email if confirmation is enabled.");
      } else {
        await signInWithEmail(email, password);
        setStatus("Signed in.");
        setOpen(false);
      }
    } catch (error) {
      setStatus(error.message);
    }
  }

  if (auth.signedIn) {
    return (
      <div className="auth-chip">
        <span>{auth.user?.email ?? "Signed in"}</span>
        <button type="button" onClick={auth.signOut}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="auth-panel">
      <button className="auth-open" type="button" onClick={() => setOpen((current) => !current)}>
        Sign in
      </button>

      {open ? (
        <div className="auth-popover">
          <strong>Student Login</strong>
          <p>{configured ? "Save attempts, bookmarks, and progress." : "Add frontend Supabase keys to enable login."}</p>

          <form onSubmit={submit}>
            <input
              aria-label="Email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={!configured}
            />
            <input
              aria-label="Password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={!configured}
            />
            <button type="submit" disabled={!configured}>{mode === "signup" ? "Create account" : "Sign in"}</button>
          </form>

          <div className="auth-actions">
            <button type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")} disabled={!configured}>
              {mode === "signup" ? "Use existing account" : "Create account"}
            </button>
            <button type="button" onClick={signInWithGoogle} disabled={!configured}>
              Continue with Google
            </button>
          </div>

          {status ? <span className="auth-status">{status}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

export default AuthPanel;
