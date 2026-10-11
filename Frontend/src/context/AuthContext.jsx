import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "movie_app_user";
const BOOKINGS_KEY = "movie_app_bookings";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [bookings, setBookings] = useState(() => {
        try {
            const saved = localStorage.getItem(BOOKINGS_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const login = (userData) => {
        const fullUser = {
            name: userData?.name || "Movie Fan",
            email: userData?.email || "user@popcornpass.com",
            phone: userData?.phone || "+91 98765 43210",
            avatar: userData?.avatar || null,
        };
        setUser(fullUser);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fullUser));
        } catch (e) {
            console.error("Failed to save user to localStorage", e);
        }
        setIsAuthModalOpen(false);
    };

    const logout = () => {
        setUser(null);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            console.error("Failed to remove user from localStorage", e);
        }
    };

    const addBooking = (bookingData) => {
        const newBooking = {
            id: bookingData.bookingId || "BK-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
            bookedAt: new Date().toISOString(),
            ...bookingData,
        };
        setBookings((prev) => {
            const updated = [newBooking, ...prev];
            try {
                localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
            } catch (e) {
                console.error("Failed to save booking to localStorage", e);
            }
            return updated;
        });
        return newBooking;
    };

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                bookings,
                addBooking,
                isAuthModalOpen,
                openAuthModal,
                closeAuthModal,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
