const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "user",
    },
    loginCount: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
