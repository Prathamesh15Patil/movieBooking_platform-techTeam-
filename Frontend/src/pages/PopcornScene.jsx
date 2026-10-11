import { useEffect, useRef } from "react";

// ---------- shared theme ----------
export const grad = "#7c4dff";
export const cardStyle = {
  background:
    "radial-gradient(120% 80% at 0% 0%,rgba(155,92,255,.26),transparent 55%),radial-gradient(100% 80% at 100% 100%,rgba(45,255,164,.16),transparent 55%),rgba(2,6,14,.62)",
  boxShadow: "0 0 80px -20px rgba(80,220,200,.45), inset 0 1px 0 rgba(255,255,255,.08)",
};
export const field =
  "h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#9b5cff] focus:bg-white/[0.07] focus:ring-4 focus:ring-[#9b5cff]/20";

// ---------- aurora backdrop: one static frame ----------
const FRAG = `precision mediump float;uniform vec2 r;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f*=f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 s=gl_FragCoord.xy/r;
  vec2 uv=gl_FragCoord.xy/r.y*1.5+3.;
  vec2 q=vec2(fbm(uv),fbm(uv+5.2));
  vec2 w=vec2(fbm(uv+2.*q+vec2(1.7,9.2)),fbm(uv+2.*q+vec2(8.3,2.8)));
  float f=fbm(uv+2.5*w);
  vec3 c=mix(vec3(.01,.03,.09),vec3(.06,.22,.75),smoothstep(.2,.6,f));
  c=mix(c,vec3(.04,.85,.75),smoothstep(.45,.8,f)*.9);
  c=mix(c,vec3(.2,1.,.55),smoothstep(.7,.95,f)*.8);
  c=mix(c,vec3(.62,.32,1.),smoothstep(.4,.9,w.x)*smoothstep(.3,.7,length(q))*.7);
  c=mix(c,vec3(1.,.4,.85),pow(smoothstep(.65,1.,w.y),2.)*.35);
  c*=(.15+.85*smoothstep(.1,.7,f))*(.55+.6*s.y);
  gl_FragColor=vec4(c*(1.-.45*length(s-.5)),1.);
}`;

function Aurora() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current,
      gl = cv.getContext("webgl");
    if (!gl) return;
    const shader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
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
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(gl.getUniformLocation(pg, "r"), cv.width, cv.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" style={{ opacity: 0.75 }} />;
}

// ---------- geometry helpers ----------
const star = (R, r, cx = 50, cy = 52, n = 5) =>
  Array.from({ length: 2 * n }, (_, i) => {
    const a = (i * Math.PI) / n - Math.PI / 2,
      d = i % 2 ? r : R;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  });
const pts = (a) => a.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ");

// ---------- marquee star (lit bulbs along a gold frame) ----------
const S_OUT = pts(star(48, 22)),
  S_IN = pts(star(30, 13.5));
const S_BULB = star(39, 17.6);
const BULBS = S_BULB.flatMap((p, i) => {
  const q = S_BULB[(i + 1) % 10];
  return [p, [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]];
});

const MStar = ({ r, d, style }) => (
  <svg
    viewBox="0 0 100 96"
    style={{
      "--r": `${r}deg`,
      filter: "drop-shadow(0 0 7px rgba(255,200,60,.55))",
      animation: `pp-bob ${4 + (d % 3)}s ease-in-out ${-d}s infinite alternate`,
      ...style,
    }}
  >
    <polygon points={S_OUT} fill="url(#pp-gold)" stroke="#b97a00" strokeWidth="1" strokeLinejoin="round" />
    <polygon points={S_IN} fill="url(#pp-ruby)" stroke="#e8a800" strokeWidth="1.2" strokeLinejoin="round" />
    {BULBS.map(([x, y], i) => (
      <circle
        key={i}
        cx={x}
        cy={y}
        r="2.3"
        fill="#fff6c4"
        style={{ animation: `pp-bulb 1.4s ease-in-out ${(i % 2) * 0.7 - d * 0.3}s infinite alternate` }}
      />
    ))}
  </svg>
);

// ---------- props: defined once, reused everywhere via <use> ----------
const VB = { tk: [200, 110], pc: [550, 752], cb: [110, 110] };

