import { useEffect, useState } from "react";
import { ChevronRight, LogOut, Ticket } from "lucide-react";
import { Scene, Brand, Clapper, cardStyle, grad } from "./PopcornScene";

// ---- Auth placeholders: swap these three for your real auth ----
const AUTH_KEY = "popcornpass_user"; // expects JSON like {"name":"Aditi Kamath","avatar":"<optional url>"}
const getUser = () => { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; } };
const signOut = () => localStorage.removeItem(AUTH_KEY);
const go = (path) => window.location.assign(path); // swap for useNavigate() if you use React Router

export default function ProfilePage() {
  const [user] = useState(getUser);

  useEffect(() => { if (!user) go("/login"); }, [user]); // auth guard
  if (!user) return null;

  const name = user.name || "Popcorn Pass User";
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-x-hidden bg-black px-4 py-10 font-sans">
      <Scene />
      <div className="relative w-full max-w-[440px]">
        <Brand />

        <div className="relative space-y-6 rounded-3xl border border-white/10 p-7 text-center backdrop-blur-xl sm:p-9" style={cardStyle}>
          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-white/45">My Profile</p>
            <div
              className="mx-auto mb-4 h-28 w-28 rounded-full p-[3px]"
              style={{ backgroundImage: grad, boxShadow: "0 0 40px -4px rgba(80,220,200,.6)" }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={name} className="h-full w-full rounded-full border-4 border-black object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center rounded-full border-4 border-black bg-[#070b18] text-3xl font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-white">{name}</h2>
          </div>

          <a
            href="/bookings"
            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:-translate-y-px hover:border-[#9b5cff]/60 hover:bg-white/[0.07] active:scale-[.98]"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-lg shadow-[#7c4dff]/30" style={{ backgroundImage: grad }}>
              <Ticket size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-white">My Bookings</span>
              <span className="block text-sm text-white/55">View your upcoming and past movie bookings</span>
            </span>
            <ChevronRight size={20} className="shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white" />
          </a>

          <button
            type="button"
            onClick={() => { signOut(); go("/login"); }}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-red-200 active:scale-[.98]"
          >
            <LogOut size={16} />
            Sign Out
          </button>
          <Clapper />
        </div>
      </div>
    </main>
  );
}
