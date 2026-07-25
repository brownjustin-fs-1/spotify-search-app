import { useEffect, useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import { validateSession } from "./services/api";
import {
  captureCallbackToken,
  getStoredToken,
  removeStoredToken,
} from "./services/auth";

function App() {
  const [token, setToken] = useState(
    () => captureCallbackToken() || getStoredToken(),
  );

  const [authStatus, setAuthStatus] = useState(
    token ? "checking" : "signedOut",
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    let isCancelled = false;

    async function checkAuthentication() {
      try {
        await validateSession(token);

        if (!isCancelled) {
          setAuthStatus("authenticated");
        }
      } catch (error) {
        console.error("Authentication check failed:", error.message);
        removeStoredToken();

        if (!isCancelled) {
          setToken(null);
          setAuthStatus("signedOut");
        }
      }
    }

    checkAuthentication();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  function handleSignOut() {
    removeStoredToken();
    setToken(null);
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
      <main className="login-page">
        <section className="login-card">
          <p className="login-label">JB MUSIC SEARCH</p>
          <h1>Authentication verified.</h1>

          <p className="login-description">
            Your JWT and database session are both valid.
          </p>

          <button
            className="google-login-button"
            type="button"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </section>
      </main>
    );
  }

  return <LoginPage />;
}

export default App;
