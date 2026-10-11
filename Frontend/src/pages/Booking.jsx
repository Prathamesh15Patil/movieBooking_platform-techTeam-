import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

function History() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { api.myBookings().then(setBookings).catch((e) => setError(e.message)); }, []);
  return <main className="min-h-screen bg-slate-950 px-6 py-12 text-white"><div className="mx-auto max-w-4xl"><h1 className="text-4xl font-bold">My bookings</h1>{error && <p className="mt-5 text-red-300">{error}</p>}<div className="mt-8 space-y-4">{bookings.map((booking) => <article key={booking._id} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">{booking.show?.movie?.title || "Movie booking"}</h2><p className="mt-2 text-white/60">{booking.seatsBooked?.join(", ")} · ₹{booking.totalAmount}</p><p className="mt-1 text-sm text-white/50">{booking.paymentStatus} · {booking.paymentId}</p></article>)}</div>{!error && !bookings.length && <p className="mt-8 text-white/60">You have no bookings yet.</p>}</div></main>;
}

function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { Promise.all([api.show(showId), api.seats(showId)]).then(([s, map]) => { setShow(s); setSeats(map); }).catch((e) => setError(e.message)); }, [showId]);
  const toggle = (seat) => seat.status === "AVAILABLE" && setSelected((current) => current.includes(seat.seatId) ? current.filter((id) => id !== seat.seatId) : [...current, seat.seatId]);
  const hold = async () => {
    if (!selected.length) return setError("Select at least one available seat.");
    setBusy(true); setError("");
    try { const result = await api.lockSeats(showId, selected); navigate("/payment", { state: { show, seats: selected, hold: result } }); }
    catch (e) { setError(e.message); const map = await api.seats(showId).catch(() => []); setSeats(map); }
    finally { setBusy(false); }
  };
  return <main className="min-h-screen bg-slate-950 px-6 py-12 text-white"><div className="mx-auto max-w-4xl"><h1 className="text-3xl font-bold">Choose your seats</h1><p className="mt-2 text-white/60">{show?.movie?.title || "Show"} · {show && new Date(show.startTime).toLocaleString()}</p>{error && <p className="mt-5 text-red-300">{error}</p>}<div className="mx-auto mt-10 grid max-w-xl grid-cols-4 gap-3 sm:grid-cols-8">{seats.map((seat) => <button key={seat.seatId} type="button" disabled={seat.status !== "AVAILABLE"} onClick={() => toggle(seat)} className={`rounded-lg p-3 text-sm ${selected.includes(seat.seatId) ? "bg-violet-500" : seat.status === "AVAILABLE" ? "bg-emerald-700 hover:bg-emerald-600" : "cursor-not-allowed bg-slate-700 text-white/40"}`}>{seat.seatId}</button>)}</div><button disabled={busy} onClick={hold} className="mt-10 rounded-xl bg-violet-600 px-6 py-3 font-semibold disabled:opacity-50">{busy ? "Holding seats..." : `Continue with ${selected.length} seat${selected.length === 1 ? "" : "s"}`}</button></div></main>;
}

export default function Booking() {
  return useParams().showId ? <SeatSelection /> : <History />;
}
