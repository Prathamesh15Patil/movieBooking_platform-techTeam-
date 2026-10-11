import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);
    api
      .movies(params.toString() ? `?${params}` : "")
      .then(setMovies)
      .catch((e) => setError(e.message));
  }, [search, status]);
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">Movies</h1>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            aria-label="Search movies"
            className="rounded-xl bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="rounded-xl bg-slate-800 px-4 py-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="now_showing">Now showing</option>
            <option value="upcoming">Upcoming</option>
            <option value="ended">Ended</option>
          </select>
        </div>
        {error && <p className="mt-5 text-red-300">{error}</p>}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {movies.map((movie) => (
            <Link
              key={movie._id}
              to={`/movie/${movie._id}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-violet-400"
            >
              <div className="grid aspect-[2/3] place-items-center rounded-xl bg-slate-800 text-center">
                {movie.assetKey ? (
                  <img
                    src={movie.assetKey}
                    alt=""
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  movie.title
                )}
              </div>
              <h2 className="mt-4 font-semibold">{movie.title}</h2>
              <p className="text-sm text-white/50">{movie.status}</p>
            </Link>
          ))}
        </div>
        {!error && !movies.length && (
          <p className="mt-10 text-white/60">No movies found.</p>
        )}
      </div>
    </main>
  );
}
