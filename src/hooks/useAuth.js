import { useEffect, useState } from "react";
import { captureOAuthSessionFromUrl, clearAuthSession, getStoredAuth } from "../api/auth.js";

function useAuth() {
  const [auth, setAuth] = useState(() => getStoredAuth());

  useEffect(() => {
    const oauthSession = captureOAuthSessionFromUrl();
    if (oauthSession) {
      setAuth(oauthSession);
    }

    function syncAuth() {
      setAuth(getStoredAuth());
    }

    window.addEventListener("bha-auth-change", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("bha-auth-change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  function signOut() {
    clearAuthSession();
    setAuth({ token: null, user: null });
  }

  return {
    ...auth,
    signedIn: Boolean(auth.token),
    signOut,
  };
}

export default useAuth;
