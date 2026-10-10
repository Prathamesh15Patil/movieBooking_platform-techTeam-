import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String, required: true, select: false }, 
    role: { type: String, enum: ["user", "admin"], default: "user" },
    city: String, 
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);



