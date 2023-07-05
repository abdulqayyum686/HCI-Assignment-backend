const mongoose = require("mongoose");
const Task = require("../models/tasks");
// remove c
module.exports.addMainTask = async (req, res, next) => {
  console.log("Add Task", req.body);
  const { taskName, belongsTo, taskType, status } = req.body;

  Task.findOne({ taskName: taskName })
    .exec()
    .then(async (foundObject) => {
      if (foundObject) {
        return res.status(403).json({
          message: "Task Already exist",
        });
      } else {
        let newTask = new Task({
          taskName,
          belongsTo,
          taskType,
        });
        newTask
          .save()
          .then(async (savedObject) => {
            console.log("savedObject", savedObject);
            return res.status(201).json({
              message: "Task added",
              task: savedObject,
            });
          })
          .catch((err) => {
            console.log("Not saved", err);
            res.status(500).json({
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};
module.exports.deleteMainTask = async (req, res, next) => {
  try {
    const deletedDocument = await Task.findByIdAndDelete(req.params.id);
    if (deletedDocument) {
      res.status(200).json({
        message: "Task deleted successfully",
        deletedDocument,
      });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (err) {
    console.log("Error deleting task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.addSubTask = (req, res, next) => {
  console.log("Add sub Task", req.body);
  const { taskId, taskObject } = req.body;

  Task.findOne({ _id: taskId.toString() })
    .exec()
    .then(async (foundObject) => {
      console.log("task found", foundObject);
      if (!foundObject) {
        return res.status(403).json({
          message: "Task do not exist",
        });
      } else {
        Task.findByIdAndUpdate(
          { _id: taskId },
          {
            $push: {
              subTasks: {
                ...taskObject,
                _id: mongoose.Types.ObjectId(),
              },
            },
          },
          { new: true }
        )
          .then((updatedDocument) => {
            console.log("Document updated:", updatedDocument);
            return res.status(201).json({
              message: "Sub Task added",
              subTask: updatedDocument,
            });
          })
          .catch((error) => {
            console.error("Error updating document:", error);
            res.status(500).json({
              error,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};
module.exports.deleteSubTask = async (req, res, next) => {
  try {
    console.log("object", req.params);
    Task.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          subTasks: { _id: mongoose.Types.ObjectId(req.params.subtaskId) },
        },
      },
      { new: true }
    )
      .then((updatedDocument) => {
        console.log("Document updated:", updatedDocument);
        res.status(200).json({
          message: "SubTask deleted successfully",
          updatedDocument,
        });
      })
      .catch((error) => {
        console.error("Error updating document:", error);
        res.status(500).json({ error });
      });
  } catch (err) {
    console.log("Error deleting sub task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
