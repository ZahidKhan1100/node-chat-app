const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/chat-app";

const connectDB = async () => {
  await mongoose
    .connect(url)
    .then(() => {
      console.log("Database exist or created ");
    })
    .catch(async (error) => {
      if (
        error.message &&
        error.message.includes("failed to connect to server")
      ) {
        console.log("Database not found. Attempting to create it...");
        try {
          await mongoose.connect(url.substring(0, url.lastIndexOf("/")));
        } catch (error) {
          console.error("Error creating database:", error);
        }
      } else {
        console.error("Error connecting to MongoDB:", error);
      }
    });
};

module.exports = connectDB;
