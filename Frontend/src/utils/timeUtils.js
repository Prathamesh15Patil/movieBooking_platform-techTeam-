/**
 * Utility functions for checking and filtering movie showtimes based on current local time.
 */

export const parseShowtimeToMinutes = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return 0;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridian = match[3] ? match[3].toUpperCase() : null;

    if (meridian === "PM" && hours !== 12) {
        hours += 12;
    } else if (meridian === "AM" && hours === 12) {
        hours = 0;
    }
    return hours * 60 + minutes;
};

export const getCurrentMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
};

export const isDateToday = (dateInput) => {
    if (!dateInput) return true;

    // Check object format: { day: "SUN", date: "11", full: "Sun, 11 Oct 2026", ... }
    if (typeof dateInput === "object") {
        // Mock calendar's Day 0 is "SUN" / "11"
        if (dateInput.date === "11" || dateInput.day === "SUN") return true;
        if (dateInput.full && (dateInput.full.includes("11 Oct") || dateInput.full.toLowerCase().includes("today"))) return true;

        // Future dates in mock calendar (12 through 17) are never today
        const num = parseInt(dateInput.date, 10);
        if (num >= 12 && num <= 31 && num !== 11) {
            // Check if user system date specifically matches this day
            return num === new Date().getDate();
        }
    }

    if (typeof dateInput === "string") {
        const lower = dateInput.toLowerCase();
        if (lower.includes("today")) return true;
        if (lower.includes("11 oct") || lower.includes("sun, 11")) return true;

        const match = dateInput.match(/\b(\d{1,2})\b/);
        if (match) {
            const parsedNum = parseInt(match[1], 10);
            if (parsedNum === 11) return true;
            // Future mock dates (12-17) are not today unless system date matches
            return parsedNum === new Date().getDate();
        }
    }

    return false;
};

export const isShowtimePassed = (timeStr, dateInput = null) => {
    // If a date is provided and it is NOT today (i.e. future date like 12, 13, 14 Oct),
    // showtimes are upcoming and have NOT passed.
    if (dateInput && !isDateToday(dateInput)) {
        return false;
    }

    // For today, compare showtime with current local time
    const slotMinutes = parseShowtimeToMinutes(timeStr);
    const currentMinutes = getCurrentMinutes();
    return slotMinutes <= currentMinutes;
};

export const filterUpcomingShowtimes = (showtimes, dateInput = null) => {
    if (!showtimes || !Array.isArray(showtimes)) return [];
    if (!isDateToday(dateInput)) return showtimes;

    return showtimes.filter((st) => {
        const timeStr = typeof st === "string" ? st : st.time;
        return !isShowtimePassed(timeStr, dateInput);
    });
};
