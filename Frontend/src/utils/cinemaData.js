export const CINEMAS_DATABASE = {
    "Belagavi (Belgaum)": [
        {
            id: "inox-camp",
            name: "INOX: Camp Road, Belagavi",
            address:
                "Near BSNL Office, Head Post Office Road, Belgaum Camp, Near BSNL office, Belagavi (Belgaum), Karnataka 590001",
            screens: 4,
            movieIds: ["drishyam-2", "bail", "premada-oorali", "hanuman-ansh"],
        },
        {
            id: "kapeel-nucleus",
            name: "Kapeel Cinema Nucleus Mall",
            address:
                "Nucleus Mall, Old Kapeel Theatre, Ramling Khind Galli, Belagavi (Belgaum), Karnataka 590002, India",
            screens: 3,
            movieIds: ["drishyam-2", "premada-oorali", "bail"],
        },
        {
            id: "swaroop-nartaki",
            name: "Swaroop Nartaki Talkies",
            address:
                "Shastri Nagar, Goodshed Road, Shahapur, Belagavi (Belgaum), Karnataka 590001, India",
            screens: 2,
            movieIds: ["premada-oorali", "bail", "drishyam-2"],
        },
        {
            id: "chitra-talkies",
            name: "Chitra Talkies",
            address:
                "Khade Bazar, Raviwar Peth, Belagavi (Belgaum), Karnataka 590001, India",
            screens: 1,
            movieIds: ["premada-oorali"],
        },
        {
            id: "pvr-globus",
            name: "PVR: Globus Mall, Tilakwadi",
            address:
                "Globus Mall, Congress Road, Tilakwadi, Belagavi (Belgaum), Karnataka 590006, India",
            screens: 5,
            movieIds: ["drishyam-2", "the-social-reckoning", "bail", "hanuman-ansh", "doremon-castle-undersea"],
        },
    ],
    Bengaluru: [
        {
            id: "pvr-orion",
            name: "PVR: Orion Mall, Rajajinagar",
            address:
                "Brigade Gateway, Dr Rajkumar Road, Rajajinagar, Bengaluru, Karnataka 560055",
            screens: 6,
            movieIds: ["drishyam-2", "the-social-reckoning", "doremon-castle-undersea", "bail", "hanuman-ansh", "premada-oorali"],
        },
        {
            id: "inox-mantri",
            name: "INOX: Mantri Square Mall",
            address:
                "Sampige Road, Malleshwaram, Bengaluru, Karnataka 560003",
            screens: 4,
            movieIds: ["drishyam-2", "bail", "the-social-reckoning", "doremon-castle-undersea"],
        },
        {
            id: "cinepolis-royal",
            name: "Cinepolis: Royal Meenakshi Mall",
            address:
                "Bannerghatta Main Road, Hulimavu, Bengaluru, Karnataka 560076",
            screens: 4,
            movieIds: ["premada-oorali", "hanuman-ansh", "drishyam-2", "bail"],
        },
    ],
    Mumbai: [
        {
            id: "pvr-palladium",
            name: "PVR: Phoenix Palladium, Lower Parel",
            address:
                "462, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013",
            screens: 5,
            movieIds: ["drishyam-2", "the-social-reckoning", "doremon-castle-undersea", "hanuman-ansh", "bail"],
        },
        {
            id: "inox-malad",
            name: "INOX: Megaplex, Inorbit Mall Malad",
            address:
                "Link Road, Malad West, Mumbai, Maharashtra 400064",
            screens: 6,
            movieIds: ["drishyam-2", "the-social-reckoning", "bail", "doremon-castle-undersea", "hanuman-ansh", "premada-oorali"],
        },
    ],
    "Delhi-NCR": [
        {
            id: "pvr-vasant-kunj",
            name: "PVR: Director's Cut, Vasant Kunj",
            address:
                "Ambience Mall, Nelson Mandela Marg, Vasant Kunj, New Delhi 110070",
            screens: 4,
            movieIds: ["the-social-reckoning", "drishyam-2", "doremon-castle-undersea", "hanuman-ansh"],
        },
        {
            id: "inox-nehru-place",
            name: "INOX: Nehru Place",
            address:
                "Epicuria Food Mall, Nehru Place, New Delhi 110019",
            screens: 3,
            movieIds: ["drishyam-2", "the-social-reckoning", "bail"],
        },
    ],
    Pune: [
        {
            id: "pvr-phoenix-pune",
            name: "PVR: Phoenix Marketcity, Viman Nagar",
            address:
                "Nagar Road, Viman Nagar, Pune, Maharashtra 411014",
            screens: 5,
            movieIds: ["drishyam-2", "the-social-reckoning", "bail", "doremon-castle-undersea", "hanuman-ansh"],
        },
        {
            id: "inox-amanora",
            name: "INOX: Amanora Town Centre",
            address:
                "Hadapsar Kharadi Bypass, Magarpatta, Pune, Maharashtra 411028",
            screens: 4,
            movieIds: ["drishyam-2", "premada-oorali", "bail", "hanuman-ansh"],
        },
    ],
    Hyderabad: [
        {
            id: "amb-cinemas",
            name: "AMB Cinemas: Gachibowli",
            address:
                "Sarath City Capital Mall, Gachibowli - Miyapur Road, Hyderabad, Telangana 500084",
            screens: 7,
            movieIds: ["drishyam-2", "the-social-reckoning", "bail", "premada-oorali", "hanuman-ansh", "doremon-castle-undersea"],
        },
        {
            id: "pvr-forum-hyd",
            name: "PVR: Forum Sujana Mall, Kukatpally",
            address:
                "KPHB Phase 9, Kukatpally, Hyderabad, Telangana 500072",
            screens: 4,
            movieIds: ["drishyam-2", "bail", "the-social-reckoning", "doremon-castle-undersea"],
        },
    ],
};

