const API_BASE_URL = "/api/tmdb";

async function tmdbClient(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = new Error(
      `TMDB request failed with status ${response.status}`,
    );

    error.status = response.status;

    throw error;
  }

  return response.json();
}

export default tmdbClient;
