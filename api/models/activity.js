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
    type2: {
      type: String,
      required: true,
    },
    belongsTo: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);
