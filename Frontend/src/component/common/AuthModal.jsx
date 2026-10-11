import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AuthModal.css";

const AuthModal = () => {
    const { isAuthModalOpen, closeAuthModal, login } = useAuth();
    const [mode, setMode] = useState("signup"); // "signup" | "signin"
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isAuthModalOpen) {
                closeAuthModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isAuthModalOpen, closeAuthModal]);

    if (!isAuthModalOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const userName = name.trim() || (email ? email.split("@")[0] : "Movie Fan");
        login({
            name: userName,
            email: email.trim() || `${userName.toLowerCase().replace(/\s+/g, "")}@example.com`,
        });
    };

    const handleQuickLogin = (demoName) => {
        login({
            name: demoName,
            email: `${demoName.toLowerCase().replace(/\s+/g, "")}@popcornpass.com`,
        });
    };

    return (
        <div className="auth-modal-overlay" onClick={closeAuthModal}>
            <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className="auth-modal-close"
                    onClick={closeAuthModal}
                    aria-label="Close"
                >
                    ✕
                </button>

                <div className="auth-modal-header">
                    <span className="auth-logo-badge">PopcornPass</span>
                    <h3>{mode === "signup" ? "Create an Account" : "Welcome Back"}</h3>
                    <p>
                        {mode === "signup"
                            ? "Sign up to track your movie bookings & tickets"
                            : "Sign in to manage your tickets and profile"}
                    </p>
                </div>

                {/* Tabs */}
                <div className="auth-tabs">
                    <button
                        type="button"
                        className={`auth-tab-btn ${mode === "signup" ? "active" : ""}`}
                        onClick={() => setMode("signup")}
                    >
                        Sign Up
                    </button>
                    <button
                        type="button"
                        className={`auth-tab-btn ${mode === "signin" ? "active" : ""}`}
                        onClick={() => setMode("signin")}
                    >
                        Sign In
                    </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {mode === "signup" && (
                        <div className="auth-input-group">
                            <label>Your Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Prathamesh Patil"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                    )}

                    <div className="auth-input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        {mode === "signup" ? "Create Account" : "Sign In"}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or fast login as demo user</span>
                </div>

                <div className="quick-login-row">
                    <button
                        type="button"
                        className="quick-demo-btn"
                        onClick={() => handleQuickLogin("Prathamesh Patil")}
                    >
                        Prathamesh Patil
                    </button>
                    <button
                        type="button"
                        className="quick-demo-btn"
                        onClick={() => handleQuickLogin("Rahul Sharma")}
                    >
                        Rahul Sharma
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
