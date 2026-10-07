const Navbar = () => {
    return (
        <nav className="flex items-center justify-between bg-slate-950 px-6 py-4 text-white">
            <a href="/" className="text-xl font-bold">
                🎬 PopcornPass
            </a>

            <div className="flex items-center gap-6">
                <a href="/" className="transition-colors hover:text-amber-400">
                    Home
                </a>
                <a href="/movies" className="transition-colors hover:text-amber-400">
                    Movies
                </a>
                <a href="/booking" className="transition-colors hover:text-amber-400">
                    My Bookings
                </a>
                <a href="/profile" className="transition-colors hover:text-amber-400">
                    Profile
                </a>
            </div>
        </nav>
    )
}

export default Navbar
