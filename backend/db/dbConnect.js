const mongoose = require("mongoose");

async function dbConnect() {
  mongoose.connect(process.env.DB_URL);
  mongoose.connection.on("connected", () => {
    console.log("database is connected successfully");
  });
  mongoose.connection.on("disconnected", () => {
    console.log("database is disconnected successfully");
  });
  mongoose.connection.on(
    "error",
    console.error.bind(console, "connection error:")
  );
}

module.exports = dbConnect;
