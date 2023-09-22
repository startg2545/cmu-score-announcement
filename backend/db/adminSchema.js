const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        admin: String,
        semester: Number,
        year: Number
    },
    {
        versionKey: false,
    }
);

module.exports = mongoose.model("admins", adminSchema);