const TOKEN_KEY = "jbMusicToken";

export function saveToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getStoredToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function removeStoredToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function captureCallbackToken() {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const token = fragment.get("token");

  if (!token) {
    return null;
  }

  saveToken(token);

  window.history.replaceState({}, document.title, "/");

  return token;
}
