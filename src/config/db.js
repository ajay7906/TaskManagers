const mongoose = require("mongoose");

async function connectDB(mongoUri) {
  console.log("Connecting to MongoDB...", mongoUri);
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
