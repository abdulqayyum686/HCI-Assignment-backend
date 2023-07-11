const mongoose = require("mongoose");
const Task = require("../models/tasks");

module.exports.addMainTask = async (req, res, next) => {
  console.log("Add Task", req.body);
  const {
    taskName,
    belongsTo,
    taskType,
    status,
    version,
    completionDate,
    diff,
  } = req.body;

  let newTask = new Task({
    taskName,
    belongsTo,
    taskType,
    version,
    completionDate,
    diff,
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
};
module.exports.updateMainTask = async (req, res, next) => {
  console.log("Add Task", req.body);
  const { status, status2 } = req.body;
  let task = await Task.findOne({ _id: req.params.id });
  let array = [...task.subTasks];
  if (status === true) {
    array = array.map((t) => {
      return {
        ...t,
        status: status,
        // status2: status2,
      };
    });
  }

  if (status2 === true) {
    array = array.map((t) => {
      return {
        ...t,
        // status: status,
        status2: status2,
      };
    });
  }

  console.log("ali raza====", array);
  Task.findOneAndUpdate(
    { _id: req.params.id },
    { status: status, status2: status2, subTasks: array },
    { new: true }
  )
    .then(async (newDoc) => {
      return res.status(201).json({
        message: "Task Updated",
        task: newDoc,
      });
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
        let monoId = mongoose.Types.ObjectId().toString();
        Task.findByIdAndUpdate(
          { _id: taskId },
          {
            $push: {
              subTasks: {
                ...taskObject,
                _id: monoId,
                date: new Date(),
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
    let task = await Task.findOne({ _id: req.params.id });
    let clone = [...task.subTasks];
    let array = clone.filter(
      (t) => t._id.toString() !== req.params.subTaskId.toString()
    );
    console.log("array", array);

    Task.findByIdAndUpdate(
      { _id: req.params.id },
      {
        subTasks: array,
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
module.exports.changeSubTaskStatus = async (req, res, next) => {
  try {
    const { id, subTaskId } = req.params;
    const { status, status2 } = req.body;

    const updatedDocument = await Task.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          "subTasks.$[elem].status": status,
          "subTasks.$[elem].status2": status2,
        },
      },
      { new: true, arrayFilters: [{ "elem._id": subTaskId }] }
    );

    if (updatedDocument) {
      console.log("Document updated:", updatedDocument);
      res.status(200).json({
        message: "SubTask status updated successfully",
        updatedDocument,
      });
    } else {
      console.log("Task or subtask not found.");
      res.status(404).json({ error: "Task or subtask not found" });
    }
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports.changeSubTaskInputData = async (req, res, next) => {
  try {
    const { id, subTaskId } = req.params;
    const { inputData } = req.body;

    console.log("inputData===", inputData);

    const updatedDocument = await Task.findOneAndUpdate(
      { _id: id },
      { $set: { "subTasks.$[elem].inputData": inputData } },
      { new: true, arrayFilters: [{ "elem._id": subTaskId }] }
    );

    if (updatedDocument) {
      console.log("Document updated:", updatedDocument);
      res.status(200).json({
        message: "SubTask status updated successfully",
        updatedDocument,
      });
    } else {
      console.log("Task or subtask not found.");
      res.status(404).json({ error: "Task or subtask not found" });
    }
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getAllTasks = async (req, res, next) => {
  try {
    let tasks = await Task.find().populate("belongsTo");
    return res.status(201).json({
      tasks,
    });
  } catch (error) {
    return res.status(201).json({
      error,
    });
  }
};
module.exports.getAllUserTasks = async (req, res, next) => {
  try {
    let tasks = await Task.find({ belongsTo: req.params.id }).populate(
      "belongsTo"
    );
    return res.status(201).json({
      tasks,
    });
  } catch (error) {
    return res.status(201).json({
      error,
    });
  }
};
