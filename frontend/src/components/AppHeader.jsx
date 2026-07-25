function AppHeader({ user, onSignOut }) {
  const displayName = user?.displayName || "Music Listener";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="app-header">
      <div className="app-brand">
        <span className="brand-mark" aria-hidden="true">
          ♪
        </span>

        <div>
          <p className="brand-name">JB Music Search</p>
          <p className="brand-tagline">Your music, discovered</p>
        </div>
      </div>

      <div className="user-controls">
        <span className="user-avatar" aria-hidden="true">
          {initial}
        </span>

        <span className="user-name">{displayName}</span>

        <button className="sign-out-button" type="button" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
