import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [error, setError] = useState("");
  const [showsError, setShowsError] = useState("");
  useEffect(() => {
    api.movie(id).then(setMovie).catch((e) => setError(e.message));
    api.showsForMovie(id).then(setShows).catch((e) => setShowsError(e.message));
  }, [id]);
  if (error) return <main className="p-10 text-red-300">{error}</main>;
  if (!movie) return <main className="p-10 text-white">Loading movie...</main>;
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link to="/movies" className="text-violet-300">
          ← All movies
        </Link>
        <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
          <div className="grid aspect-[2/3] place-items-center rounded-2xl bg-slate-800 text-center">
            {movie.assetKey && /^https?:\/\//i.test(movie.assetKey) ? (
              <img
                src={movie.assetKey}
                alt={`${movie.title} poster`}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <span className="p-6 text-xl font-semibold">{movie.title}</span>
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-4 text-white/70">{movie.description}</p>
            <p className="mt-4 text-sm text-white/50">
              {movie.duration ? `${movie.duration} minutes` : "Duration unavailable"}
              {movie.languages?.length ? ` · ${movie.languages.join(" · ")}` : ""}
            </p>
            <p className="mt-2 text-sm capitalize text-white/50">
              {movie.status?.replace("_", " ")}
              {movie.releaseDate
                ? ` · Released ${new Date(movie.releaseDate).toLocaleDateString()}`
                : ""}
            </p>
            {movie.genres?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span key={genre} className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-200">
                    {genre}
                  </span>
                ))}
              </div>
            )}
            <h2 className="mt-10 text-2xl font-semibold">Upcoming shows</h2>
            {showsError && <p className="mt-4 text-red-300">{showsError}</p>}
            <div className="mt-4 grid gap-3">
              {shows.map((show) => (
                <Link
                  key={show._id}
                  to={`/booking/${show._id}`}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-violet-400"
                >
                  <strong>{new Date(show.startTime).toLocaleString()}</strong>
                  <span className="ml-3 text-white/60">
                    {show.theater?.name || "Theatre"}
                    {show.theater?.screenName ? ` · ${show.theater.screenName}` : ""}
                    {show.theater?.location ? ` · ${show.theater.location}` : ""}
                    {show.language ? ` · ${show.language}` : ""}
                    {show.ticketPrice != null ? ` · ₹${show.ticketPrice}` : ""}
                  </span>
                </Link>
              ))}
            </div>
            {!shows.length && (
              <p className="mt-4 text-white/60">No upcoming shows.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
