import mongoose from 'mongoose';


const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seatsBooked: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Confirmed', 'Cancelled'], 
    default: 'Confirmed' 
  },
  bookingDate: { type: Date, default: Date.now},
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);