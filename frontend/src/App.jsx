import { useEffect, useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import MusicSearchPage from "./pages/MusicSearchPage";
import { getProfile, refreshSession, validateSession } from "./services/api";
import {
  captureCallbackToken,
  getStoredToken,
  removeStoredToken,
  saveToken,
} from "./services/auth";

function App() {
  const [token, setToken] = useState(
    () => captureCallbackToken() || getStoredToken(),
  );

  const [authStatus, setAuthStatus] = useState(
    token ? "checking" : "signedOut",
  );

  const [user, setUser] = useState(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isCancelled = false;

    async function checkAuthentication() {
      try {
        const [sessionData, profileData] = await Promise.all([
          validateSession(token),
          getProfile(token),
        ]);

        if (!isCancelled) {
          setUser(profileData.user);
          setSessionExpiresAt(new Date(sessionData.expiresAt).getTime());
          setAuthStatus("authenticated");
        }
      } catch (error) {
        console.error("Authentication check failed:", error.message);
        removeStoredToken();

        if (!isCancelled) {
          setToken(null);
          setUser(null);
          setSessionExpiresAt(null);
          setAuthStatus("signedOut");
        }
      }
    }

    checkAuthentication();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (authStatus !== "authenticated" || !token || !sessionExpiresAt) {
      return;
    }

    const fiveMinutes = 5 * 60 * 1000;
    const refreshDelay = Math.max(
      sessionExpiresAt - Date.now() - fiveMinutes,
      0,
    );

    const refreshTimer = window.setTimeout(async () => {
      try {
        const data = await refreshSession(token);

        saveToken(data.token);
        setAuthStatus("checking");
        setToken(data.token);
      } catch (error) {
        console.error("Session refresh failed:", error.message);
        removeStoredToken();
        setToken(null);
        setUser(null);
        setSessionExpiresAt(null);
        setAuthStatus("signedOut");
      }
    }, refreshDelay);

    return () => {
      window.clearTimeout(refreshTimer);
    };
  }, [authStatus, sessionExpiresAt, token]);

  function handleSignOut() {
    removeStoredToken();
    setToken(null);
    setUser(null);
    setSessionExpiresAt(null);
    setAuthStatus("signedOut");
  }

  if (authStatus === "checking") {
    return (
      <main className="login-page">
        <section className="login-card">
          <p className="login-label">JB MUSIC SEARCH</p>
          <h1>Checking your session...</h1>
        </section>
      </main>
    );
  }

  if (authStatus === "authenticated") {
    return (
      <MusicSearchPage token={token} user={user} onSignOut={handleSignOut} />
    );
  }

  return <LoginPage />;
}

export default App;
