const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  loginFails: {
    type: Number,
    required: false,
    default: 0,
  },
  resetPassToken: {
    type: String,
    required: false,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.models?.user || mongoose.model("user", userSchema);
