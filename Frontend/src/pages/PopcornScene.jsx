import { useEffect, useRef } from "react";

// ---------- shared theme (aurora) ----------
export const grad = "linear-gradient(135deg,#7c4dff,#12d6a0)";
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
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" style={{ opacity: 0.75 }} />;
}

// ---------- geometry helpers ----------
const star = (R, r, cx = 50, cy = 52, n = 5) =>
  Array.from({ length: 2 * n }, (_, i) => {
    const a = (i * Math.PI) / n - Math.PI / 2, d = i % 2 ? r : R;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  });
const pts = (a) => a.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ");

// ---------- popcorn: lumpy outlined kernels over a striped bucket with a "POP CORN" label ----------
const LOBES = [[-0.15, -0.42, 0.42], [0.3, -0.4, 0.38], [-0.45, 0.2, 0.42], [0.45, 0.15, 0.45], [0, 0, 0.55]]; // [dx, dy, r] × size
const TONES = ["#fdf08a", "#fff6b0", "#f6dc55", "#fff3a0", "#fbe66a"];
const KERNELS = [ // [x, y, size] back → front
  [50, 14, 11], [33, 17, 11], [67, 17, 11], [19, 27, 10.5], [81, 27, 10.5], [42, 24, 12], [58, 24, 12],
  [29, 35, 11], [71, 35, 11], [50, 34, 12.5], [14, 43, 9.5], [86, 43, 9.5], [37, 45, 11], [63, 45, 11],
  [24, 50, 10], [76, 50, 10], [50, 55, 11],
];
const Kernel = ([x, y, s], k) => (
  <g key={k} stroke="#5b2412" strokeWidth="1.2" strokeLinejoin="round">
    {LOBES.map(([dx, dy, r], i) => <circle key={i} cx={x + dx * s} cy={y + dy * s} r={r * s} fill={TONES[(i + k) % 5]} />)}
    <path
      d={`M${x - 0.35 * s} ${y + 0.45 * s}q${0.3 * s} ${0.18 * s} ${0.6 * s} 0M${x + 0.1 * s} ${y + 0.6 * s}q${0.25 * s} ${0.12 * s} ${0.45 * s} -0.05`}
      fill="none" stroke="#c9981e" strokeWidth=".7"
    />
  </g>
);
const BODY = "M5 56Q50 76 95 56L83 118Q50 130 17 118Z";
const BURST = star(21, 16.5, 50, 92, 8);

// ---------- marquee star (lit bulbs along a gold frame) ----------
const S_OUT = pts(star(48, 22)), S_IN = pts(star(30, 13.5));
const S_BULB = star(39, 17.6);
const BULBS = S_BULB.flatMap((p, i) => { const q = S_BULB[(i + 1) % 10]; return [p, [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]]; });

const MStar = ({ r, d, style }) => (
  <svg viewBox="0 0 100 96" style={{ "--r": `${r}deg`, filter: "drop-shadow(0 0 7px rgba(255,200,60,.55))", animation: `pp-bob ${4 + (d % 3)}s ease-in-out ${-d}s infinite alternate`, ...style }}>
    <polygon points={S_OUT} fill="url(#pp-gold)" stroke="#b97a00" strokeWidth="1" strokeLinejoin="round" />
    <polygon points={S_IN} fill="url(#pp-ruby)" stroke="#e8a800" strokeWidth="1.2" strokeLinejoin="round" />
    {BULBS.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="2.3" fill="#fff6c4" style={{ animation: `pp-bulb 1.4s ease-in-out ${(i % 2) * 0.7 - d * 0.3}s infinite alternate` }} />
    ))}
  </svg>
);

// ---------- props: defined once, reused everywhere via <use> ----------
const VB = { tk: [210, 120], pc: [100, 130], cb: [110, 110], cm: [80, 60], rl: [60, 60], st: [24, 24] };

