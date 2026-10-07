import { useEffect, useRef, useState } from "react";
import { ChevronRight, LogOut, Ticket } from "lucide-react";

// ---- Auth placeholders: swap these three for your real auth ----
const AUTH_KEY = "popcornpass_user"; // expects JSON like {"name":"Aditi Kamath","avatar":"<optional url>"}
const getUser = () => { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; } };
const signOut = () => localStorage.removeItem(AUTH_KEY);
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

const grad = "linear-gradient(135deg,#8a01ff,#00955c)";

export default function Profile() {
  const [user] = useState(getUser);

  useEffect(() => { if (!user) go("/login"); }, [user]); // auth guard
  if (!user) return null;

  const name = user.name || "Popcorn Pass User";
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

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

        <div
          className="space-y-6 rounded-3xl border border-white/10 p-7 text-center backdrop-blur-xl sm:p-9"
          style={{
            background:
              "radial-gradient(120% 80% at 0% 0%,rgba(138,1,255,.28),transparent 55%),radial-gradient(100% 80% at 100% 100%,rgba(0,149,92,.22),transparent 55%),rgba(0,0,0,.6)",
            boxShadow: "0 0 80px -20px rgba(138,1,255,.6), inset 0 1px 0 rgba(255,255,255,.08)",
          }}
        >
          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-white/45">My Profile</p>
            <div
              className="mx-auto mb-4 h-28 w-28 rounded-full p-[3px]"
              style={{ backgroundImage: grad, boxShadow: "0 0 40px -4px rgba(138,1,255,.7)" }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={name} className="h-full w-full rounded-full border-4 border-black object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center rounded-full border-4 border-black bg-[#0d0618] text-3xl font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-white">{name}</h2>
          </div>

          <a
            href="/booking"
            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:-translate-y-px hover:border-[#8a01ff]/60 hover:bg-white/[0.07] active:scale-[.98]"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-lg shadow-[#8a01ff]/30" style={{ backgroundImage: grad }}>
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
        </div>
      </div>
    </main>
  );
}
