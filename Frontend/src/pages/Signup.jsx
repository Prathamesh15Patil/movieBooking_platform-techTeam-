import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const AUTH_KEY = "popcornpass_user"; // same key as Profile.jsx
const go = (path) => window.location.assign(path); // swap for useNavigate() if you use React Router

// Same static backdrop as the login page.
const FRAG = `precision mediump float;uniform vec2 r;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r.y*1.5+3.;
  vec2 q=vec2(fbm(uv),fbm(uv+5.2));
  vec2 w=vec2(fbm(uv+2.*q+vec2(1.7,9.2)),fbm(uv+2.*q+vec2(8.3,2.8)));
  float f=fbm(uv+2.5*w);
  vec3 c=mix(vec3(0.),vec3(.541,.004,1.),smoothstep(.25,.8,f));
  c=mix(c,vec3(0.,.584,.361),smoothstep(.5,1.,length(q))*smoothstep(.35,.75,w.x)*.85);
  c+=pow(smoothstep(.6,.95,f),3.)*vec3(.55,.35,.8)*.45;
  c*=.12+.88*smoothstep(.1,.75,f);
  gl_FragColor=vec4(c*(1.-.45*length(gl_FragCoord.xy/r-.5)),1.);
}`;

function Backdrop() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, gl = cv.getContext("webgl");
    if (!gl) return;
    const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pg = gl.createProgram();
    gl.attachShader(pg, shader(gl.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"));
    gl.attachShader(pg, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(pg, 0, "p");
    gl.linkProgram(pg);
    gl.useProgram(pg);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const draw = () => {
      cv.width = innerWidth; cv.height = innerHeight;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(gl.getUniformLocation(pg, "r"), cv.width, cv.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    draw();
    addEventListener("resize", draw);
    return () => removeEventListener("resize", draw);
  }, []);
  return <canvas ref={ref} className="fixed inset-0 h-full w-full" />;
}

const field = "h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#8a01ff] focus:bg-white/[0.07] focus:ring-4 focus:ring-[#8a01ff]/20";

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
      <Backdrop />
      <div className="relative w-full max-w-[440px]">
        <h1
          className="mb-8 text-center text-[2.6rem] font-black tracking-tight sm:text-6xl"
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            backgroundImage: "linear-gradient(120deg,#fff 5%,#d9bcff 35%,#8a01ff 62%,#00c47a 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 28px rgba(138,1,255,.55))",
          }}
        >
          Popcorn Pass
        </h1>

        <form
          onSubmit={submit}
          noValidate
          className="space-y-5 rounded-3xl border border-white/10 p-7 backdrop-blur-xl sm:p-9"
          style={{
            background:
              "radial-gradient(120% 80% at 0% 0%,rgba(138,1,255,.28),transparent 55%),radial-gradient(100% 80% at 100% 100%,rgba(0,149,92,.22),transparent 55%),rgba(0,0,0,.6)",
            boxShadow: "0 0 80px -20px rgba(138,1,255,.6), inset 0 1px 0 rgba(255,255,255,.08)",
          }}
        >
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
            className="h-12 w-full rounded-xl text-sm font-semibold text-white shadow-lg shadow-[#8a01ff]/30 transition hover:-translate-y-px hover:brightness-110 active:translate-y-0 active:scale-[.98]"
            style={{ backgroundImage: "linear-gradient(135deg,#8a01ff,#00955c)" }}
          >
            Create Account
          </button>

          <p className="text-center text-sm text-white/55">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-[#b88cff] underline-offset-4 transition hover:text-[#00c47a] hover:underline">
              Sign in
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
