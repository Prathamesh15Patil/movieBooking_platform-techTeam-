import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ALL_SYSTEM_MOVIES } from "../utils/movieData";
import { getCinemaByName, getShowtimesForMovie } from "../utils/cinemaData";
import {
    BookingHeader,
    ShowtimeBar,
    SeatingArea,
    CheckoutBar,
    SeatModal,
} from "../component/Booking";
import "./Booking.css";

const SEATS_PER_ROW = 10;
// Pre-defined occupied seats to simulate realistic booking state
const OCCUPIED_SEATS = new Set(["A3", "A4", "C5", "C6", "D1", "D2", "F7", "F8", "H3", "H4"]);

const Booking = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Load initial booking information from sessionStorage & location.state
    const [bookingData, setBookingData] = useState(() => {
        let base = {
            movieTitle: "Drishyam: The Conclusion",
            movieId: "drishyam-2",
            cinemaName: "INOX: Camp Road, Belagavi",
            cinemaAddress: "Head Post Office Road, Belagavi",
            date: "Sun, 11 Oct 2026",
            showtime: "04:25 PM",
            sound: "DOLBY 7.1",
            prices: { sofa: 280, platinum: 250, gold: 250, silver: 220 },
        };

        const saved = sessionStorage.getItem("bookingState");
        if (saved) {
            try {
                base = { ...base, ...JSON.parse(saved) };
            } catch (e) {
                console.error("Failed to parse bookingState", e);
            }
        }

        if (location.state) {
            base = { ...base, ...location.state };
        }

        return base;
    });

    const isFromCinema =
        location.state?.fromCinema === true ||
        (location.state?.fromMovieShowtimes !== true &&
            (bookingData?.fromCinema === true || sessionStorage.getItem("fromCinema") === "true") &&
            sessionStorage.getItem("fromMovieShowtimes") !== "true");

    const isFromMovieShowtimes =
        location.state?.fromMovieShowtimes === true ||
        (location.state?.fromCinema !== true &&
            (bookingData?.fromMovieShowtimes === true || sessionStorage.getItem("fromMovieShowtimes") === "true") &&
            sessionStorage.getItem("fromCinema") !== "true");

    const handleBack = () => {
        if (isFromMovieShowtimes) {
            const movieId =
                location.state?.movieId ||
                bookingData?.movieId ||
                sessionStorage.getItem("lastMovieId") ||
                "drishyam-2";

            navigate(`/movie/${movieId}/cinemas`);
            return;
        }

        if (isFromCinema) {
            const cinemaId =
                location.state?.cinemaId ||
                bookingData?.cinemaId ||
                sessionStorage.getItem("lastCinemaId") ||
                (bookingData?.cinemaName ? getCinemaByName(bookingData.cinemaName)?.id : null) ||
                "inox-camp";

            navigate(`/cinemas?cinema=${cinemaId}`);
            return;
        }

        navigate(-1);
    };

    // Showtimes list for this movie
    const rawShowtimes =
        location.state?.availableShowtimes ||
        bookingData.availableShowtimes ||
        getShowtimesForMovie(bookingData.movieId);

    const [activeShowtime, setActiveShowtime] = useState(() => {
        return location.state?.showtime || bookingData.showtime || "10:30 AM";
    });

    const prices = bookingData.prices || { sofa: 250, platinum: 220, gold: 220, silver: 200 };

    // Normalize showtimes into array of objects with time, sound, prices
    const availableShowtimes = React.useMemo(() => {
        let list = (rawShowtimes || []).map((st) => (typeof st === "string" ? { time: st } : st));
        if (activeShowtime && !list.some((s) => s.time === activeShowtime)) {
            list = [
                {
                    time: activeShowtime,
                    sound: bookingData.sound || "",
                    prices: bookingData.prices,
                },
                ...list,
            ];
        }
        return list;
    }, [rawShowtimes, activeShowtime, bookingData.sound, bookingData.prices]);

    const handleShowtimeChange = (newShowtime) => {
        setActiveShowtime(newShowtime);

        const stObj = availableShowtimes.find((st) => st.time === newShowtime);
        const newPrices = stObj?.prices || prices;
        const newSound = stObj?.sound !== undefined ? stObj.sound : bookingData.sound;

        const updated = {
            ...bookingData,
            showtime: newShowtime,
            sound: newSound,
            prices: newPrices,
        };

        setBookingData(updated);
        sessionStorage.setItem("bookingState", JSON.stringify(updated));
    };

    const [seatCount, setSeatCount] = useState(2);
    const [showSeatModal, setShowSeatModal] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const dynamicRowConfig = [
        { row: "A", category: "SILVER", price: prices.silver || 200 },
        { row: "B", category: "SILVER", price: prices.silver || 200 },
        { row: "C", category: "GOLD", price: prices.gold || 220 },
        { row: "D", category: "GOLD", price: prices.gold || 220 },
        { row: "E", category: "GOLD", price: prices.gold || 220 },
        { row: "F", category: "PLATINUM", price: prices.platinum || 220 },
        { row: "G", category: "PLATINUM", price: prices.platinum || 220 },
        { row: "H", category: "PLATINUM", price: prices.platinum || 220 },
        { row: "I", category: "PREMIUM SOFA", price: prices.sofa || 250 },
        { row: "J", category: "PREMIUM SOFA", price: prices.sofa || 250 },
    ];

    const movieObj = ALL_SYSTEM_MOVIES.find((m) => m.id === bookingData.movieId) || {
        image: "/pramad.jpg",
        language: "Kannada",
        format: ["2D"],
    };

    const movieImage = movieObj.image || "/pramad.jpg";
    const movieLang = movieObj.language || "Kannada";

    const handleSeatClick = (seatId, rowObj) => {
        if (OCCUPIED_SEATS.has(seatId)) return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
            return;
        }

        // Auto-select adjacent seats up to seatCount
        const rowLetter = rowObj.row;
        const seatNum = parseInt(seatId.replace(rowLetter, ""));
        const newSelected = [];

        for (let i = 0; i < seatCount; i++) {
            const nextNum = seatNum + i;
            if (nextNum <= SEATS_PER_ROW) {
                const nextSeatId = `${rowLetter}${nextNum}`;
                if (!OCCUPIED_SEATS.has(nextSeatId)) {
                    newSelected.push(nextSeatId);
                }
            }
        }

        setSelectedSeats(newSelected.length > 0 ? newSelected : [seatId]);
    };

    const calculateTotal = () => {
        return selectedSeats.reduce((total, seatId) => {
            const rowLetter = seatId.charAt(0);
            const rowConfig = dynamicRowConfig.find((r) => r.row === rowLetter);
            return total + (rowConfig ? rowConfig.price : 200);
        }, 0);
    };

    const handleProceedToPayment = () => {
        if (selectedSeats.length === 0) return;

        const summary = {
            movieTitle: bookingData.movieTitle,
            movieId: bookingData.movieId,
            movieImage: movieImage,
            movieLang: movieLang,
            cinemaName: bookingData.cinemaName,
            cinemaAddress: bookingData.cinemaAddress,
            date: bookingData.date,
            showtime: activeShowtime,
            seats: selectedSeats,
            ticketCount: selectedSeats.length,
            totalAmount: calculateTotal(),
        };

        sessionStorage.setItem("paymentState", JSON.stringify(summary));
        navigate("/payment");
    };

    const handleModalConfirm = () => {
        setShowSeatModal(false);
        // Reset selected seats so user selects their desired seats and sees the price after selection
        setSelectedSeats([]);
    };

    return (
        <div className="booking-page-container">
            {/* Top Navigation Header */}
            <BookingHeader
                isFromCinema={isFromCinema || isFromMovieShowtimes}
                onBack={handleBack}
                movieTitle={bookingData.movieTitle}
                movieLang={movieLang}
                cinemaName={bookingData.cinemaName}
                date={bookingData.date}
                activeShowtime={activeShowtime}
                seatCount={seatCount}
                onEditTickets={() => setShowSeatModal(true)}
            />

            {/* Top Showtimes Switcher Bar */}
            <ShowtimeBar
                availableShowtimes={availableShowtimes}
                activeShowtime={activeShowtime}
                onSelectShowtime={handleShowtimeChange}
            />

            {/* Main Seating Screen Layout */}
            <SeatingArea
                dynamicRowConfig={dynamicRowConfig}
                seatsPerRow={SEATS_PER_ROW}
                occupiedSeats={OCCUPIED_SEATS}
                selectedSeats={selectedSeats}
                seatCount={seatCount}
                totalAmount={calculateTotal()}
                onSeatClick={handleSeatClick}
            />

            {/* Bottom Checkout Action Bar */}
            <CheckoutBar
                selectedSeats={selectedSeats}
                totalAmount={calculateTotal()}
                onProceed={handleProceedToPayment}
            />

            {/* "How Many Seats?" Modal with Movie Poster */}
            <SeatModal
                isOpen={showSeatModal}
                isFromCinema={isFromCinema || isFromMovieShowtimes}
                onBack={handleBack}
                movieTitle={bookingData.movieTitle}
                cinemaName={bookingData.cinemaName}
                movieImage={movieImage}
                activeShowtime={activeShowtime}
                seatCount={seatCount}
                onSelectSeatCount={setSeatCount}
                prices={prices}
                onConfirm={handleModalConfirm}
            />
        </div>
    );
};

export default Booking;
