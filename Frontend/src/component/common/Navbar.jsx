import { Link } from "react-router-dom";
import Searchbar from "./Searchbar";
import CitySelector from "./CitySelector";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">

            {/* Logo */}
            <Link to="/" className="navbar-logo">
                🎬 PopcornPass
            </Link>

            {/* Search */}
            <div className="navbar-search-wrapper">
                <Searchbar />
            </div>

            {/* Right side */}
            <div className="navbar-right">

                {/* City */}
                <CitySelector />

                {/* Sign In */}
                <Link
                    to="/login"
                    className="signin-button"
                >
                    Sign In
                </Link>

            </div>

        </nav>
    );
};

export default Navbar;