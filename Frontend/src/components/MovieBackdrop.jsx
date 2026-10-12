import { useEffect, useState } from "react";

function posterUrl(movie) {
  return movie?.assetKey || "";
}

export default function MovieBackdrop({ movies = [], slideshow = false }) {
  const posters = movies.map(posterUrl).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [posters.join("|")]);

  useEffect(() => {
    if (!slideshow || posters.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % posters.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [posters.length, slideshow]);

  if (!posters.length) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {posters.map((poster, index) => (
        <img
          key={`${poster}-${index}`}
          src={poster}
          alt=""
          className={`absolute inset-[-5%] h-[110%] w-[110%] object-cover blur-xl transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-75" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950/75" />
    </div>
  );
}
