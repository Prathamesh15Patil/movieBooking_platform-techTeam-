import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);
  if (!state?.show || !state?.seats) return <main className="p-10 text-white">Your seat selection has expired. <Link className="text-violet-300" to="/movies">Choose a movie again.</Link></main>;
  const confirm = async () => { setBusy(true); setError(""); try { setBooking(await api.createBooking({ show: state.show._id, seats: state.seats })); } catch (e) { setError(e.message); } finally { setBusy(false); } };
  return <main className="min-h-screen bg-slate-950 px-6 py-12 text-white"><div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8"><h1 className="text-3xl font-bold">{booking ? "Booking confirmed" : "Review booking"}</h1>{booking ? <><p className="mt-5 text-emerald-300">Payment simulated successfully.</p><p className="mt-3 text-white/70">Reference: {booking._id}<br />Payment ID: {booking.paymentId}<br />Amount: ₹{booking.totalAmount}</p><Link to="/booking" className="mt-8 inline-block rounded-xl bg-violet-600 px-5 py-3 font-semibold">View bookings</Link></> : <><p className="mt-5 text-white/70">{state.show.movie?.title || "Movie"} · {state.seats.join(", ")}</p><p className="mt-2 text-white/50">Hold expires in {state.hold?.expiresInSeconds || 300} seconds.</p>{error && <p className="mt-5 text-red-300">{error}</p>}<button onClick={confirm} disabled={busy} className="mt-8 rounded-xl bg-violet-600 px-5 py-3 font-semibold disabled:opacity-50">{busy ? "Confirming..." : "Simulate payment and confirm booking"}</button><button onClick={() => navigate(-1)} className="ml-3 text-white/60">Back</button></>}</div></main>;
}
