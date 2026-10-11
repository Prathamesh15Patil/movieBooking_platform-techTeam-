import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentCheckout, PaymentSuccess } from "../component/payment";
import { useAuth } from "../context/AuthContext";
import "./Payment.css";

const Payment = () => {
    const navigate = useNavigate();
    const { addBooking, user, openAuthModal } = useAuth();
    const [bookingSummary, setBookingSummary] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("checkout"); // "checkout" | "success"

    useEffect(() => {
        try {
            const savedState = sessionStorage.getItem("paymentState");
            if (savedState) {
                setBookingSummary(JSON.parse(savedState));
            } else {
                // Fallback default state if accessed directly
                setBookingSummary({
                    movieTitle: "Drishyam: The Conclusion",
                    movieImage: "/Drishyam-The-Conclusion-poster-2026.jpeg",
                    movieLang: "Hindi",
                    cinemaName: "INOX: Camp Road, Belagavi",
                    cinemaAddress: "Head Post Office Road, Belagavi",
                    date: "Sun, 11 Oct 2026",
                    showtime: "04:25 PM",
                    seats: ["F3", "F4"],
                    ticketCount: 2,
                    totalAmount: 440,
                });
            }
        } catch (e) {
            console.error("Failed to parse paymentState", e);
        }
    }, []);

    const handlePay = () => {
        // Check if user is logged in
        if (!user) {
            // Direct to login
            openAuthModal();
            return;
        }

        // If logged in, allow to pay
        if (bookingSummary) {
            addBooking(bookingSummary);
        }
        setPaymentStatus("success");
    };

    const handleCancel = () => {
        // Return back to booking or previous page
        navigate(-1);
    };

    const handleReturnHome = () => {
        // Clear stored payment state and return to home
        sessionStorage.removeItem("paymentState");
        navigate("/");
    };

    return (
        <div className="payment-page-wrapper">
            {paymentStatus === "checkout" ? (
                <PaymentCheckout
                    bookingSummary={bookingSummary}
                    user={user}
                    onPay={handlePay}
                    onCancel={handleCancel}
                />
            ) : (
                <PaymentSuccess
                    bookingSummary={bookingSummary}
                    onReturnHome={handleReturnHome}
                />
            )}
        </div>
    );
};

export default Payment;