const Defs = () => (
  <svg width="0" height="0" className="absolute" aria-hidden="true">
    <defs>
      <linearGradient id="pp-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffe27a" />
        <stop offset=".5" stopColor="#f2b51c" />
        <stop offset="1" stopColor="#c98200" />
      </linearGradient>
      <radialGradient id="pp-ruby">
        <stop offset="0" stopColor="#b01212" />
        <stop offset="1" stopColor="#6a0606" />
      </radialGradient>

      {/* Realistic Golden Cinema Ticket */}
      <linearGradient id="pp-ticket-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="45%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="pp-ticket-border" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>

      <symbol id="pp-tk" viewBox="0 0 200 110">
        <mask id="pp-tk-mask">
          <rect width="200" height="110" rx="6" fill="#fff" />
          {/* Edge cut notches */}
          <circle cx="0" cy="55" r="9" fill="#000" />
          <circle cx="200" cy="55" r="9" fill="#000" />
          {/* Stub perforation notches */}
          <circle cx="56" cy="0" r="6" fill="#000" />
          <circle cx="56" cy="110" r="6" fill="#000" />
        </mask>

        <g mask="url(#pp-tk-mask)">
          {/* Ticket Base */}
          <rect width="200" height="110" fill="url(#pp-ticket-bg)" />

          {/* Border Frame */}
          <rect
            x="5"
            y="5"
            width="190"
            height="100"
            rx="4"
            fill="none"
            stroke="url(#pp-ticket-border)"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />

          {/* Perforated Stub Divider */}
          <line
            x1="56"
            y1="6"
            x2="56"
            y2="104"
            stroke="#78350f"
            strokeWidth="1.5"
            strokeDasharray="4,3"
            strokeOpacity="0.6"
          />

          {/* Left Stub Content */}
          <g fontFamily="Georgia, serif" fill="#582305" textAnchor="middle" fontWeight="bold">
            <text x="28" y="24" fontSize="8" letterSpacing="1">★ ADMIT ★</text>
            <text x="28" y="58" fontSize="16" letterSpacing="1">ONE</text>
            <text x="28" y="92" fontSize="7" letterSpacing="1.5">№ 048291</text>
          </g>

          {/* Right Main Body Content */}
          <g fontFamily="'Arial Black', Impact, sans-serif" fill="#451a03" textAnchor="middle">
            <text x="128" y="30" fontSize="9" letterSpacing="3" fill="#78350f" fontFamily="Georgia, serif" fontWeight="bold">
              ★ POPCORN PASS ★
            </text>
            <text x="128" y="54" fontSize="17" letterSpacing="1.5">
              CINEMA
            </text>
            <text x="128" y="73" fontSize="17" letterSpacing="1.5">
              TICKET
            </text>
            <text x="128" y="96" fontSize="7.5" fontFamily="Georgia, serif" letterSpacing="1.5" fill="#78350f" fontWeight="bold">
              PREMIUM ADMISSION
            </text>
          </g>

          {/* Decorative Star Accents */}
          <g fill="#78350f" opacity="0.65">
            <polygon points={pts(star(3.5, 1.6, 68, 20))} />
            <polygon points={pts(star(3.5, 1.6, 188, 20))} />
            <polygon points={pts(star(3.5, 1.6, 68, 90))} />
            <polygon points={pts(star(3.5, 1.6, 188, 90))} />
          </g>
        </g>
      </symbol>

      {/* Reference Popcorn Bucket */}
      <symbol id="pp-pc" viewBox="0 0 550 752">
        <image href="/popcorn.png" width="550" height="752" />
      </symbol>

      {/* Clapperboard */}
      <symbol id="pp-cb" viewBox="0 0 110 110">
        <g transform="translate(5 5)">
          {[
            { fill: "#fff", stroke: "#fff", strokeWidth: 6, strokeLinejoin: "round" },
            { fill: "#0b0b0b" },
          ].map((p, k) => (
            <g key={k} {...p}>
              <rect x="6" y="52" width="88" height="44" rx="2" />
              <rect x="6" y="40" width="88" height="12" />
              <rect x="6" y="24" width="88" height="14" transform="rotate(-14 6 40)" />
            </g>
          ))}
          <g fill="#fff">
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M${14 + i * 16} 40h8l-6 12h-8z`} />
            ))}
            <g transform="rotate(-14 6 40)">
              {[0, 1, 2, 3, 4].map((i) => (
                <path key={i} d={`M${14 + i * 16} 24h8l-6 14h-8z`} />
              ))}
            </g>
            <g fontFamily="Arial,Helvetica,sans-serif" fontSize="6.5">
              <text x="10" y="60">PRODUCTION</text>
              <text x="10" y="71">SCENE</text>
              <text x="54" y="71">TAKE</text>
              <text x="10" y="82">DIRECTOR</text>
              <text x="10" y="92">CAMERA</text>
            </g>
          </g>
          <path d="M6 63H94M6 74H94M6 85H94M50 63V74" stroke="#fff" strokeWidth=".6" />
        </g>
      </symbol>
    </defs>
  </svg>
);

const Sym = ({ k, className, style }) => {
  const [w, h] = VB[k] || [100, 100];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} style={style}>
      <use href={`#pp-${k}`} width={w} height={h} />
    </svg>
  );
};