/**
 * Find a cinema by ID across all cities.
 */
export const getCinemaById = (cinemaId) => {
    if (!cinemaId) return null;
    for (const [city, cinemas] of Object.entries(CINEMAS_DATABASE)) {
        const found = cinemas.find((c) => c.id === cinemaId);
        if (found) {
            return { ...found, city };
        }
    }
    return null;
};

/**
 * Find a cinema by name across all cities.
 */
export const getCinemaByName = (cinemaName) => {
    if (!cinemaName) return null;
    const cleanName = cinemaName.toLowerCase().trim();
    for (const [city, cinemas] of Object.entries(CINEMAS_DATABASE)) {
        const found = cinemas.find(
            (c) =>
                c.name.toLowerCase().trim() === cleanName ||
                c.name.toLowerCase().includes(cleanName) ||
                cleanName.includes(c.name.toLowerCase())
        );
        if (found) {
            return { ...found, city };
        }
    }
    return null;
};

/**
 * Search cinemas across all cities by name, address, or city.
 */
export const searchAllCinemas = (query) => {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results = [];
    for (const [city, cinemas] of Object.entries(CINEMAS_DATABASE)) {
        for (const cinema of cinemas) {
            if (
                cinema.name.toLowerCase().includes(q) ||
                cinema.address.toLowerCase().includes(q) ||
                city.toLowerCase().includes(q)
            ) {
                results.push({ ...cinema, city });
            }
        }
    }
    return results;
};

