import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seatsBooked: [{ type: String, required: true }],
  subtotal: Number,
  discount: { type: Number, default: 0 },
  offerName: String,
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Paid' },
  paymentId: String,
  status: {
    type: String,
    enum: ['Confirmed', 'Cancelled'],
    default: 'Confirmed'
  },
  bookingDate: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);