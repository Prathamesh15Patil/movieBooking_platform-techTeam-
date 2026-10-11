import mongoose from "mongoose";


const connectDb = async (uri) => {
    await mongoose.connect(uri);
    console.log("Connected to DB successfully");
};

export default connectDb;
