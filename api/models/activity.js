const mongoose = require("mongoose");

const activitySchema = mongoose.Schema(
  {
    activity: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);