const Defs = () => (
  <svg width="0" height="0" className="absolute" aria-hidden="true">
    <defs>
      <linearGradient id="pp-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffe27a" /><stop offset=".5" stopColor="#f2b51c" /><stop offset="1" stopColor="#c98200" />
      </linearGradient>
      <radialGradient id="pp-ruby"><stop offset="0" stopColor="#b01212" /><stop offset="1" stopColor="#6a0606" /></radialGradient>
      <linearGradient id="pp-kraft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#efd5a2" /><stop offset="1" stopColor="#d8b06b" /></linearGradient>
      <linearGradient id="pp-shade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#3c0000" stopOpacity=".3" /><stop offset=".3" stopColor="#3c0000" stopOpacity="0" />
        <stop offset=".7" stopColor="#3c0000" stopOpacity="0" /><stop offset="1" stopColor="#3c0000" stopOpacity=".32" />
      </linearGradient>

      <symbol id="pp-pc" viewBox="0 0 100 130">
        <clipPath id="pp-bd"><path d={BODY} /></clipPath>
        {KERNELS.map(Kernel)}
        <path d={BODY} fill="#fff1cf" />
        <g clipPath="url(#pp-bd)">
          <g fill="#e11d2e">
            {[0, 2, 4, 6].map((i) => <path key={i} d={`M${3.8 + 13.2 * i} 50h13.2L${19.3 + 8.77 * (i + 1)} 130h-8.77z`} />)}
          </g>
          <rect y="50" width="100" height="80" fill="url(#pp-shade)" />
        </g>
        <path d={BODY} fill="none" stroke="#5b1a10" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M3 50Q50 70 97 50L95 62Q50 82 5 62Z" fill="#fff4d6" stroke="#5b1a10" strokeWidth="1.6" strokeLinejoin="round" />
        <polygon points={pts(BURST)} fill="#fff6e2" stroke="#d8402f" strokeWidth="1.1" strokeLinejoin="round" />
        {BURST.filter((_, i) => i % 2 === 0).map(([x, y], i) => <circle key={i} cx={x} cy={y} r=".9" fill="#ffc83a" />)}
        <ellipse cx="50" cy="92" rx="13.5" ry="11.5" fill="#f6c6a5" />
        <g fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="9.5" fill="#d8402f" textAnchor="middle">
          <text x="50" y="90">POP</text><text x="50" y="100">CORN</text>
        </g>
      </symbol>

      <symbol id="pp-tk" viewBox="0 0 210 120">
        <mask id="pp-tm">
          <rect width="210" height="120" fill="#fff" />
          {[[0, 0], [210, 0], [0, 120], [210, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" />)}
          {Array.from({ length: 18 }, (_, i) => <circle key={`s${i}`} cx={i % 2 ? 210 : 0} cy={14 + (i >> 1) * 11.5} r="2.4" />)}
        </mask>
        <g mask="url(#pp-tm)" fontFamily="Georgia,'Times New Roman',serif" fontWeight="900" fill="#3b2f27" textAnchor="middle">
          <rect width="210" height="120" rx="4" fill="url(#pp-kraft)" />
          <g fill="none" stroke="#d3261c" strokeWidth="2.4">
            <rect x="9" y="9" width="192" height="102" rx="9" />
            <path d="M44 9V111M166 9V111M44 38H166M44 88H166" strokeWidth="2" />
          </g>
          <text x="105" y="29" fontSize="14" textLength="92" lengthAdjust="spacingAndGlyphs">MOVIE NAME</text>
          <text x="105" y="62" fontSize="26" textLength="112" lengthAdjust="spacingAndGlyphs">CINEMA</text>
          <text x="105" y="85" fontSize="26" textLength="112" lengthAdjust="spacingAndGlyphs">TICKET</text>
          <text x="105" y="106" fontSize="13" textLength="74" lengthAdjust="spacingAndGlyphs">ADMIT ONE</text>
          {[[53, 24], [157, 24], [53, 100], [157, 100]].map(([x, y], i) => <polygon key={i} points={pts(star(5.5, 2.4, x, y))} fill="#5a4a3f" />)}
          <text transform="translate(27 60) rotate(-90)" fontSize="13" textLength="78">B 00264638</text>
          <text transform="translate(183 60) rotate(90)" fontSize="13" textLength="78">B 00264638</text>
        </g>
      </symbol>

      <symbol id="pp-cb" viewBox="0 0 110 110">
        <g transform="translate(5 5)">
          {[{ fill: "#fff", stroke: "#fff", strokeWidth: 6, strokeLinejoin: "round" }, { fill: "#0b0b0b" }].map((p, k) => (
            <g key={k} {...p}>
              <rect x="6" y="52" width="88" height="44" rx="2" />
              <rect x="6" y="40" width="88" height="12" />
              <rect x="6" y="24" width="88" height="14" transform="rotate(-14 6 40)" />
            </g>
          ))}
          <g fill="#fff">
            {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${14 + i * 16} 40h8l-6 12h-8z`} />)}
            <g transform="rotate(-14 6 40)">
              {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${14 + i * 16} 24h8l-6 14h-8z`} />)}
            </g>
            <g fontFamily="Arial,Helvetica,sans-serif" fontSize="6.5">
              <text x="10" y="60">PRODUCTION</text><text x="10" y="71">SCENE</text><text x="54" y="71">TAKE</text>
              <text x="10" y="82">DIRECTOR</text><text x="10" y="92">CAMERA</text>
            </g>
          </g>
          <path d="M6 63H94M6 74H94M6 85H94M50 63V74" stroke="#fff" strokeWidth=".6" />
        </g>
      </symbol>

      <symbol id="pp-cm" viewBox="0 0 80 60">
        <g fill="#10131c" stroke="#fff" strokeWidth="2" strokeLinejoin="round">
          <path d="M6 14h14l4-8h32l4 8h14a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z" />
          <circle cx="40" cy="34" r="15" />
          <circle cx="40" cy="34" r="7" />
        </g>
        <rect x="9" y="19" width="9" height="5" rx="1" fill="#fff" />
      </symbol>

      <symbol id="pp-rl" viewBox="0 0 60 60">
        <g fill="#10131c" stroke="#fff" strokeWidth="2">
          <circle cx="30" cy="30" r="27" />
          <circle cx="30" cy="30" r="4" />
          {[[45, 30], [34.6, 44.3], [17.9, 38.8], [17.9, 21.2], [34.6, 15.7]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6.5" />)}
        </g>
      </symbol>

      <symbol id="pp-st" viewBox="0 0 24 24">
        <path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" fill="#fff" />
      </symbol>
    </defs>
  </svg>
);

const Sym = ({ k, className, style }) => {
  const [w, h] = VB[k];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} style={style}>
      <use href={`#pp-${k}`} width={w} height={h} />
    </svg>
  );
};

// ---------- theatre spotlights hanging from a curved truss ----------
const LAMPS = [0.06, 0.2, 0.34, 0.5, 0.66, 0.8, 0.94];
const Spots = () => (
  <div className="absolute inset-x-0 top-0 h-0">
    <svg className="absolute left-0 top-0 h-16 w-full" viewBox="0 0 100 64" preserveAspectRatio="none" fill="none">
      <path d="M0 8Q50 56 100 8M0 15Q50 63 100 15" stroke="#fff" strokeOpacity=".22" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
    {LAMPS.map((t, i) => (
      <div key={t} className="absolute" style={{ left: `${t * 100}%`, top: 8 + 96 * t * (1 - t) }}>
        <div
          className="absolute -left-[95px] top-0 h-[78vh] w-[190px]"
          style={{ transformOrigin: "50% 0", filter: "blur(6px)", mixBlendMode: "screen", "--a": `${(t - 0.5) * 64}deg`, animation: `pp-sway ${6 + i}s ease-in-out ${-i}s infinite alternate` }}
        >
          <div
            className="h-full w-full"
            style={{ clipPath: "polygon(46% 0,54% 0,100% 100%,0 100%)", background: "linear-gradient(to bottom,rgba(255,214,120,.55),rgba(255,190,80,.16) 60%,transparent)" }}
          />
        </div>
        <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-[#fff4cc]" style={{ boxShadow: "0 0 14px 6px rgba(255,200,90,.8)" }} />
      </div>
    ))}
  </div>
);

// ---------- film tape: narrow 35mm-style strips (see-through sprocket holes, photo frames) on a seamless loop ----------
const TW = 168, TH = 42;
const PHOTOS = [ // [sky top, sky bottom, silhouette colour, silhouette path, optional [sunX, sunY, r, colour]]
  ["#ffb36b", "#7a3a8a", "#1b1030", "M0 26V19Q8 13 15 18T34 16V26Z", [24, 13, 4.5, "#fff1c2"]],
  ["#1b2f66", "#4aa3ff", "#0a1430", "M0 26L9 12L15 19L23 9L34 26Z"],
  ["#06323a", "#2cf2a8", "#04161a", "M0 26V20L4 12L8 20L13 10L18 20L23 13L27 20L34 17V26Z"],
  ["#4a2a1a", "#f0b45a", "#120a05", "M0 26V16H6V11H11V18H17V8H23V15H28V19H34V26Z", [8, 8, 3, "#fff3c4"]],
];
const holes = Array.from({ length: 28 }, (_, k) => `<rect x="${1.2 + 6 * k}" y="1.8" width="3.6" height="4.4" rx=".9"/><rect x="${1.2 + 6 * k}" y="35.8" width="3.6" height="4.4" rx=".9"/>`).join("");
const photos = PHOTOS.map(([a, b, sil, path, sun], i) =>
  `<linearGradient id="f${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>` +
  `<g transform="translate(${i * 42 + 4} 8)"><rect width="34" height="26" rx="1.5" fill="url(#f${i})"/>${sun ? `<circle cx="${sun[0]}" cy="${sun[1]}" r="${sun[2]}" fill="${sun[3]}"/>` : ""}<path d="${path}" fill="${sil}"/><rect width="34" height="26" rx="1.5" fill="none" stroke="#000" stroke-opacity=".55"/></g>`).join("");
const TILE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="${TH}"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1915"/><stop offset=".5" stop-color="#0d0b09"/><stop offset="1" stop-color="#1e1915"/></linearGradient><mask id="m"><rect width="${TW}" height="${TH}" fill="#fff"/><g fill="#000">${holes}</g></mask></defs><rect width="${TW}" height="${TH}" fill="url(#b)" mask="url(#m)"/><path d="M0 .6H${TW}M0 ${TH - 0.6}H${TW}" stroke="#fff" stroke-opacity=".16" stroke-width=".8"/>${photos}</svg>`
)}")`;

