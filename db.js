import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL);
    isConnected = db.connections[0].readyState;
    console.log("DB connected");
  } catch (err) {
    console.log("DB Error:", err);
  }
};

export default connectDB;