export const SHOWTIMES_BY_MOVIE = {
    "drishyam-2": [
        { time: "10:00 AM", sound: "", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
        { time: "12:45 PM", sound: "", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
        { time: "03:30 PM", sound: "", status: "available", prices: { sofa: 260, platinum: 230, gold: 230, silver: 210 } },
        { time: "06:45 PM", sound: "DOLBY 7.1", status: "fast", prices: { sofa: 280, platinum: 250, gold: 250, silver: 220 } },
        { time: "09:45 PM", sound: "DOLBY 7.1", status: "available", prices: { sofa: 280, platinum: 250, gold: 250, silver: 220 } },
    ],
    "premada-oorali": [
        { time: "10:00 AM", sound: "DOLBY 950", status: "available", prices: { sofa: 240, platinum: 210, gold: 210, silver: 190 } },
        { time: "12:45 PM", sound: "DOLBY 950", status: "available", prices: { sofa: 240, platinum: 210, gold: 210, silver: 190 } },
        { time: "03:45 PM", sound: "DOLBY 950", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
        { time: "06:15 PM", sound: "", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
        { time: "06:45 PM", sound: "DOLBY 950", status: "available", prices: { sofa: 260, platinum: 230, gold: 230, silver: 210 } },
        { time: "09:15 PM", sound: "", status: "available", prices: { sofa: 260, platinum: 230, gold: 230, silver: 210 } },
        { time: "10:00 PM", sound: "DOLBY 950", status: "available", prices: { sofa: 260, platinum: 230, gold: 230, silver: 210 } },
    ],
    bail: [
        { time: "11:15 AM", sound: "4K LASER", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
        { time: "02:30 PM", sound: "4K LASER", status: "fast", prices: { sofa: 270, platinum: 240, gold: 240, silver: 210 } },
        { time: "07:00 PM", sound: "DOLBY ATMOS", status: "available", prices: { sofa: 290, platinum: 260, gold: 260, silver: 230 } },
        { time: "10:15 PM", sound: "DOLBY ATMOS", status: "available", prices: { sofa: 280, platinum: 250, gold: 250, silver: 220 } },
    ],
    "hanuman-ansh": [
        { time: "09:30 AM", sound: "3D", status: "available", prices: { sofa: 230, platinum: 200, gold: 200, silver: 180 } },
        { time: "01:15 PM", sound: "3D", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
        { time: "05:00 PM", sound: "3D", status: "available", prices: { sofa: 260, platinum: 230, gold: 230, silver: 210 } },
        { time: "08:45 PM", sound: "3D", status: "available", prices: { sofa: 260, platinum: 230, gold: 230, silver: 210 } },
    ],
    "the-social-reckoning": [
        { time: "04:15 PM", sound: "ENG", status: "available", prices: { sofa: 280, platinum: 250, gold: 250, silver: 220 } },
        { time: "09:30 PM", sound: "ENG", status: "available", prices: { sofa: 300, platinum: 270, gold: 270, silver: 240 } },
    ],
    "doremon-castle-undersea": [
        { time: "10:30 AM", sound: "KIDS SPECIAL", status: "available", prices: { sofa: 200, platinum: 180, gold: 180, silver: 160 } },
        { time: "01:30 PM", sound: "KIDS SPECIAL", status: "available", prices: { sofa: 200, platinum: 180, gold: 180, silver: 160 } },
    ],
};

export const getShowtimesForMovie = (movieId) => {
    return (
        SHOWTIMES_BY_MOVIE[movieId] || [
            { time: "10:30 AM", sound: "", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
            { time: "12:15 PM", sound: "", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
            { time: "01:15 PM", sound: "", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
            { time: "03:30 PM", sound: "", status: "available", prices: { sofa: 260, platinum: 230, gold: 230, silver: 210 } },
            { time: "06:45 PM", sound: "DOLBY 7.1", status: "fast", prices: { sofa: 280, platinum: 250, gold: 250, silver: 220 } },
            { time: "10:00 PM", sound: "DOLBY 7.1", status: "available", prices: { sofa: 280, platinum: 250, gold: 250, silver: 220 } },
        ]
    );
};

export const CINEMA_MOVIE_SHOWTIMES = {
    // Drishyam: The Conclusion
    "drishyam-2": {
        "inox-camp": [
            { time: "04:25 PM", sound: "DOLBY 7.1", status: "fast", prices: { sofa: 280, platinum: 250, gold: 250, silver: 220 } },
            { time: "07:10 PM", sound: "DOLBY 7.1", status: "available", prices: { sofa: 280, platinum: 250, gold: 250, silver: 220 } },
            { time: "10:30 PM", sound: "DOLBY 7.1", status: "available", prices: { sofa: 280, platinum: 250, gold: 250, silver: 220 } },
        ],
        "kapeel-nucleus": [
            { time: "12:45 PM", sound: "", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
            { time: "03:30 PM", sound: "", status: "available", prices: { sofa: 260, platinum: 230, gold: 230, silver: 210 } },
        ],
        "swaroop-nartaki": [
            { time: "03:15 PM", sound: "", status: "available", prices: { sofa: 240, platinum: 210, gold: 210, silver: 190 } },
            { time: "06:15 PM", sound: "", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
            { time: "09:30 PM", sound: "", status: "available", prices: { sofa: 260, platinum: 230, gold: 230, silver: 210 } },
        ],
        "pvr-globus": [
            { time: "10:30 AM", sound: "4K LASER", status: "available", prices: { sofa: 290, platinum: 260, gold: 260, silver: 230 } },
            { time: "01:45 PM", sound: "4K LASER", status: "available", prices: { sofa: 290, platinum: 260, gold: 260, silver: 230 } },
            { time: "05:15 PM", sound: "DOLBY ATMOS", status: "fast", prices: { sofa: 320, platinum: 280, gold: 280, silver: 250 } },
            { time: "08:30 PM", sound: "DOLBY ATMOS", status: "available", prices: { sofa: 320, platinum: 280, gold: 280, silver: 250 } },
        ],
    },
};

export const getShowtimesForCinemaAndMovie = (cinemaId, movieId) => {
    if (CINEMA_MOVIE_SHOWTIMES[movieId] && CINEMA_MOVIE_SHOWTIMES[movieId][cinemaId]) {
        return CINEMA_MOVIE_SHOWTIMES[movieId][cinemaId];
    }
    return getShowtimesForMovie(movieId);
};

export const getCinemasForMovie = (movieId, city = "Belagavi (Belgaum)") => {
    const list = CINEMAS_DATABASE[city] || CINEMAS_DATABASE["Belagavi (Belgaum)"] || [];
    const matched = list.filter((c) => !c.movieIds || c.movieIds.includes(movieId));
    return matched.length > 0 ? matched : list;
};
