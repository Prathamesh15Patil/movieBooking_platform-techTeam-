import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CitySelector.css";

const popularCities = [
    { name: "Mumbai", img: "/mumbai.png" },
    { name: "Delhi-NCR", img: "/delhi.png", altNames: ["delhi", "ncr"] },
    { name: "Bengaluru", img: "/banglore.png", altNames: ["bangalore"] },
    { name: "Hyderabad", img: "/Hydrabad.png" },
    { name: "Chandigarh", img: "/chandigard.png" },
    { name: "Ahmedabad", img: "/ahmedabad.png" },
    { name: "Pune", img: "/pune.png" },
    { name: "Chennai", img: "/chennai.png" },
    { name: "Kolkata", img: "/kolkata.png" },
    { name: "Kochi", img: "/kochi.png" },
    { name: "Belagavi", img: "/belagavi.png", altNames: ["belgavi", "belgaum"] },
    { name: "Hubballi", img: "/hubballi.png", altNames: ["hubli"] },
];

const otherCitiesList = [
    "Aalo", "Abohar", "Abu Road", "Achampet", "Acharapakkam",
    "Addanki", "Adilabad", "Adimali", "Adipur", "Adoni",
    "Agar Malwa", "Agartala", "Agiripalli", "Agra", "Ahilyanagar (Ahmednagar)",
    "Ahmedgarh", "Ahore", "Aizawl", "Ajmer", "Akaltara",
    "Akbarpur", "Akividu", "Akluj", "Akola", "Akot",
    "Alakode", "Alangudi", "Alangulam", "Alappuzha", "Alathur",
    "Alibaug", "Aligarh", "Alipurduar", "Allagadda", "Almora",
    "Alwar", "Amalapuram", "Amarnath", "Ambajogai", "Ambala",
    "Ambikapur", "Ambur", "Amravati", "Amreli", "Amritsar",
    "Anakapalle", "Anand", "Anantapur", "Ananthnag", "Anchal",
    "Angamaly", "Angul", "Anjar", "Ankleshwar", "Annanavaram",
    "Anuppur", "Arakkonam", "Arambagh", "Araria", "Arcot",
    "Arrah", "Arsikere", "Aruppukottai", "Asansol", "Ashoknagar",
    "Aska", "Attingal", "Aurangabad", "Auraiya", "Azamgarh",
    "Baddi", "Badgara", "Badlapur", "Bagalkot", "Bagdogra",
    "Baghpat", "Bahadurgarh", "Baharampur", "Bahraich", "Balaghat",
    "Balasore", "Ballari (Bellary)", "Balurghat", "Banda", "Banka",
    "Bankura", "Bapatla", "Baramati", "Baramulla", "Baran",
    "Bardhaman", "Bareilly", "Barmer", "Barnala", "Baripada",
    "Barwani", "Basirhat", "Basti", "Batala", "Bathinda",
    "Beawar", "Beed", "Begusarai", "Belagavi (Belgaum)", "Belthangady",
    "Berhampur", "Bettiah", "Betul", "Bhadrak", "Bhadravathi",
    "Bhagalpur", "Bhandara", "Bharatpur", "Bharuch", "Bhavani",
    "Bhavnagar", "Bhilai", "Bhilwara", "Bhimavaram", "Bhind",
    "Bhiwadi", "Bhiwani", "Bhopal", "Bhubaneswar", "Bhuj",
    "Bhusawal", "Bidar", "Bihar Sharif", "Bijapur (Vijayapura)", "Bikaner",
    "Bilaspur", "Bobbili", "Bodhan", "Bodh Gaya", "Bokaro",
    "Bongaigaon", "Brahmapur", "Budaun", "Bulandshahr", "Buldhana",
    "Bundi", "Burdwan", "Burhanpur", "Buxar", "Calicut (Kozhikode)",
    "Chalisgaon", "Chamba", "Chandausi", "Chandauli", "Chandrapur",
    "Changanassery", "Channapatna", "Chhatarpur", "Chhindwara", "Chidambaram",
    "Chikkaballapur", "Chikkamagaluru", "Chilakaluripet", "Chinsurah", "Chiplun",
    "Chirala", "Chitradurga", "Chittoor", "Chittorgarh", "Churu",
    "Coimbatore", "Cooch Behar", "Coonoor", "Cuddalore", "Cuttack",
    "Dabhoi", "Dabra", "Dahod", "Daman", "Damoh",
    "Darbhanga", "Darjeeling", "Datia", "Davanagere", "Deesa",
    "Dehradun", "Deoghar", "Deoria", "Dewas", "Dhamtari",
    "Dhanbad", "Dhar", "Dharmapuri", "Dharwad", "Dholpur",
    "Dhrangadhra", "Dhule", "Dibrugarh", "Digboi", "Dimapur",
    "Dindigul", "Durg", "Durgapur", "Eluru", "Erode",
    "Etah", "Etawah", "Faizabad", "Faridabad", "Faridkot",
    "Farrukhabad", "Fatehabad", "Fatehgarh Sahib", "Fatehpur", "Fazilka",
    "Firozabad", "Gadag", "Gadwal", "Gandhidham", "Gandhinagar",
    "Ganganagar", "Gangtok", "Ganjam", "Gaya", "Giridih",
    "Godhra", "Gonda", "Gondia", "Gopalganj", "Gorakhpur",
    "Gudivada", "Gudur", "Gulbarga (Kalaburagi)", "Guna", "Guntakal",
    "Guntur", "Gurdaspur", "Gurugram", "Guwahati", "Gwalior",
    "Hajipur", "Haldwani", "Hansi", "Hanumangarh", "Hapur",
    "Harda", "Hardoi", "Haridwar", "Hassan", "Haveri",
    "Hazaribagh", "Himmatnagar", "Hinganghat", "Hingoli", "Hisar",
    "Hoshangabad", "Hoshiarpur", "Hospet (Hosapete)", "Hosur", "Hubballi (Hubli)",
    "Hugli", "Ichalkaranji", "Idar", "Idukki", "Imphal",
    "Indore", "Itanagar", "Jabalpur", "Jagdalpur", "Jagraon",
    "Jagtial", "Jaipur", "Jaisingpur", "Jaisalmer", "Jajpur",
    "Jalandhar", "Jalgaon", "Jalna", "Jalore", "Jalpaiguri",
    "Jammu", "Jamnagar", "Jamshedpur", "Jaunpur", "Jhalawar",
    "Jhansi", "Jharsuguda", "Jhunjhunu", "Jind", "Jodhpur",
    "Jorhat", "Junagadh", "Kadapa", "Kakinada", "Kalaburagi",
    "Kalpetta", "Kalyan", "Kamareddy", "Kanchipuram", "Kandukur",
    "Kangra", "Kanhangad", "Kannur", "Kanpur", "Kanyakumari",
    "Kapurthala", "Karad", "Karaikal", "Karaikudi", "Karimnagar",
    "Karur", "Karwar", "Kasaragod", "Kashipur", "Katihar",
    "Katni", "Kavali", "Kayamkulam", "Kendujhar", "Khagaria",
    "Khammam", "Khandwa", "Kharagpur", "Khargone", "Khopoli",
    "Khurda", "Kishan Ganj", "Kishangarh", "Kodaikanal", "Kolar",
    "Kolhapur", "Kollam", "Koppal", "Korba", "Kota",
    "Kottayam", "Kovilpatti", "Kozhikode", "Krishnanagar", "Kumbakonam",
    "Kurnool", "Kurukshetra", "Lakhimpur", "Lalitpur", "Latur",
    "Lonavala", "Lucknow", "Ludhiana", "Machilipatnam", "Madanganj-Kishangarh",
    "Madikeri", "Madurai", "Mahbubnagar", "Mahoba", "Mahwa",
    "Mahesana", "Maheshwar", "Mainpuri", "Malappuram", "Malda",
    "Malegaon", "Malout", "Mancherial", "Mandi", "Mandi Dabwali",
    "Mandla", "Mandsaur", "Mandya", "Mangaluru (Mangalore)", "Manipal",
    "Mathura", "Mauranipur", "Mayiladuthurai", "Meerut", "Mehsana",
    "Miryalaguda", "Mirzapur", "Moga", "Mohali", "Moradabad",
    "Morbi", "Morena", "Motihari", "Mount Abu", "Muktsar",
    "Munger", "Muvattupuzha", "Muzaffarnagar", "Muzaffarpur", "Mysuru (Mysore)",
    "Nadiad", "Nagaon", "Nagercoil", "Nagapattinam", "Nagda",
    "Nagpur", "Nainital", "Nalgonda", "Namakkal", "Nanded",
    "Nandyal", "Nandurbar", "Narasaraopet", "Narnaul", "Narsinghpur",
    "Nashik", "Navsari", "Neemuch", "Nellore", "Neyveli",
    "Nizamabad", "Noida", "North Lakhimpur", "Ongole", "Ooty",
    "Orai", "Osmanabad", "Ottapalam", "Palakkad", "Palani",
    "Palanpur", "Palghar", "Pali", "Palwal", "Patan",
    "Pathankot", "Patiala", "Patna", "Pauri", "Phagwara",
    "Pilibhit", "Pithoragarh", "Pollachi", "Pondicherry", "Porbandar",
    "Port Blair", "Proddatur", "Pudukkottai", "Puri", "Purnea",
    "Purulia", "Pusad", "Raebareli", "Raichur", "Raigarh",
    "Raipur", "Rajahmundry", "Rajapalayam", "Rajkot", "Rajnandgaon",
    "Rajsamand", "Ramagundam", "Ramanathapuram", "Ramanagara", "Ramgarh",
    "Rampur", "Ranchi", "Ranaghat", "Raniganj", "Ratlam",
    "Ratnagiri", "Raurkela", "Rawatbhata", "Rewa", "Rewari",
    "Rishikesh", "Rohtak", "Roorkee", "Rourkela", "Rudrapur",
    "Sagar", "Saharanpur", "Saharsa", "Salem", "Samastipur",
    "Sambalpur", "Sangamner", "Sangli", "Sangrur", "Satara",
    "Satna", "Sawai Madhopur", "Sehore", "Seoni", "Shahjahanpur",
    "Shillong", "Shimoga (Shivamogga)", "Shimla", "Shirdi", "Shivpuri",
    "Sikar", "Silchar", "Siliguri", "Silvassa", "Singrauli",
    "Sirsa", "Sitapur", "Sivakasi", "Siwan", "Solan",
    "Solapur", "Sonipat", "Sri Ganganagar", "Srikakulam", "Srinagar",
    "Sultanpur", "Surat", "Surendranagar", "Tanjore (Thanjavur)", "Tenali",
    "Tezpur", "Thalassery", "Thane", "Thanjavur", "Thiruvalla",
    "Thiruvananthapuram", "Thodupuzha", "Thrissur", "Tindivanam", "Tinsukia",
    "Tiruchirappalli", "Tirunelveli", "Tirupati", "Tirupur", "Tiruvannamalai",
    "Tiruvarur", "Tohana", "Tonk", "Tumakuru (Tumkur)", "Tuticorin (Thoothukudi)",
    "Udaipur", "Udgir", "Udhampur", "Udupi", "Ujjain",
    "Ulhasnagar", "Uluberia", "Unnao", "Vadodara", "Vapi",
    "Varanasi", "Vellore", "Veraval", "Vidisha", "Vijayawada",
    "Viluppuram", "Visakhapatnam", "Vizianagaram", "Warangal", "Wardha",
    "Washim", "Yamunanagar", "Yavatmal"
];

