const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export async function apiRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    // Empty responses are valid for some API operations.
    console.log("No JSON response body for", path);
  }

  if (!response.ok) {
    throw new Error(body?.message || `Request failed (${response.status})`);
  }

  return body;
}

export const api = {
  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, password) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  me: () => apiRequest("/auth/me"),
  movies: (query = "") => apiRequest(`/movies${query}`),
  movie: (id) => apiRequest(`/movies/${id}`),
  showsForMovie: (movieId) => apiRequest(`/movies/${movieId}/shows`),
  theatres: () => apiRequest("/theatres"),
  createMovie: (movie) =>
    apiRequest("/movies", { method: "POST", body: JSON.stringify(movie) }),
  createShow: (show) =>
    apiRequest("/shows", { method: "POST", body: JSON.stringify(show) }),
  show: (id) => apiRequest(`/shows/${id}`),
  seats: (id) => apiRequest(`/shows/${id}/seats`),
  price: (id, count) => apiRequest(`/shows/${id}/price?seats=${count}`),
  lockSeats: (id, seats) =>
    apiRequest(`/shows/${id}/seats/lock`, {
      method: "POST",
      body: JSON.stringify({ seats }),
    }),
  createBooking: (booking) =>
    apiRequest("/bookings", { method: "POST", body: JSON.stringify(booking) }),
  myBookings: () => apiRequest("/bookings/my"),
};

export { API_BASE };