// ---------- realistic atmospheric theatre downlights ----------
const LAMPS = [0.12, 0.32, 0.5, 0.68, 0.88];
const Spots = () => (
  <div className="pointer-events-none absolute inset-x-0 top-0 h-0 overflow-visible" aria-hidden="true">
    {/* Curved Truss Wire */}
    <svg className="absolute left-0 top-0 h-16 w-full" viewBox="0 0 100 64" preserveAspectRatio="none" fill="none">
      <path d="M0 6Q50 36 100 6" stroke="#fff" strokeOpacity=".2" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
    </svg>

    {/* Atmospheric Theater Downlights with soft radial falloff */}
    {LAMPS.map((t, i) => {
      const topOffset = 6 + 30 * 4 * t * (1 - t);
      return (
        <div key={t} className="absolute" style={{ left: `${t * 100}%`, top: topOffset }}>
          {/* Soft Atmospheric Light Cone */}
          <div
            className="absolute -left-[110px] top-0 h-[80vh] w-[220px]"
            style={{
              transformOrigin: "50% 0",
              filter: "blur(18px)",
              mixBlendMode: "screen",
              "--a": `${(t - 0.5) * 32}deg`,
              animation: `pp-sway ${8 + i * 1.5}s ease-in-out ${-i * 1.8}s infinite alternate`,
            }}
          >
            <div
              className="h-full w-full"
              style={{
                clipPath: "polygon(48% 0, 52% 0, 100% 100%, 0% 100%)",
                background:
                  "linear-gradient(to bottom, rgba(255, 230, 150, 0.35) 0%, rgba(255, 210, 100, 0.12) 40%, rgba(124, 77, 255, 0.05) 75%, transparent 100%)",
              }}
            />
          </div>

          {/* Warm Vintage Cinema Lamp Bulb */}
          <div
            className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-[#fffbeb]"
            style={{
              boxShadow: "0 0 16px 5px rgba(255, 215, 120, 0.8), 0 0 4px 1px rgba(255, 255, 255, 0.9)",
            }}
          />
        </div>
      );
    })}
  </div>
);

// ---------- film tape: narrow 35mm-style strips with photo frames ----------
const TW = 168,
  TH = 42;
const PHOTOS = [
  ["#ffb36b", "#7a3a8a", "#1b1030", "M0 26V19Q8 13 15 18T34 16V26Z", [24, 13, 4.5, "#fff1c2"]],
  ["#1b2f66", "#4aa3ff", "#0a1430", "M0 26L9 12L15 19L23 9L34 26Z"],
  ["#06323a", "#2cf2a8", "#04161a", "M0 26V20L4 12L8 20L13 10L18 20L23 13L27 20L34 17V26Z"],
  ["#4a2a1a", "#f0b45a", "#120a05", "M0 26V16H6V11H11V18H17V8H23V15H28V19H34V26Z", [8, 8, 3, "#fff3c4"]],
];
const holes = Array.from(
  { length: 28 },
  (_, k) => `<rect x="${1.2 + 6 * k}" y="1.8" width="3.6" height="4.4" rx=".9"/><rect x="${1.2 + 6 * k}" y="35.8" width="3.6" height="4.4" rx=".9"/>`
).join("");
const photos = PHOTOS.map(
  ([a, b, sil, path, sun], i) =>
    `<linearGradient id="f${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>` +
    `<g transform="translate(${i * 42 + 4} 8)"><rect width="34" height="26" rx="1.5" fill="url(#f${i})"/>${
      sun ? `<circle cx="${sun[0]}" cy="${sun[1]}" r="${sun[2]}" fill="${sun[3]}"/>` : ""
    }<path d="${path}" fill="${sil}"/><rect width="34" height="26" rx="1.5" fill="none" stroke="#000" stroke-opacity=".55"/></g>`
).join("");
const TILE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="${TH}"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1915"/><stop offset=".5" stop-color="#0d0b09"/><stop offset="1" stop-color="#1e1915"/></linearGradient><mask id="m"><rect width="${TW}" height="${TH}" fill="#fff"/><g fill="#000">${holes}</g></mask></defs><rect width="${TW}" height="${TH}" fill="url(#b)" mask="url(#m)"/><path d="M0 .6H${TW}M0 ${TH - 0.6}H${TW}" stroke="#fff" stroke-opacity=".16" stroke-width=".8"/>${photos}</svg>`
)}")`;

// [top%, scale, tilt deg, seconds per tile, reverse]
const FILMS = [
  [22, 1, -4, 4.0, 0],
  [48, 0.85, 3, 3.2, 1],
  [70, 1, -3, 4.2, 1],
  [90, 0.85, 4, 3.5, 0],
];
const FADE = "linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)";

