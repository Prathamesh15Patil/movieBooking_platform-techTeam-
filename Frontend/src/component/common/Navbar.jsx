import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between bg-slate-950 px-6 py-4 text-white">
            <Link to="/" className="text-xl font-bold">
                🎬 PopcornPass
            </Link>

            <div className="flex items-center gap-6">
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
            </div>
        </nav>
    )
}

export default Navbar

