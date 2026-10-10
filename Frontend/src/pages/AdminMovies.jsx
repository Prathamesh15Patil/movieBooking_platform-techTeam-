import { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================
   CONFIG — everything you may need to change lives here.
   See setup.md for details.
   ============================================================ */
const CONFIG = {
  DEMO_MODE: true, // true = saves in browser localStorage (no backend needed). Set false to use your API.
  API_BASE: "http://localhost:5000/api", // your backend URL
  ROUTES: {
    movies: "/movies", // GET list, POST create, PUT /movies/:id, DELETE /movies/:id
    upload: "/upload", // POST multipart (field "file") -> { url }
  },
  TOKEN_KEY: "adminToken", // localStorage key holding your admin JWT/token (sent as Bearer)
  CURRENCY: "₹",
  MAX_UPLOAD_MB: 50,
  LANGUAGES: ["English", "Hindi", "Kannada", "Tamil", "Telugu", "Malayalam", "Marathi", "Bengali"],
  GENRES: ["Action", "Adventure", "Animation", "Comedy", "Crime", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi", "Thriller"],
  FORMATS: ["2D", "3D", "IMAX", "4DX"],
  CERTIFICATES: ["U", "UA", "A", "S"],
  STATUSES: [
    { value: "now_showing", label: "Now showing" },
    { value: "upcoming", label: "Upcoming" },
    { value: "archived", label: "Archived" },
  ],
};

/* ---------------- data layer ---------------- */
const DEMO_KEY = "demo_movies";
const uid = () => Math.random().toString(36).slice(2, 9);

async function api(path, opts = {}) {
  const token = localStorage.getItem(CONFIG.TOKEN_KEY);
  const isForm = opts.body instanceof FormData;
  const res = await fetch(CONFIG.API_BASE + path, {
    ...opts,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.status === 204 ? null : res.json();
}

const demoRead = () => JSON.parse(localStorage.getItem(DEMO_KEY) || "[]");
const demoWrite = (list) => localStorage.setItem(DEMO_KEY, JSON.stringify(list));

const store = {
  async list() {
    return CONFIG.DEMO_MODE ? demoRead() : api(CONFIG.ROUTES.movies);
  },
  async save(movie, isNew) {
    if (CONFIG.DEMO_MODE) {
      const list = demoRead();
      const saved = isNew ? { ...movie, id: "movie" + Date.now() } : movie;
      demoWrite(isNew ? [saved, ...list] : list.map((m) => (m.id === saved.id ? saved : m)));
      return saved;
    }
    return isNew
      ? api(CONFIG.ROUTES.movies, { method: "POST", body: JSON.stringify(movie) })
      : api(`${CONFIG.ROUTES.movies}/${movie.id}`, { method: "PUT", body: JSON.stringify(movie) });
  },
  async remove(id) {
    if (CONFIG.DEMO_MODE) return demoWrite(demoRead().filter((m) => m.id !== id));
    return api(`${CONFIG.ROUTES.movies}/${id}`, { method: "DELETE" });
  },
  async upload(file) {
    if (file.size > CONFIG.MAX_UPLOAD_MB * 1024 * 1024) throw new Error(`File is larger than ${CONFIG.MAX_UPLOAD_MB} MB`);
    if (CONFIG.DEMO_MODE) {
      return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = () => reject(new Error("Could not read file"));
        r.readAsDataURL(file);
      });
    }
    const fd = new FormData();
    fd.append("file", file);
    const out = await api(CONFIG.ROUTES.upload, { method: "POST", body: fd });
    return out.url;
  },
};

const blankMovie = () => ({
  id: "", title: "", description: "", poster: "", trailer: "", duration: "",
  languages: [], genre: [], releaseDate: "", certificate: "UA", status: "now_showing", shows: [],
});
const blankShow = (prev) => ({
  id: uid(), date: prev?.date || "", time: "", screen: prev?.screen || "",
  language: prev?.language || "", format: prev?.format || "2D", price: prev?.price || "",
});

function validate(m) {
  const e = {};
  if (!m.title.trim()) e.title = "Add a title";
  if (!m.description.trim()) e.description = "Add a short description";
  if (!m.poster) e.poster = "Upload a poster";
  if (!(Number(m.duration) > 0)) e.duration = "Enter duration in minutes";
  if (!m.releaseDate) e.releaseDate = "Pick a release date";
  if (!m.languages.length) e.languages = "Choose at least one language";
  if (!m.genre.length) e.genre = "Choose at least one genre";
  m.shows.forEach((s) => {
    if (!s.date || !s.time || !s.language || !(Number(s.price) >= 0) || s.price === "")
      e.shows = "Every showtime needs a date, time, language and price";
  });
  return e;
}

/* ---------------- small components ---------------- */
function Chips({ options, value, onChange, customLabel }) {
  const [draft, setDraft] = useState("");
  const all = [...new Set([...options, ...value])];
  const toggle = (o) => onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o]);
  const add = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft("");
  };
  return (
    <div>
      <div className="ma-chips">
        {all.map((o) => (
          <button type="button" key={o} className={"ma-chip" + (value.includes(o) ? " on" : "")} onClick={() => toggle(o)} aria-pressed={value.includes(o)}>
            {value.includes(o) ? "✓ " : "+ "}{o}
          </button>
        ))}
      </div>
      <div className="ma-inline">
        <input value={draft} placeholder={customLabel} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} />
        <button type="button" className="ma-btn ghost" onClick={add}>Add</button>
      </div>
    </div>
  );
}

