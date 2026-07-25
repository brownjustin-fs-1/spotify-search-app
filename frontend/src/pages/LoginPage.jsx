import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function getAuthenticationError() {
  const parameters = new URLSearchParams(window.location.search);
  const errorType = parameters.get("authError");

  if (errorType === "google") {
    return "Google could not complete the sign-in. Please try again.";
  }

  if (errorType === "session") {
    return "Your authentication session could not be created. Please try again.";
  }

  return "";
}

function LoginPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const authenticationError = getAuthenticationError();

  function handleGoogleLogin() {
    setIsRedirecting(true);
    window.location.assign(`${API_URL}/auth/google`);
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="login-label">JB MUSIC SEARCH</p>

        <h1>Find the music you love.</h1>

        <p className="login-description">
          Sign in to search for artists, albums, and tracks in one place.
        </p>

        {authenticationError && (
          <p className="login-error" role="alert">
            {authenticationError}
          </p>
        )}

        <button
          className="google-login-button"
          type="button"
          onClick={handleGoogleLogin}
          disabled={isRedirecting}
        >
          {isRedirecting ? "Opening Google..." : "Continue with Google"}
        </button>

        <p className="login-note">
          Authentication is securely handled through Google.
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
