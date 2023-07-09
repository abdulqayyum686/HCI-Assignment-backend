const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    taskName: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    taskType: {
      type: String,
      default: "Academic",
    },
    subTasks: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tasks", taskSchema);