const uniqueOtherCities = Array.from(new Set(otherCitiesList)).sort((a, b) =>
    a.localeCompare(b)
);

const CitySelector = () => {
    const [selectedCity, setSelectedCity] = useState(
        () => localStorage.getItem("selectedCity") || "Location"
    );

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [detecting, setDetecting] = useState(false);
    const [showAllCities, setShowAllCities] = useState(false);
    const otherCitiesRef = useRef(null);

    const toggleOtherCities = () => {
        if (showAllCities && otherCitiesRef.current) {
            otherCitiesRef.current.scrollTop = 0;
        }

        setShowAllCities((isVisible) => !isVisible);
    };

    const selectCity = (city) => {
        setSelectedCity(city);
        localStorage.setItem("selectedCity", city);
        setIsOpen(false);
        setSearch("");
        setShowAllCities(false);
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Location detection is not supported by your browser.");
            return;
        }

        setDetecting(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );

                    const data = await response.json();

                    const city =
                        data.city ||
                        data.locality ||
                        data.principalSubdivision;

                    if (city) {
                        selectCity(city);
                    }
                } catch (error) {
                    console.error("Unable to detect city:", error);
                    alert("Unable to detect your city.");
                } finally {
                    setDetecting(false);
                }
            },
            (error) => {
                console.error(error);
                setDetecting(false);

                if (error.code === 1) {
                    alert(
                        "Location permission was denied. Please allow location access."
                    );
                } else {
                    alert("Unable to detect your location.");
                }
            }
        );
    };

    const searchLower = search.trim().toLowerCase();

    const filteredPopularCities = popularCities.filter(
        (city) =>
            city.name.toLowerCase().includes(searchLower) ||
            (city.altNames &&
                city.altNames.some((alt) => alt.toLowerCase().includes(searchLower)))
    );

    const filteredOtherCities = uniqueOtherCities.filter((city) =>
        city.toLowerCase().includes(searchLower)
    );

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const isSearching = searchLower.length > 0;

    return (
        <>
            {/* City button */}
            <button
                className="city-selector"
                onClick={() => setIsOpen(true)}
                type="button"
            >
                <svg
                    className="city-location-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
                    <circle cx="12" cy="9" r="2.5" />
                </svg>

                <span>{selectedCity}</span>

                <svg
                    className="city-chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {/* City popup */}
            {isOpen &&
                createPortal(
                    <div
                        className="city-modal-overlay"
                        onMouseDown={(e) => {
                            if (e.target === e.currentTarget) {
                                setIsOpen(false);
                            }
                        }}
                    >
                        <div className="city-modal">
                            {/* Close button */}
                            <button
                                type="button"
                                className="city-modal-close"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close city selector"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Search */}
                            <div className="city-search-box">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m20 20-4-4" />
                                </svg>

                                <input
                                    autoFocus
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search for your city"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="city-search-clear"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            {/* Detect location */}
                            <button
                                className="detect-location"
                                onClick={handleDetectLocation}
                                disabled={detecting}
                                type="button"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="7" />
                                    <circle cx="12" cy="12" r="2.5" />
                                    <path d="M12 2v3" />
                                    <path d="M12 19v3" />
                                    <path d="M2 12h3" />
                                    <path d="M19 12h3" />
                                </svg>

                                {detecting
                                    ? "Detecting location..."
                                    : "Detect my location"}
                            </button>

                            <div className="city-divider" />

                            {/* Popular Cities Section */}
                            {(!isSearching || filteredPopularCities.length > 0) && (
                                <>
                                    <h3>Popular Cities</h3>
                                    <div className="city-grid">
                                        {filteredPopularCities.map((city) => (
                                            <button
                                                key={city.name}
                                                className={`city-item ${selectedCity === city.name
                                                    ? "selected"
                                                    : ""
                                                    }`}
                                                onClick={() => selectCity(city.name)}
                                                type="button"
                                            >
                                                <div className="city-icon">
                                                    <img
                                                        src={city.img}
                                                        alt={city.name}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                                <span>{city.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Other Cities Section */}
                            {(showAllCities || isSearching) && (
                                <div className="other-cities-section">
                                    <h3 className="other-cities-title">Other Cities</h3>

                                    {filteredOtherCities.length > 0 ? (
                                        <div
                                            ref={otherCitiesRef}
                                            className="other-cities-grid"
                                        >
                                            {filteredOtherCities.map((city) => (
                                                <button
                                                    key={city}
                                                    type="button"
                                                    className={`other-city-item ${selectedCity === city ? "selected" : ""
                                                        }`}
                                                    onClick={() => selectCity(city)}
                                                >
                                                    {city}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="no-city">
                                            No other cities found
                                        </div>
                                    )}

                                    {showAllCities && !isSearching && (
                                        <button
                                            className="view-all-cities hide-all-cities"
                                            type="button"
                                            onClick={toggleOtherCities}
                                        >
                                            Hide all cities
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Expand control stays above Other Cities until expanded. */}
                            {!isSearching && !showAllCities && (
                                <button
                                    className="view-all-cities"
                                    type="button"
                                    onClick={toggleOtherCities}
                                >
                                    View all cities
                                </button>
                            )}

                            {isSearching &&
                                filteredPopularCities.length === 0 &&
                                filteredOtherCities.length === 0 && (
                                    <div className="no-city">No cities found</div>
                                )}
                        </div>
                    </div>,
                    document.body
                )
            }
        </>
    );
};

export default CitySelector;