function FileDrop({ kind, value, onChange, onError }) {
  const ref = useRef();
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const accept = kind === "image" ? "image/*" : "video/*";
  const handle = async (file) => {
    if (!file) return;
    if (!file.type.startsWith(kind)) return onError(`Please choose a${kind === "image" ? "n image" : " video"} file`);
    setBusy(true);
    try { onChange(await store.upload(file)); } catch (err) { onError(err.message); }
    setBusy(false);
  };
  return (
    <div
      className={"ma-drop" + (over ? " over" : "") + (value && kind === "image" ? " has" : "")}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); handle(e.dataTransfer.files[0]); }}
    >
      {value && kind === "image" && <img src={value} alt="Poster preview" />}
      {value && kind === "video" && <video src={value} controls />}
      <div className="ma-drop-msg">
        {busy ? "Uploading…" : value ? "Replace file" : `Drag a ${kind} here or`}
        <button type="button" className="ma-btn ghost" disabled={busy} onClick={() => ref.current.click()}>Choose file</button>
        {value && <button type="button" className="ma-btn link" onClick={() => onChange("")}>Remove</button>}
      </div>
      <input ref={ref} type="file" accept={accept} hidden onChange={(e) => { handle(e.target.files[0]); e.target.value = ""; }} />
    </div>
  );
}

function Field({ label, error, hint, children, wide }) {
  return (
    <label className={"ma-field" + (wide ? " wide" : "") + (error ? " bad" : "")}>
      <span className="ma-label">{label}</span>
      {children}
      {error ? <span className="ma-err">{error}</span> : hint ? <span className="ma-hint">{hint}</span> : null}
    </label>
  );
}