// [top%, scale, tilt deg, seconds per tile, reverse]
const FILMS = [[24, 1, -4, 3.8, 0], [46, 0.85, 3, 3.0, 1], [68, 1, -3, 4.2, 1], [90, 0.85, 4, 3.4, 0]];
const FADE = "linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent)";

const Film = ([top, s, rot, dur, rev]) => (
  <div
    key={top}
    className="absolute -left-[5%] w-[110%] overflow-hidden"
    style={{ top: `${top}%`, height: TH * s, transform: `rotate(${rot}deg)`, opacity: 0.7, maskImage: FADE, WebkitMaskImage: FADE }}
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

// [symbol, left%, top%, width px, rotation, float seconds, delay]
const ITEMS = [
  ["tk", 16, 30, 118, -14, 9, 0], ["tk", 74, 12, 108, 10, 11, -3], ["tk", 56, 74, 118, -8, 10, -5],
  ["tk", 6, 62, 100, 12, 12, -2], ["tk", 88, 40, 100, -16, 8, -6], ["tk", 30, 88, 96, 6, 10, -7],
  ["pc", 28, 12, 46, 8, 8, -1], ["pc", 93, 58, 50, -10, 9, -4], ["pc", 3, 40, 44, -6, 10, -2],
  ["cm", 46, 89, 64, 6, 11, -1], ["cm", 11, 86, 58, -8, 9, -6], ["cm", 70, 32, 56, 10, 10, -3],
  ["rl", 82, 22, 50, 0, 12, -2], ["rl", 66, 88, 44, 0, 10, -5],
  ["st", 40, 8, 14, 0, 5, -2], ["st", 72, 40, 14, 0, 7, -3], ["st", 34, 58, 12, 0, 6, -4],
  ["st", 60, 52, 12, 0, 6, -5], ["st", 26, 70, 14, 0, 8, -3],
];

// Marquee star clusters in two opposite corners: [width, inset-x, inset-y] per star
const CORNERS = [["left-0 top-0 origin-top-left", "left", "top", [-14, 12, -8]], ["bottom-0 right-0 origin-bottom-right", "right", "bottom", [12, -12, 8]]];
const SIZES = [[112, 14, 16], [72, 96, 104], [48, 22, 150]];

const CSS = `
@keyframes pp-float{from{transform:translate(0,0) rotate(var(--r))}to{transform:translate(14px,-22px) rotate(calc(var(--r) + 8deg))}}
@keyframes pp-film{to{transform:translateX(calc(var(--d) * -1))}}
@keyframes pp-sway{from{transform:rotate(calc(var(--a) - 2deg))}to{transform:rotate(calc(var(--a) + 2deg))}}
@keyframes pp-bulb{from{opacity:.3}to{opacity:1}}
@keyframes pp-bob{from{transform:translateY(0) rotate(var(--r))}to{transform:translateY(-7px) rotate(calc(var(--r) + 3deg))}}`;

// Full-screen background: aurora + stage lights + scrolling film tape + floating tickets and props + corner stars.
export function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-black" aria-hidden="true">
      <style>{CSS}</style>
      <Defs />
      <Aurora />
      <Spots />
      {FILMS.map(Film)}
      {ITEMS.map(([k, x, y, w, r, dur, delay], i) => (
        <Sym
          key={i}
          k={k}
          className="absolute"
          style={{ left: `${x}%`, top: `${y}%`, width: w, opacity: 0.6, "--r": `${r}deg`, animation: `pp-float ${dur}s ease-in-out ${delay}s infinite alternate` }}
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

// Clapperboard sticker for the top-left corner of a card (parent must be `relative`).
export function Clapper() {
  return (
    <Sym
      k="cb"
      className="pointer-events-none absolute -left-3 -top-6 w-[4.5rem] -rotate-12 overflow-visible sm:-left-7 sm:-top-8 sm:w-24"
      style={{ margin: 0, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.55))" }}
    />
  );
}

// "Popcorn Pass" title with a popcorn bucket and two cinema tickets tucked into it.
export function Brand() {
  return (
    <div className="relative left-1/2 mb-8 flex w-max max-w-[92vw] -translate-x-1/2 flex-wrap items-center justify-center gap-x-3 gap-y-1">
      <h1
        className="text-[1.9rem] font-black tracking-tight sm:text-6xl"
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          backgroundImage: "linear-gradient(120deg,#fff 5%,#c8ffe6 30%,#2dffa4 55%,#12d6df 75%,#9b5cff 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 28px rgba(45,255,164,.4))",
        }}
      >
        Popcorn Pass
      </h1>
      <div className="relative mt-4 h-16 sm:h-24" style={{ aspectRatio: "100/130", filter: "drop-shadow(0 0 16px rgba(255,200,90,.35))" }}>
        <Sym k="tk" className="absolute -top-2 left-1/2 z-0 w-[125%]" style={{ transform: "translateX(-62%) rotate(-20deg)" }} />
        <Sym k="tk" className="absolute -top-3 left-1/2 z-0 w-[125%]" style={{ transform: "translateX(-40%) rotate(14deg)" }} />
        <Sym k="pc" className="relative z-10 h-full w-full" />
      </div>
    </div>
  );
}
