import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/auth";

const Navbar = () => {
    const { user, loading, isAdmin } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="relative bg-slate-950 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
                <Link to="/" className="text-xl font-bold" onClick={closeMenu}>
                🎬 PopcornPass
                </Link>

                <div className="hidden items-center gap-6 md:flex">
                <Link to="/" className="transition-colors hover:text-amber-400">
                    Home
                </Link>
                <Link to="/movies" className="transition-colors hover:text-amber-400">
                    Movies
                </Link>
                <Link to="/booking" className="transition-colors hover:text-amber-400">
                    My Bookings
                </Link>
                <Link to="/profile" className="transition-colors hover:text-amber-400">
                    Profile
                </Link>
                {isAdmin && <Link to="/admin" className="transition-colors hover:text-amber-400">Admin</Link>}
                {!loading && !user && <Link to="/login" className="transition-colors hover:text-amber-400">Sign in</Link>}
                </div>

                <button
                    type="button"
                    className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 md:hidden"
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {menuOpen && (
                <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 md:hidden">
                    <Link to="/" className="py-1 transition-colors hover:text-amber-400" onClick={closeMenu}>
                        Home
                    </Link>
                    <Link to="/movies" className="py-1 transition-colors hover:text-amber-400" onClick={closeMenu}>
                        Movies
                    </Link>
                    <Link to="/booking" className="py-1 transition-colors hover:text-amber-400" onClick={closeMenu}>
                        My Bookings
                    </Link>
                    <Link to="/profile" className="py-1 transition-colors hover:text-amber-400" onClick={closeMenu}>
                        Profile
                    </Link>
                    {isAdmin && <Link to="/admin" className="py-1 transition-colors hover:text-amber-400" onClick={closeMenu}>Admin</Link>}
                    {!loading && !user && <Link to="/login" className="py-1 transition-colors hover:text-amber-400" onClick={closeMenu}>Sign in</Link>}
                </div>
            )}
        </nav>
    )
}

export default Navbar
