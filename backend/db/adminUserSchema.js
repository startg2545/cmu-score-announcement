const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
  {
    admin: { type: String, unique: true },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("admin user", adminUserSchema);