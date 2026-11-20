const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    weightKg: {
      type: Number,
      min: 20,
      max: 300,
      default: null,
    },

    heightCm: {
      type: Number,
      min: 100,
      max: 250,
      default: null,
    },

    gender: {
      type: String,
      enum: ["", "male", "female", "other", "prefer_not_to_say"],
      default: "",
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;