import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("\n❌ MONGO_URI is not defined in .env file");
      console.error(
        "\n📝 Please update server/.env file with your MongoDB connection string:"
      );
      console.error("\n   For MongoDB Atlas:");
      console.error(
        "   MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/tourmate"
      );
      console.error("\n   For Local MongoDB:");
      console.error("   MONGO_URI=mongodb://localhost:27017/tourmate");
      console.error("\n   You can copy from: server/env.template\n");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("\n❌ DB Connection Error:", error.message);
    console.error(
      "   Make sure MongoDB is running and the connection string is correct\n"
    );
    process.exit(1);
  }
};
