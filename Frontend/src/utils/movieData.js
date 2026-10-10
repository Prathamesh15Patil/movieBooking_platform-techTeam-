
export const ALL_SYSTEM_MOVIES = [
    {
        id: "drishyam-2",
        title: "Drishyam: The Conclusion",
        language: "Hindi",
        genres: ["Drama", "Mystery", "Thriller"],
        format: ["2D"],
        certificate: "UA",
        rating: "8.9",
        votes: "76.4K+ Votes",
        image: "/Drishyam-The-Conclusion-poster-2026.jpeg",
        images: [
            "/Drishyam-The-Conclusion-poster-2026.jpeg",
            "/drishyam2.jpg",
            "/drishyam3.jpg",
        ],
        isUpcoming: false,
    },
    {
        id: "bail",
        title: "Bail",
        language: "Kannada",
        genres: ["Crime", "Drama", "Thriller"],
        format: ["2D"],
        certificate: "UA",
        rating: "8.7",
        votes: "2.8K+ Votes",
        image: "/bail-2026.jpg",
        images: ["/bail-2026.jpg", "/bail.jpg", "/bail2.jpg"],
        isUpcoming: false,
    },
    {
        id: "premada-oorali",
        title: "Premada Oorali",
        language: "Kannada",
        genres: ["Drama", "Romance"],
        format: ["2D"],
        certificate: "U",
        rating: "9.6",
        votes: "46.8K+ Votes",
        image: "/pramad.jpg",
        images: ["/pramad.jpg", "/pramad2.png", "/pramad3.jpeg"],
        isUpcoming: false,
    },
    {
        id: "hanuman-ansh",
        title: "Hanuman Ansh",
        language: "Hindi",
        genres: ["Biography", "Devotional", "Drama"],
        format: ["2D", "3D"],
        certificate: "U",
        rating: "9.6",
        votes: "281K+ Votes",
        image: "/hanumanansh.webp",
        images: [
            "/hanumanansh.webp",
            "/hanumanansh2.png",
            "/hanumanansh3.webp",
        ],
        isUpcoming: false,
    },
    {
        id: "the-social-reckoning",
        title: "The Social Reckoning",
        language: "English",
        genres: ["Biography", "Drama", "Thriller"],
        format: ["2D"],
        certificate: "A",
        rating: "8.4",
        votes: "7.8K+ Likes",
        image: "/the%20social.png",
        images: [
            "/the%20social.png",
            "/thesocial.jpg",
            "/thesocialreckoning_mikeymadison.jpg",
        ],
        isUpcoming: false,
    },
    {
        id: "doremon-castle-undersea",
        title: "Doremon: Castle of the Undersea Devil",
        language: "English",
        genres: ["Animation", "Adventure", "Fantasy"],
        format: ["2D", "3D", "IMAX"],
        certificate: "U",
        rating: "8.8",
        votes: "12.6K+ Votes",
        image: "/doremon1.jpg",
        images: ["/doremon1.jpg", "/doremon2.jpeg", "/doremon3.jpg"],
        isUpcoming: false,
    },
    {
        id: "jailer-2",
        title: "Jailer 2",
        language: "Tamil",
        genres: ["Action", "Thriller"],
        format: ["2D", "IMAX"],
        certificate: "UA",
        rating: "9.2",
        releaseDate: "15, Oct 2026",
        likes: "176K+ Likes",
        image: "/Jailer_2_poster.jpg",
        images: ["/Jailer_2_poster.jpg"],
        isUpcoming: true,
    },
    {
        id: "rajini-jailer-2",
        title: "Rajini: The Jailer 2",
        language: "Tamil",
        genres: ["Action", "Thriller"],
        format: ["2D"],
        certificate: "UA",
        rating: "9.0",
        releaseDate: "15, Oct 2026",
        likes: "133K+ Likes",
        image: "/Jailer2.jpeg",
        images: ["/Jailer2.jpeg"],
        isUpcoming: true,
    },
    {
        id: "emperor-sarat-chandra",
        title: "Emperor vs Sarat Chandra",
        language: "Hindi",
        genres: ["Drama", "Historical", "Political"],
        format: ["2D"],
        certificate: "UA",
        rating: "8.5",
        releaseDate: "16, Oct 2026",
        likes: "20.7K+ Likes",
        image: "/Emperor_vs_Sarat_Chandra_poster.jpg",
        images: ["/Emperor_vs_Sarat_Chandra_poster.jpg"],
        isUpcoming: true,
    },
    {
        id: "bohurupi-golden-daku",
        title: "Bohurupi: The Golden Daku",
        language: "Hindi",
        genres: ["Action", "Drama", "Thriller"],
        format: ["2D"],
        certificate: "UA",
        rating: "8.6",
        releaseDate: "17, Oct 2026",
        likes: "14.7K+ Likes",
        image: "/baharupi2.jpg",
        images: ["/baharupi2.jpg"],
        isUpcoming: true,
    },
];

