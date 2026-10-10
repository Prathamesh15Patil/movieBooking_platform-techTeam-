import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const theatreSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },

  screenName: { type: String, required: true },
  totalRows: { type: Number, required: true },
  seatsPerRow: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("Theatre", theatreSchema);