const Film = ([top, s, rot, dur, rev]) => (
  <div
    key={top}
    className="pointer-events-none absolute -left-[5%] w-[110%] overflow-hidden"
    style={{ top: `${top}%`, height: TH * s, transform: `rotate(${rot}deg)`, opacity: 0.65, maskImage: FADE, WebkitMaskImage: FADE }}
  >
    <div
      style={{
        height: "100%",
        width: `calc(100% + ${TW * s}px)`,
        backgroundImage: TILE,
        backgroundSize: `${TW * s}px ${TH * s}px`,
        "--d": `${TW * s}px`,
        animation: `pp-film ${dur}s linear infinite ${rev ? "reverse" : "normal"}`,
      }}
    />
  </div>
);

// Minimal, tasteful floating objects around the periphery (No cameras, No film rolls, No star clutter)
// [symbol, left%, top%, width px, rotation, float seconds, delay, opacity]
const ITEMS = [
  ["tk", 10, 26, 118, -14, 9, 0, 0.65],
  ["tk", 82, 20, 112, 12, 11, -3, 0.65],
  ["tk", 8, 76, 105, 10, 12, -2, 0.6],
  ["tk", 86, 78, 105, -12, 10, -5, 0.6],
  ["pc", 89, 46, 56, -8, 9, -4, 0.7],
  ["pc", 5, 48, 50, 8, 10, -2, 0.7],
];

// Marquee star clusters in two opposite corners
const CORNERS = [
  ["left-0 top-0 origin-top-left", "left", "top", [-14, 12, -8]],
  ["bottom-0 right-0 origin-bottom-right", "right", "bottom", [12, -12, 8]],
];
const SIZES = [
  [105, 14, 16],
  [68, 94, 102],
];

const CSS = `
@keyframes pp-float{from{transform:translate(0,0) rotate(var(--r))}to{transform:translate(12px,-18px) rotate(calc(var(--r) + 7deg))}}
@keyframes pp-film{to{transform:translateX(calc(var(--d) * -1))}}
@keyframes pp-sway{from{transform:rotate(calc(var(--a) - 2deg))}to{transform:rotate(calc(var(--a) + 2deg))}}
@keyframes pp-bulb{from{opacity:.35}to{opacity:1}}
@keyframes pp-bob{from{transform:translateY(0) rotate(var(--r))}to{transform:translateY(-7px) rotate(calc(var(--r) + 3deg))}}`;

// Full-screen background: aurora + realistic stage lights + scrolling film tape + minimal floating tickets and popcorn
export function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-black" aria-hidden="true">
      <style>{CSS}</style>
      <Defs />
      <Aurora />
      <Spots />
      {FILMS.map(Film)}
      {ITEMS.map(([k, x, y, w, r, dur, delay, op], i) => (
        <Sym
          key={i}
          k={k}
          className="absolute hidden sm:block"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: w,
            opacity: op,
            "--r": `${r}deg`,
            animation: `pp-float ${dur}s ease-in-out ${delay}s infinite alternate`,
          }}
        />
      ))}
      {CORNERS.map(([cls, hx, vy, rots], c) => (
        <div key={c} className={`absolute scale-[.55] sm:scale-100 ${cls}`}>
          {SIZES.map(([w, x, y], i) => (
            <MStar key={i} r={rots[i]} d={c * 3 + i} style={{ position: "absolute", width: w, [hx]: x, [vy]: y }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// Clapperboard sticker for the top-left corner of a card
export function Clapper() {
  return (
    <Sym
      k="cb"
      className="pointer-events-none absolute -left-3 -top-6 w-[4.5rem] -rotate-12 overflow-visible sm:-left-7 sm:-top-8 sm:w-24"
      style={{ margin: 0, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.55))" }}
    />
  );
}

// "Popcorn Pass" title with the reference popcorn bucket and authentic cinema tickets
export function Brand() {
  return (
    <div className="relative left-1/2 mb-8 flex w-max max-w-[92vw] -translate-x-1/2 flex-wrap items-center justify-center gap-x-3 gap-y-1">
      <h1
        className="text-[1.9rem] font-black tracking-tight text-white sm:text-6xl"
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          filter: "drop-shadow(0 4px 18px rgba(0,0,0,.7))",
        }}
      >
        Popcorn Pass
      </h1>
      <div
        className="relative mt-2 h-16 sm:h-24"
        style={{ aspectRatio: "550/752", filter: "drop-shadow(0 0 16px rgba(255,200,90,.35))" }}
      >
        <Sym k="tk" className="absolute -top-3 left-1/2 z-0 w-[140%]" style={{ transform: "translateX(-65%) rotate(-20deg)" }} />
        <Sym k="tk" className="absolute -top-4 left-1/2 z-0 w-[140%]" style={{ transform: "translateX(-38%) rotate(14deg)" }} />
        <img
          src="/popcorn.png"
          alt="Popcorn Pass"
          className="relative z-10 h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
