import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

// backdrop
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

export default function Login() {
  const navigate = useNavigate();
  const [v, setV] = useState({ id: "", pw: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState({});

  const submit = (e) => {
  e.preventDefault();

  const errors = {
    ...(!v.id.trim() && { id: "Enter your email or username." }),
    ...(!v.pw && { pw: "Enter your password." }),
  };

  setErr(errors);

  // Don't continue if validation fails
  if (Object.keys(errors).length > 0) {
    return;
  }

  // Temporary frontend-only login
  const user = {
    name: v.id,
    avatar: "",
  };

  localStorage.setItem(
    "popcornpass_user",
    JSON.stringify(user)
  );

  navigate("/profile");
};

  const fields = [
    { k: "id", label: "Email or Username", type: "text", ph: "Enter your email or username", ac: "username" },
    { k: "pw", label: "Password", type: show ? "text" : "password", ph: "Enter your password", ac: "current-password" },
  ];

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
            className="h-12 w-full rounded-xl text-sm font-semibold text-white shadow-lg shadow-[#8a01ff]/30 transition hover:-translate-y-px hover:brightness-110 active:translate-y-0 active:scale-[.98]"
            style={{ backgroundImage: "linear-gradient(135deg,#8a01ff,#00955c)" }}
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
            <a href="/signup" className="font-semibold text-[#b88cff] underline-offset-4 transition hover:text-[#00c47a] hover:underline">
              Create one
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
