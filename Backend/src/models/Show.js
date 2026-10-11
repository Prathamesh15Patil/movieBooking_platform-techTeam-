import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
  startTime: { type: Date, required: true },
  language: String,
  ticketPrice: { type: Number, required: true },
  seats: [{
    seatId: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['AVAILABLE', 'LOCKED', 'BOOKED'], 
      default: 'AVAILABLE' 
    },
    
  }]
}, { timestamps: true });

export default mongoose.model('Show', showSchema);