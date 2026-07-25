const API_URL = import.meta.env.VITE_API_URL;

function LoginPage() {
  function handleGoogleLogin() {
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

        <button
          className="google-login-button"
          type="button"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        <p className="login-note">
          Authentication is securely handled through Google.
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
