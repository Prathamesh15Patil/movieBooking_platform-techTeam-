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
    const now = new Date();
    const todayDateNum = now.getDate();

    if (typeof dateInput === "object" && dateInput.date) {
        return parseInt(dateInput.date, 10) === todayDateNum;
    }

    if (typeof dateInput === "string") {
        if (dateInput.toLowerCase().includes("today")) return true;
        const match = dateInput.match(/\b(\d{1,2})\b/);
        if (match) {
            return parseInt(match[1], 10) === todayDateNum;
        }
    }

    return false;
};

export const isShowtimePassed = (timeStr, dateInput = null) => {
    // If a date is provided and it is a future date, the showtime has not passed
    if (dateInput) {
        const now = new Date();
        const todayDateNum = now.getDate();
        let dateNum = todayDateNum;

        if (typeof dateInput === "object" && dateInput.date) {
            dateNum = parseInt(dateInput.date, 10);
        } else if (typeof dateInput === "string") {
            const match = dateInput.match(/\b(\d{1,2})\b/);
            if (match) dateNum = parseInt(match[1], 10);
        }

        if (dateNum > todayDateNum) {
            return false;
        }
        if (dateNum < todayDateNum) {
            return true;
        }
    }

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
