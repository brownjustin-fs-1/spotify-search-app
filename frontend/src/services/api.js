const API_URL = import.meta.env.VITE_API_URL;

async function readJsonResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "The request could not be completed");
  }

  return data;
}

function createAuthorizationHeader(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function validateSession(token) {
  const response = await fetch(`${API_URL}/api/session`, {
    method: "GET",
    headers: createAuthorizationHeader(token),
  });

  return readJsonResponse(response);
}

export async function getProfile(token) {
  const response = await fetch(`${API_URL}/api/profile`, {
    method: "GET",
    headers: createAuthorizationHeader(token),
  });

  return readJsonResponse(response);
}

export async function refreshSession(token) {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: createAuthorizationHeader(token),
  });

  return readJsonResponse(response);
}

export async function searchMusic(token, query) {
  const searchParameters = new URLSearchParams({
    q: query,
  });

  const response = await fetch(
    `${API_URL}/api/music/search?${searchParameters.toString()}`,
    {
      method: "GET",
      headers: createAuthorizationHeader(token),
    },
  );

  return readJsonResponse(response);
}
