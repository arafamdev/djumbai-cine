const API_BASE_URL = "/api/tmdb";

async function tmdbClient(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`TMD request failed with status ${response.status}`);
  }

  return response.json();
}

export default tmdbClient;
