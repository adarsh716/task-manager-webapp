import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://iarshdeeps77:iarshdeeps77@cluster0.yd3mv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env");
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB Connected");
};
