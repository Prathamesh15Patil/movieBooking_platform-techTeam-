import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { api.movies("?status=now_showing").then(setMovies).catch((e) => setError(e.message)); }, []);
  return <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
    <section className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950 p-10 shadow-2xl">
      <p className="text-sm uppercase tracking-[.3em] text-emerald-300">PopcornPass</p>
      <h1 className="mt-5 max-w-2xl text-5xl font-bold">Your next great movie night starts here.</h1>
      <p className="mt-5 max-w-xl text-white/65">Discover what is showing, choose your seats, and book in a few simple steps.</p>
      <Link to="/movies" className="mt-8 inline-block rounded-xl bg-violet-600 px-6 py-3 font-semibold hover:bg-violet-500">Explore movies</Link>
    </section>
    <section className="mx-auto mt-14 max-w-6xl">
      <h2 className="text-2xl font-semibold">Now showing</h2>
      {error && <p className="mt-4 text-red-300">{error}</p>}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {movies.map((movie) => <Link key={movie._id} to={`/movie/${movie._id}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1">
          <div className="grid aspect-[2/3] place-items-center rounded-xl bg-gradient-to-br from-violet-800 to-slate-800 text-center text-white/70">{movie.assetKey ? <img src={movie.assetKey} alt="" className="h-full w-full rounded-xl object-cover" /> : movie.title}</div>
          <h3 className="mt-4 font-semibold">{movie.title}</h3>
          <p className="mt-1 text-sm text-white/50">{movie.duration ? `${movie.duration} minutes` : "Movie"}</p>
        </Link>)}
      </div>
    </section>
  </main>;
}
