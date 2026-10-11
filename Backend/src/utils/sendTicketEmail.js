import nodemailer from "nodemailer";

const sendTicketEmail = async ({ to, name, booking, show }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const when = new Date(show.startTime).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const discountRows =
    booking.discount > 0
      ? `<tr><td><b>Subtotal</b></td><td>₹${booking.subtotal}</td></tr>
         <tr><td><b>${booking.offerName}</b></td><td>-₹${booking.discount}</td></tr>`
      : "";

  await transporter.sendMail({
    from: `"Movie Booking" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your ticket: ${show.movie.title}`,
    html: `
      <h2>Booking confirmed</h2>
      <p>Hi ${name}, your payment was successful.</p>
      <table cellpadding="6">
        <tr><td><b>Movie</b></td><td>${show.movie.title}</td></tr>
        <tr><td><b>Theatre</b></td><td>${show.theater.name}, ${show.theater.location} (${show.theater.screenName})</td></tr>
        <tr><td><b>Show time</b></td><td>${when}</td></tr>
        <tr><td><b>Seats</b></td><td>${booking.seatsBooked.join(", ")}</td></tr>
        ${discountRows}
        <tr><td><b>Amount paid</b></td><td>₹${booking.totalAmount}</td></tr>
        <tr><td><b>Booking ID</b></td><td>${booking._id}</td></tr>
        <tr><td><b>Payment ID</b></td><td>${booking.paymentId}</td></tr>
      </table>
      <p>Show this email at the theatre entrance.</p>`,
  });
};

export default sendTicketEmail;