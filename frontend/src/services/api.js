const API_URL = import.meta.env.VITE_API_URL;

export async function validateSession(token) {
  const response = await fetch(`${API_URL}/api/session`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "The authentication session is invalid");
  }

  return data;
}
