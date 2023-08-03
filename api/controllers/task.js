const mongoose = require("mongoose");
const Task = require("../models/tasks");
const moment = require("moment");
const Activity = require("../models/activity");
const User = require("../models/users");
require("moment-timezone");
const _ = require("lodash");

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
    completionDate: moment(new Date(completionDate))
      // .tz("America/Halifax")
      .add(1, "day")
      .format(),
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
// module.exports.addActivity = async (req, res, next) => {
//   let activity = new Activity({ ...req.body });
//   activity
//     .save()
//     .then(async (savedObject) => {
//       console.log("savedObject", savedObject);
//       return res.status(201).json({
//         message: "Activity added",
//         activity: savedObject,
//       });
//     })
//     .catch((err) => {
//       console.log("Not saved", err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// };
module.exports.updateMainTask = async (req, res, next) => {
  console.log("Add Task", req.body);
  const { status, status2, inputData, subTasks } = req.body;
  console.log("inputData===", subTasks);

  let task = await Task.findOne({ _id: req.params.id });

  let array = req.body.subTasks ? req.body.subTasks : [...task.subTasks];
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
  let obj = { ...req.body };
  if (req.body.completionDate) {
    obj.completionDate = moment(new Date(req.body.completionDate))
      // .tz("America/Halifax")
      .add(1, "day")
      .format();
  }
  console.log("ali raza====", array);
  Task.findOneAndUpdate(
    { _id: req.params.id },
    {
      ...obj,
      // status: status,
      // status2: status2,
      subTasks: array,
      // inputData: inputData,
    },
    { new: true }
  )
    .then(async (newDoc) => {
      AddActivity(req, res, next, newDoc, req.body.type);
      return res.status(201).json({
        message: "Goal Updated",
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
        message: "Goal deleted successfully",
        task: deletedDocument,
      });
    } else {
      res.status(404).json({ error: "Goal not found" });
    }
  } catch (err) {
    console.log("Error deleting task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.addSubTask = (req, res, next) => {
  console.log("Add sub Task", req.body);
  const { taskId, taskObject } = req.body;

  console.log(
    "abdullllll===========",
    moment(new Date(taskObject.completionDate)).tz("America/Halifax").format()
  );
  Task.findOne({ _id: taskId.toString() })
    .exec()
    .then(async (foundObject) => {
      console.log("task found", foundObject);
      if (!foundObject) {
        return res.status(403).json({
          message: "Goal do not exist",
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
                completionDate: moment(new Date(taskObject.completionDate))
                  // .tz("America/Halifax")
                  .add(1, "day")
                  .format(),
              },
            },
          },
          { new: true }
        )
          .then((updatedDocument) => {
            console.log("Document updated:", updatedDocument);
            return res.status(201).json({
              message: "Sub-Goal added",
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
          message: "Sub-Goal deleted successfully",
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
    const { status, status2, type } = req.body;

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
      AddActivity(req, res, next, updatedDocument, type);
      console.log("Document updated:", updatedDocument);
      res.status(200).json({
        message: "Sub-Goal status updated successfully",
        updatedDocument,
      });
    } else {
      console.log("Task or subtask not found.");
      res.status(404).json({ error: "Sub-Goal not found" });
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
      { new: true, arrayFilters: [{ "elem._id": subTaskId }] }
    );

    if (updatedDocument) {
      console.log("Document updated:", updatedDocument);
      res.status(200).json({
        message: "Sub-Goal status updated successfully",
        updatedDocument,
      });
    } else {
      console.log("Task or subtask not found.");
      res.status(404).json({ error: "SubGoal not found" });
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
module.exports.getAllActivity = async (req, res, next) => {
  try {
    let activity = await Activity.find();
    let array = [...activity];
    array = _.sortBy(array, "type");
    console.log("sor array===", array);
    for (let i = 0; i < array.length; i++) {
      array[i] = {
        ...array[i].activity,
        belongsTo: { ...array[i].belongsTo },
        actionType: array[i].type,
        // timeStamps: array[i].updatedAt,
      };
      delete array[i].activity;
    }
    // console.log("array========================", array);

    return res.status(201).json({
      activity: array,
    });
  } catch (error) {
    return res.status(201).json({
      error,
    });
  }
};
module.exports.getAllUserTasks = async (req, res, next) => {
  try {
    let tasks = await Task.find({
      belongsTo: req.params.id,
      isDeleted: false,
    })
      .populate("belongsTo")
      .lean();
    tasks = tasks.map((task) => ({
      ...task,
      subTasks: task.subTasks.filter((subTask) => subTask.isDeleted === false),
    }));
    return res.status(201).json({
      tasks,
    });
  } catch (error) {
    return res.status(201).json({
      error,
    });
  }
};

const AddActivity = async (req, res, next, data, type) => {
  let user = await User.findOne({ _id: data.belongsTo });
  // console.log(
  //   "ali raza========================================================================================================================",
  //   user
  // );
  let activity = new Activity({ activity: data, type, belongsTo: user });

  activity
    .save()
    .then(async (savedObject) => {
      console.log("savedObject", savedObject);
      // next();
    })
    .catch((err) => {
      console.log("Not saved", err);
    });
};
