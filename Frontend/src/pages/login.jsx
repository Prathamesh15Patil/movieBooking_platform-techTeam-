import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Scene, Brand, Clapper, cardStyle, grad, field } from "./PopcornScene";

export default function LoginPage() {
  const [v, setV] = useState({ id: "", pw: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState({});

  const submit = (e) => {
    e.preventDefault();
    setErr({
      ...(!v.id.trim() && { id: "Enter your email or username." }),
      ...(!v.pw && { pw: "Enter your password." }),
    });
    // TODO: authenticate
  };

  const fields = [
    { k: "id", label: "Email or Username", type: "text", ph: "Enter your email or username", ac: "username" },
    { k: "pw", label: "Password", type: show ? "text" : "password", ph: "Enter your password", ac: "current-password" },
  ];

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-x-hidden bg-black px-4 py-10 font-sans">
      <Scene />
      <div className="relative w-full max-w-[440px]">
        <Brand />

        <form onSubmit={submit} noValidate className="relative space-y-5 rounded-3xl border border-white/10 p-7 backdrop-blur-xl sm:p-9" style={cardStyle}>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
            <p className="mt-1 text-sm text-white/55">Sign in to continue to Popcorn Pass</p>
          </div>

          {fields.map(({ k, label, type, ph, ac }) => (
            <div key={k}>
              <label htmlFor={k} className="mb-1.5 block text-sm font-medium text-white/75">{label}</label>
              <div className="relative">
                <input
                  id={k}
                  type={type}
                  autoComplete={ac}
                  placeholder={ph}
                  value={v[k]}
                  onChange={(e) => setV({ ...v, [k]: e.target.value })}
                  className={`${field} ${k === "pw" ? "pr-11" : ""} ${err[k] ? "border-red-400/70" : ""}`}
                />
                {k === "pw" && (
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
              {err[k] && <p className="mt-1.5 text-xs text-red-300">{err[k]}</p>}
            </div>
          ))}

          <button
            type="submit"
            className="h-12 w-full rounded-xl text-sm font-semibold text-white shadow-lg shadow-[#7c4dff]/30 transition hover:-translate-y-px hover:brightness-110 active:translate-y-0 active:scale-[.98]"
            style={{ backgroundImage: grad }}
          >
            Sign In
          </button>

          <div className="flex items-center gap-3 text-xs text-white/35">
            <span className="h-px flex-1 bg-white/10" />OR<span className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={() => {/* TODO: Google auth */}}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/5 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[.98]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path fill="#4285F4" d="M23 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.17a5.28 5.28 0 0 1-2.29 3.46v2.87h3.7C21.75 18.8 23 15.8 23 12.27z" />
              <path fill="#34A853" d="M12 23.5c3.1 0 5.7-1.03 7.6-2.8l-3.7-2.87c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.02-6.45-4.74H1.74v2.97A11.5 11.5 0 0 0 12 23.5z" />
              <path fill="#FBBC05" d="M5.55 14.19a6.9 6.9 0 0 1 0-4.38V6.84H1.74a11.5 11.5 0 0 0 0 10.32l3.81-2.97z" />
              <path fill="#EA4335" d="M12 5.07c1.69 0 3.2.58 4.4 1.72l3.3-3.3C17.7 1.65 15.1.5 12 .5A11.5 11.5 0 0 0 1.74 6.84l3.81 2.97C6.46 7.09 9 5.07 12 5.07z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-white/55">
            Don't have an account?{" "}
            <a href="/signup" className="font-semibold text-[#8ff5c8] underline-offset-4 transition hover:text-[#c4a4ff] hover:underline">
              Create one
            </a>
          </p>
          <Clapper />
        </form>
      </div>
    </main>
  );
}
