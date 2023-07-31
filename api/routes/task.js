const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task");

function taskRouter(io) {
  // function ioMiddleware(req, res, next) {
  //   (req.io = io), next();
  // }
  // io.on("connection", (socket) => {
  //   socket.emit("request", { data: "Socket connected" });
  //   socket.on("reply", (data) => {
  //     console.log("admin routes => ", data);
  //   });
  // });

  router.post("/add-task", taskController.addMainTask);
  // router.post("/add-activity", taskController.addActivity);

  router.put("/update-task/:id", taskController.updateMainTask);

  router.delete(
    "/delete-task/:id",

    taskController.deleteMainTask
  );
  router.post("/add-sub-task", taskController.addSubTask);
  router.delete(
    "/delete-sub-task/:id/:subTaskId",

    taskController.deleteSubTask
  );
  router.put(
    "/change-sub-task-status/:id/:subTaskId",

    taskController.changeSubTaskStatus
  );
  router.put(
    "/change-sub-task-input-data/:id/:subTaskId",

    taskController.changeSubTaskInputData
  );
  router.get("/get-all-tasks", taskController.getAllTasks);
  router.get("/get-all-activity", taskController.getAllActivity);
  router.get(
    "/get-all-user-tasks/:id",

    taskController.getAllUserTasks
  );

  return router;
}

let taskRouterFile = {
  router: router,
  taskRouter: taskRouter,
};
module.exports = taskRouterFile;
