import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Scene, Brand, Clapper, cardStyle, grad, field } from "./PopcornScene";

const AUTH_KEY = "popcornpass_user"; // same key as Profile.jsx
const go = (path) => window.location.assign(path); // swap for useNavigate() if you use React Router

const fields = [
  { k: "name", label: "Full Name", ph: "Enter your full name", type: "text", ac: "name" },
  { k: "email", label: "Email", ph: "Enter your email", type: "email", ac: "email" },
  { k: "pw", label: "Password", ph: "Create a password", pwd: true, ac: "new-password" },
  { k: "cf", label: "Confirm Password", ph: "Confirm your password", pwd: true, ac: "new-password" },
];

const rules = {
  name: (v) => !v.name.trim() && "Enter your full name.",
  email: (v) => (!v.email.trim() ? "Enter your email." : !/^\S+@\S+\.\S+$/.test(v.email.trim()) && "Enter a valid email address."),
  pw: (v) => (!v.pw ? "Create a password." : v.pw.length < 6 && "Password must be at least 6 characters."),
  cf: (v) => (!v.cf ? "Confirm your password." : v.cf !== v.pw && "Passwords don't match."),
};

export default function Signup() {
  const [v, setV] = useState({ name: "", email: "", pw: "", cf: "" });
  const [show, setShow] = useState({});
  const [err, setErr] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    for (const k in rules) { const m = rules[k](v); if (m) next[k] = m; }
    setErr(next);
    if (Object.keys(next).length) return;
    // Temporary frontend-only auth
    localStorage.setItem(AUTH_KEY, JSON.stringify({ name: v.name.trim(), avatar: "" }));
    go("/profile");
  };

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-x-hidden bg-black px-4 py-10 font-sans">
      <Scene />
      <div className="relative w-full max-w-[440px]">
        <Brand />

        <form onSubmit={submit} noValidate className="relative space-y-5 rounded-3xl border border-white/10 p-7 backdrop-blur-xl sm:p-9" style={cardStyle}>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">Create Your Account</h2>
            <p className="mt-1 text-sm text-white/55">Join Popcorn Pass and start booking your favorite movies</p>
          </div>

          {fields.map(({ k, label, ph, type, ac, pwd }) => (
            <div key={k}>
              <label htmlFor={k} className="mb-1.5 block text-sm font-medium text-white/75">{label}</label>
              <div className="relative">
                <input
                  id={k}
                  type={pwd ? (show[k] ? "text" : "password") : type}
                  autoComplete={ac}
                  placeholder={ph}
                  value={v[k]}
                  onChange={(e) => setV({ ...v, [k]: e.target.value })}
                  className={`${field} ${pwd ? "pr-11" : ""} ${err[k] ? "border-red-400/70" : ""}`}
                />
                {pwd && (
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, [k]: !show[k] })}
                    aria-label={show[k] ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white"
                  >
                    {show[k] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
              {err[k] && <p className="mt-1.5 text-xs text-red-300">{err[k]}</p>}
            </div>
          ))}

          <button
            type="submit"
            className="h-12 w-full rounded-xl bg-[#7c4dff] text-sm font-semibold text-white shadow-lg shadow-[#7c4dff]/30 transition hover:-translate-y-px hover:bg-[#6b38ff] active:translate-y-0 active:scale-[.98]"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-white/55">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-[#8ff5c8] underline-offset-4 transition hover:text-[#c4a4ff] hover:underline">
              Sign in
            </a>
          </p>
          <Clapper />
        </form>
      </div>
    </main>
  );
}