/* ---------------- page ---------------- */
export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blankMovie());
  const [isNew, setIsNew] = useState(true);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  const say = (text, bad) => {
    setToast({ text, bad });
    setTimeout(() => setToast(null), 3500);
  };

  const refresh = async () => {
    try { setMovies(await store.list()); } catch (e) { say("Could not load movies: " + e.message, true); }
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(
    () => movies.filter((m) => m.title?.toLowerCase().includes(query.toLowerCase())),
    [movies, query]
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setShow = (id, k, v) => set("shows", form.shows.map((s) => (s.id === id ? { ...s, [k]: v } : s)));

  const openMovie = (m) => { setForm({ ...blankMovie(), ...m, shows: m.shows || [] }); setIsNew(false); setErrors({}); window.scrollTo?.({ top: 0 }); };
  const startNew = () => { setForm(blankMovie()); setIsNew(true); setErrors({}); };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return say("Fix the highlighted fields and try again", true);
    setSaving(true);
    try {
      const payload = { ...form, duration: Number(form.duration), shows: form.shows.map((s) => ({ ...s, price: Number(s.price) })) };
      const saved = await store.save(payload, isNew);
      await refresh();
      setForm({ ...blankMovie(), ...saved, shows: saved.shows || [] });
      setIsNew(false);
      say(isNew ? "Movie published" : "Changes saved");
    } catch (err) { say("Save failed: " + err.message, true); }
    setSaving(false);
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${form.title}"? This cannot be undone.`)) return;
    try { await store.remove(form.id); await refresh(); startNew(); say("Movie deleted"); }
    catch (err) { say("Delete failed: " + err.message, true); }
  };

  return (
    <div className="ma">
      <style>{CSS}</style>
      <header className="ma-top">
        <div>
          <h1>Movie manager</h1>
          <p>{CONFIG.DEMO_MODE ?" " : `${movies.length} movies in your catalogue`}</p>
        </div>
        <button className="ma-btn primary" onClick={startNew}>+ Add new movie</button>
      </header>

      <div className="ma-grid">
        <aside className="ma-list">
          <input className="ma-search" placeholder="Search movies" value={query} onChange={(e) => setQuery(e.target.value)} />
          {loading && <p className="ma-hint">Loading…</p>}
          {!loading && !filtered.length && <p className="ma-hint">{movies.length ? "No movie matches that search." : "No movies yet. Fill in the form to add your first one."}</p>}
          {filtered.map((m) => (
            <button key={m.id} className={"ma-row" + (m.id === form.id && !isNew ? " sel" : "")} onClick={() => openMovie(m)}>
              {m.poster ? <img src={m.poster} alt="" /> : <span className="ph" />}
              <span>
                <strong>{m.title}</strong>
                <small>{(m.languages || []).join(", ")} · {(m.shows || []).length} shows</small>
              </span>
            </button>
          ))}
        </aside>

        <form className="ma-form" onSubmit={submit} noValidate>
          <h2>{isNew ? "New movie" : `Editing: ${form.title || "Untitled"}`}</h2>

          <section>
            <h3>Details</h3>
            <div className="ma-cols">
              <Field label="Title" error={errors.title} wide><input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Interstellar" /></Field>
              <Field label="Description" error={errors.description} wide><textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What is the movie about?" /></Field>
              <Field label="Duration (minutes)" error={errors.duration}><input type="number" min="1" value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="169" /></Field>
              <Field label="Release date" error={errors.releaseDate}><input type="date" value={form.releaseDate} onChange={(e) => set("releaseDate", e.target.value)} /></Field>
              <Field label="Certificate"><select value={form.certificate} onChange={(e) => set("certificate", e.target.value)}>{CONFIG.CERTIFICATES.map((c) => <option key={c}>{c}</option>)}</select></Field>
              <Field label="Status"><select value={form.status} onChange={(e) => set("status", e.target.value)}>{CONFIG.STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></Field>
            </div>
          </section>

          <section>
            <h3>Languages and genres</h3>
            <Field label="Languages" error={errors.languages} wide>
              <Chips options={CONFIG.LANGUAGES} value={form.languages} onChange={(v) => set("languages", v)} customLabel="Another language" />
            </Field>
            <Field label="Genres" error={errors.genre} wide>
              <Chips options={CONFIG.GENRES} value={form.genre} onChange={(v) => set("genre", v)} customLabel="Another genre" />
            </Field>
          </section>

          <section>
            <h3>Media</h3>
            <div className="ma-cols">
              <Field label="Poster" error={errors.poster} hint="JPG or PNG, portrait works best"><FileDrop kind="image" value={form.poster} onChange={(v) => set("poster", v)} onError={(m) => say(m, true)} /></Field>
              <Field label="Trailer" hint="Paste a YouTube link, or upload a video file">
                <input value={form.trailer.startsWith("data:") ? "" : form.trailer} onChange={(e) => set("trailer", e.target.value)} placeholder="https://youtube.com/watch?v=…" />
                <FileDrop kind="video" value={/^(data:|blob:|\/)/.test(form.trailer) || /\.(mp4|webm)$/i.test(form.trailer) ? form.trailer : ""} onChange={(v) => set("trailer", v)} onError={(m) => say(m, true)} />
              </Field>
            </div>
          </section>

          <section>
            <div className="ma-sec-head">
              <h3>Showtimes and prices</h3>
              <button type="button" className="ma-btn ghost" onClick={() => set("shows", [...form.shows, blankShow(form.shows[form.shows.length - 1])])}>+ Add showtime</button>
            </div>
            {errors.shows && <p className="ma-err">{errors.shows}</p>}
            {!form.shows.length && <p className="ma-hint">No showtimes yet. New rows copy the previous row, so repeating a show is quick.</p>}
            {form.shows.map((s) => (
              <div className="ma-show" key={s.id}>
                <Field label="Date"><input type="date" value={s.date} onChange={(e) => setShow(s.id, "date", e.target.value)} /></Field>
                <Field label="Time"><input type="time" value={s.time} onChange={(e) => setShow(s.id, "time", e.target.value)} /></Field>
                <Field label="Screen / theatre"><input value={s.screen} onChange={(e) => setShow(s.id, "screen", e.target.value)} placeholder="Screen 1" /></Field>
                <Field label="Language">
                  <select value={s.language} onChange={(e) => setShow(s.id, "language", e.target.value)}>
                    <option value="">Select</option>
                    {form.languages.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Format"><select value={s.format} onChange={(e) => setShow(s.id, "format", e.target.value)}>{CONFIG.FORMATS.map((f) => <option key={f}>{f}</option>)}</select></Field>
                <Field label={`Price (${CONFIG.CURRENCY})`}><input type="number" min="0" value={s.price} onChange={(e) => setShow(s.id, "price", e.target.value)} placeholder="250" /></Field>
                <div className="ma-show-actions">
                  <button type="button" className="ma-btn link" onClick={() => set("shows", [...form.shows, { ...s, id: uid() }])}>Duplicate</button>
                  <button type="button" className="ma-btn link danger" onClick={() => set("shows", form.shows.filter((x) => x.id !== s.id))}>Remove</button>
                </div>
              </div>
            ))}
          </section>

          <div className="ma-bar">
            {!isNew && <button type="button" className="ma-btn link danger" onClick={remove}>Delete movie</button>}
            <span style={{ flex: 1 }} />
            <button type="button" className="ma-btn ghost" onClick={isNew ? startNew : () => openMovie(movies.find((m) => m.id === form.id) || form)}>Discard changes</button>
            <button className="ma-btn primary" disabled={saving}>{saving ? "Saving…" : isNew ? "Publish movie" : "Save changes"}</button>
          </div>
        </form>
      </div>

      {toast && <div className={"ma-toast" + (toast.bad ? " bad" : "")} role="status">{toast.text}</div>}
    </div>
  );
}

/* ---------------- styles (scoped with the .ma prefix) ---------------- */
const CSS = `
.ma{--ink:#16213a;--mute:#5d6a85;--line:#d9dfeb;--bg:#eef1f6;--card:#fff;--accent:#e8a317;--accent-ink:#2a1d00;--bad:#c2362b;--ok:#17714f;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--ink);background:var(--bg);min-height:100vh;padding:24px;box-sizing:border-box}
.ma *{box-sizing:border-box}
.ma-top{display:flex;justify-content:space-between;align-items:center;gap:16px;max-width:1280px;margin:0 auto 20px}
.ma-top h1{margin:0;font-size:26px}.ma-top p{margin:4px 0 0;color:var(--mute);font-size:14px}
.ma-grid{display:grid;grid-template-columns:320px 1fr;gap:20px;max-width:1280px;margin:0 auto;align-items:start}
.ma-list{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px;position:sticky;top:12px;max-height:calc(100vh - 40px);overflow:auto}
.ma-search{width:100%;margin-bottom:8px}
.ma-row{display:flex;gap:10px;align-items:center;width:100%;text-align:left;background:none;border:1px solid transparent;border-radius:8px;padding:8px;cursor:pointer;color:inherit;font:inherit}
.ma-row:hover{background:var(--bg)}.ma-row.sel{border-color:var(--ink);background:var(--bg)}
.ma-row img,.ma-row .ph{width:40px;height:56px;object-fit:cover;border-radius:4px;background:var(--line);flex:none}
.ma-row strong{display:block;font-size:14px}.ma-row small{color:var(--mute);font-size:12px}
.ma-form{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:24px}
.ma-form h2{margin:0 0 4px;font-size:20px}
.ma-form section{padding:18px 0;border-top:1px solid var(--line);margin-top:16px}
.ma-form h3{margin:0 0 12px;font-size:16px}
.ma-sec-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.ma-sec-head h3{margin:0}
.ma-cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ma-field{display:flex;flex-direction:column;gap:6px;margin-bottom:6px}.ma-field.wide{grid-column:1/-1}
.ma-label{font-size:13px;font-weight:600}
.ma input:not([type=file]),.ma select,.ma textarea{width:100%;padding:9px 11px;border:1px solid var(--line);border-radius:8px;font:inherit;font-size:14px;background:#fff;color:var(--ink)}
.ma textarea{resize:vertical}
.ma input:focus,.ma select:focus,.ma textarea:focus,.ma button:focus-visible{outline:2px solid var(--ink);outline-offset:1px}
.ma-field.bad input,.ma-field.bad select,.ma-field.bad textarea,.ma-field.bad .ma-drop{border-color:var(--bad)}
.ma-err{color:var(--bad);font-size:12.5px;margin:2px 0}.ma-hint{color:var(--mute);font-size:12.5px;margin:2px 0}
.ma-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.ma-chip{border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;cursor:pointer;color:var(--ink)}
.ma-chip.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.ma-inline{display:flex;gap:8px;max-width:360px}
.ma-btn{border:1px solid transparent;border-radius:8px;padding:9px 16px;font:inherit;font-size:14px;font-weight:600;cursor:pointer}
.ma-btn.primary{background:var(--accent);color:var(--accent-ink)}.ma-btn.primary:hover{filter:brightness(.95)}
.ma-btn.ghost{background:#fff;border-color:var(--line);color:var(--ink)}
.ma-btn.link{background:none;padding:6px 8px;color:var(--ink);text-decoration:underline}.ma-btn.danger{color:var(--bad)}
.ma-btn:disabled{opacity:.6;cursor:wait}
.ma-drop{border:2px dashed var(--line);border-radius:10px;padding:12px;text-align:center;background:#fafbfd;margin-top:6px}
.ma-drop.over{border-color:var(--accent);background:#fff8e6}
.ma-drop img{max-height:220px;max-width:100%;border-radius:6px;margin-bottom:8px}.ma-drop video{max-width:100%;max-height:200px;margin-bottom:8px}
.ma-drop-msg{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;font-size:13px;color:var(--mute)}
.ma-show{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;padding:12px;border:1px solid var(--line);border-radius:10px;margin-top:10px;background:#fafbfd;position:relative}
.ma-show-actions{grid-column:1/-1;display:flex;justify-content:flex-end;gap:4px}
.ma-bar{position:sticky;bottom:0;display:flex;gap:10px;align-items:center;background:var(--card);padding:14px 0 0;margin-top:18px;border-top:1px solid var(--line)}
.ma-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--ok);color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;z-index:50;box-shadow:0 6px 24px rgba(0,0,0,.2)}
.ma-toast.bad{background:var(--bad)}
@media(max-width:1000px){.ma-show{grid-template-columns:repeat(3,1fr)}}
@media(max-width:820px){.ma{padding:14px}.ma-grid{grid-template-columns:1fr}.ma-list{position:static;max-height:260px}.ma-cols{grid-template-columns:1fr}.ma-show{grid-template-columns:1fr 1fr}.ma-top{flex-direction:column;align-items:flex-start}}
`;
