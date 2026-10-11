import React from "react";
import "./AccountDetails.css";

const AccountDetails = ({ user, onLogout }) => {
    return (
        <div className="profile-details-card">
            <h3 className="section-title">Account Information</h3>
            <div className="details-grid">
                <div className="detail-field">
                    <label>Full Name</label>
                    <div className="field-value">{user?.name}</div>
                </div>
                <div className="detail-field">
                    <label>Email Address</label>
                    <div className="field-value">{user?.email}</div>
                </div>
                <div className="detail-field">
                    <label>Phone Number</label>
                    <div className="field-value">{user?.phone || "+91 98765 43210"}</div>
                </div>
                <div className="detail-field">
                    <label>Membership Status</label>
                    <div className="field-value status-gold">PopcornPass VIP Club</div>
                </div>
            </div>

            <div className="profile-actions-bottom">
                <button
                    type="button"
                    className="profile-btn-danger"
                    onClick={onLogout}
                >
                    Log Out of Account
                </button>
            </div>
        </div>
    );
};

export default AccountDetails;
