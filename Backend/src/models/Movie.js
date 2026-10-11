import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: { type: String, required: true, index: "text" },                   
  description: String,                                        
  duration: Number,                                          
  genres: [String],                                          
  languages: [String],                                      
  releaseDate: Date,
  status: { type: String, enum: ["upcoming", "now_showing", "ended"], default: "upcoming" },
  assetKey: String,
},{ timestamps: true });

export default mongoose.model("Movie", movieSchema);