export const NOW_SHOWING_MOVIES = ALL_SYSTEM_MOVIES.filter(
    (movie) => !movie.isUpcoming
);

export const UPCOMING_MOVIES = ALL_SYSTEM_MOVIES.filter(
    (movie) => movie.isUpcoming
);

// Additional information for the MovieDetail page.
// Keys must match the IDs in ALL_SYSTEM_MOVIES.

export const MOVIE_DETAILS = {
    "drishyam-2": {
        backdrop: "/Drishyam-The-Conclusion-poster-2026.jpeg",
        video: "/drishyam-try.mp4", // Add your trailer path here later
        duration: "2h 30m",
        shortDescription:
            "A high-stakes crime thriller where a father's intelligence is pushed to the limit to shield his family from past secrets.",
        synopsis:
            "Drishyam: The Conclusion is the third and final instalment of the Hindi Drishyam franchise, starring Ajay Devgn as Vijay Salgaonkar. Years after the family concealed the truth about an accidental killing, new threats emerge that could expose their secret. Vijay must once again rely on his intelligence and elaborate planning to protect his family while facing betrayal, sacrifice, and the consequences of his past.",
        cast: [
            { name: "Ajay Devgn", role: "Vijay Salgaonkar" },
            { name: "Tabu", role: "IG Meera Deshmukh" },
            { name: "Shriya Saran", role: "Nandini Salgaonkar" },
            { name: "Rajat Kapoor", role: "Mahesh Deshmukh" },
            { name: "Ishita Dutta", role: "Anju Salgaonkar" },
            { name: "Mrunal Jadhav", role: "Anu Salgaonkar" },
            { name: "Rishab Chadha", role: "Sameer Deshmukh" },
        ],

        crew: [
            { name: "Nishikant Kamat", role: "Director" },
            { name: "Jeethu Joseph", role: "Original Story" },
            { name: "Upendra Sidhaye", role: "Adapted Screenplay" },
            {
                name: "Panorama Studios & Viacom18",
                role: "Production Companies",
            },
        ],
        recommendedIds: [
            "bail",
            "the-social-reckoning",
            "hanuman-ansh",
        ],
    },

    bail: {
        backdrop: "/bail-2026.jpg",
        video: "/bail.mp4",
        duration: "2h 38m",
        shortDescription:
            "A retired commissioner turns vigilante after waiting decades for justice in a personal tragedy.",
        synopsis:
            "Retired commissioner Vijay Kumar, after waiting a long time for justice in a case that personally affected him, becomes an outlaw and takes justice into his own hands.",
        cast: [
            { name: "Dr. Shiva Rajkumar", role: "Vijay Kumar", image: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Shivarajkumar.jpg" },
            { name: "Sangeetha Krish", role: "Co-Star", image: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Sangeetha_at_Vaanam_Audio_Launch.jpg" },
            { name: "Jayaram", role: "Supporting Lead", image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Jayaram.jpg" },
            { name: "Sai Kumar", role: "Antagonist", image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Sai_Kumar_at_Subhapradham_Audio_Release.jpg" },
            { name: "Dheekshith Shetty", role: "Actor" },
            { name: "Sanjana Anand", role: "Actor" },
            { name: "Loose Mada Yogi", role: "Actor" },
            { name: "Ramesh Indira", role: "Actor" },
        ],
        crew: [
            { name: "Pavan Wadeyar", role: "Director and Writer" },
            { name: "Venkat K. Narayana", role: "Producer" },
            { name: "B. Ajaneesh Loknath", role: "Music Composer" },
            { name: "Vaidy S.", role: "Cinematographer" },
            { name: "Shashank Narayana", role: "Editor" },
        ],
        recommendedIds: [
            "drishyam-2",
            "premada-oorali",
            "the-social-reckoning",
        ],
    },

    "premada-oorali": {
        backdrop: "/pramad2.png",
        video: "/premada-oorali.mp4",
        duration: "2h 15m",
        shortDescription:
            "A charming village drama where an unconventional daughter-in-law shakes up traditional community norms.",
        synopsis:
            "An unconventional daughter-in-law enters the lives of a quirky father-and-son duo in a village. Her arrival challenges their outlook and the judgments of their community.",
        cast: [
            { name: "Shri Mahadev", role: "Lead Actor" },
            { name: "Thapaswini Poonacha", role: "Lead Actress" },
            { name: "Rangayana Raghu", role: "Supporting Actor" },
            { name: "Ramika Shivu", role: "Actor" },
            { name: "Ila Vitla", role: "Actor" },
            { name: "Devendra Naidu", role: "Actor" },
        ],
        crew: [
            { name: "Manoj Kumar", role: "Director and Writer" },
            { name: "Devendra Naidu", role: "Additional Writer" },
            { name: "Mamatha Devendra M", role: "Producer" },
            { name: "Sunaad Gowtham", role: "Music Composer" },
        ],
        recommendedIds: [
            "bail",
            "drishyam-2",
            "hanuman-ansh",
        ],
    },

    "hanuman-ansh": {
        backdrop: "/hanumanansh3.webp",
        video: "/hanuman-ansh.mp4",
        duration: "2h 10m",
        shortDescription:
            "An uplifting saga exploring faith, human resilience, and the eternal spiritual power of Lord Hanuman.",
        synopsis:
            "A film inspired by faith, devotion, and the spiritual influence of Lord Hanuman, exploring the connection between belief, courage, and human life.",
        cast: [
            { name: "Hunny Bakshi", role: "Lead Role" },
            { name: "Chandan Anand", role: "Supporting Role", image: "https://upload.wikimedia.org/wikipedia/commons/1/19/Chandan_Anand_Actor.jpg" },
            { name: "Sattvik Sharma", role: "Actor" },
            { name: "Santosh Dixit", role: "Actor" },
            { name: "Gulshan Pandey", role: "Actor" },
        ],
        crew: [
            { name: "Vishal Chaturvedi", role: "Director and Writer" },
            { name: "Mahaveer Jain", role: "Producer" },
            { name: "Anupriya Nagar", role: "Producer" },
            { name: "Shreyas Dharmadhikari", role: "Music Composer" },
        ],
        recommendedIds: [
            "bail",
            "premada-oorali",
            "drishyam-2",
        ],
    },

    "the-social-reckoning": {
        backdrop: "/thesocial.jpg",
        video: "/the-social-reck.mp4",
        duration: "2h 20m",
        shortDescription:
            "A hard-hitting investigative drama following high-profile tech whistleblowers fighting for accountability.",
        synopsis:
            "This follow-up to The Social Network explores Facebook whistleblower Frances Haugen's revelations. With the help of journalist Jeff Horwitz, she exposes internal information that raises questions about misinformation, user safety, and corporate responsibility.",
        cast: [
            { name: "Mikey Madison", role: "Frances Haugen", image: "https://upload.wikimedia.org/wikipedia/commons/1/10/Mikey_Madison_in_2024.jpg" },
            { name: "Jeremy Allen White", role: "Jeff Horwitz", image: "https://upload.wikimedia.org/wikipedia/commons/3/30/Jeremy_Allen_White_Springsteen-33_%28cropped%29.jpg" },
            { name: "Jeremy Strong", role: "Tech Executive", image: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Jeremy_Strong_2023.jpg" },
            { name: "Wunmi Mosaku", role: "Investigator", image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Wunmi_Mosaku_by_Gage_Skidmore.jpg" },
            { name: "Betty Gilpin", role: "Lawyer" },
            { name: "Billy Magnussen", role: "Analyst" },
        ],
        crew: [
            { name: "Aaron Sorkin", role: "Director and Screenwriter", image: "https://upload.wikimedia.org/wikipedia/commons/7/75/Aaron_Sorkin_%2827566400913%29.jpg" },
            { name: "Todd Black", role: "Producer" },
            { name: "Peter Rice", role: "Producer" },
            { name: "Jeff Cronenweth", role: "Cinematographer" },
            { name: "Alexandre Desplat", role: "Music Composer" },
        ],
        recommendedIds: [
            "drishyam-2",
            "bail",
            "hanuman-ansh",
        ],
    },

    "doremon-castle-undersea": {
        backdrop: "/doremon2.jpeg",
        video: "/Doraemon_Movie.mp4",
        duration: "",
        shortDescription:
            "Doraemon and friends dive into a futuristic underwater kingdom packed with secrets and mystery.",
        synopsis:
            "Doraemon, Nobita, and their friends embark on an underwater adventure using futuristic gadgets. They discover a mysterious underwater civilization and must work together to uncover its secrets and protect the world.",
        cast: [
            { name: "Wasabi Mizuta", role: "Voice of Doraemon" },
            { name: "Megumi Ōhara", role: "Voice of Nobita" },
            { name: "Yumi Kakazu", role: "Voice of Shizuka" },
            { name: "Subaru Kimura", role: "Voice of Gian" },
            { name: "Tomokazu Seki", role: "Voice of Suneo" },
            { name: "Shoya Chiba", role: "Voice of El" },
            { name: "Ryō Hirohashi", role: "Voice of Underwater Buggy" },
        ],
        crew: [
            { name: "Tetsuo Yajima", role: "Director" },
            { name: "Fujiko F. Fujio", role: "Original Creator" },
            { name: "Isao Murayama", role: "Screenwriter" },
            { name: "Takayuki Hattori", role: "Music Composer" },
        ],
        recommendedIds: [
            "hanuman-ansh",
            "premada-oorali",
            "bail",
        ],
    },

    "jailer-2": {
        backdrop: "/Jailer_2_poster.jpg",
        video: "",
        duration: "",
        synopsis: "",
        cast: [],
        crew: [],
        recommendedIds: [
            "rajini-jailer-2",
            "bail",
            "the-social-reckoning",
        ],
    },

    "rajini-jailer-2": {
        backdrop: "/Jailer2.jpeg",
        video: "",
        duration: "",
        synopsis: "",
        cast: [],
        crew: [],
        recommendedIds: [
            "jailer-2",
            "bail",
            "drishyam-2",
        ],
    },

    "emperor-sarat-chandra": {
        backdrop: "/Emperor_vs_Sarat_Chandra_poster.jpg",
        video: "",
        duration: "",
        synopsis: "",
        cast: [],
        crew: [],
        recommendedIds: [
            "the-social-reckoning",
            "drishyam-2",
            "bail",
        ],
    },

    "bohurupi-golden-daku": {
        backdrop: "/baharupi2.jpg",
        video: "",
        duration: "",
        synopsis: "",
        cast: [],
        crew: [],
        recommendedIds: [
            "bail",
            "jailer-2",
            "the-social-reckoning",
        ],
    },
};
