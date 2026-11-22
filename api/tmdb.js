import process from "node:process";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_PREFIX = "/api/tmdb/";

const ALLOWED_ENDPOINTS = new Set([
  "movie/popular",
  "trending/movie/week",
  "tv/popular",
  "search/multi",
  "genre/movie/list",
  "genre/tv/list",
  "discover/movie",
  "discover/tv",
]);

const MEDIA_TYPES = new Set(["movie", "tv"]);
const MEDIA_RESOURCES = new Set(["similar", "credits", "videos"]);

function isAllowedEndpoint(endpoint) {
  if (ALLOWED_ENDPOINTS.has(endpoint)) {
    return true;
  }

  const segments = endpoint.split("/");

  if (segments.length !== 2 && segments.length !== 3) {
    return false;
  }

  const [mediaType, mediaId, resource] = segments;

  if (!MEDIA_TYPES.has(mediaType)) {
    return false;
  }

  if (!/^[1-9]\d*$/.test(mediaId)) {
    return false;
  }

  if (segments.length === 2) {
    return true;
  }

  return MEDIA_RESOURCES.has(resource);
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "private, no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");

    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    return response.status(500).json({
      error: "TMDB service is not configured",
    });
  }

  try {
    const incomingUrl = new URL(request.url, "http://localhost");

    if (!incomingUrl.pathname.startsWith(API_PREFIX)) {
      return response.status(404).json({
        error: "Endpoint not found",
      });
    }

    const endpoint = incomingUrl.pathname.slice(API_PREFIX.length);

    if (!isAllowedEndpoint(endpoint)) {
      return response.status(404).json({
        error: "TMDB endpoint not allowed",
      });
    }

    const tmdbUrl = new URL(`${TMDB_BASE_URL}/${endpoint}`);

    for (const [key, value] of incomingUrl.searchParams) {
      if (key.toLowerCase() !== "api_key") {
        tmdbUrl.searchParams.append(key, value);
      }
    }

    const tmdbResponse = await fetch(tmdbUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    const data = await tmdbResponse.json();

    return response.status(tmdbResponse.status).json(data);
  } catch {
    return response.status(502).json({
      error: "Unable to retrieve TMDB data",
    });
  }
}
