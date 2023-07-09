const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task");

function taskRouter(io) {
  function ioMiddleware(req, res, next) {
    (req.io = io), next();
  }
  io.on("connection", (socket) => {
    socket.emit("request", { data: "Socket connected" });
    socket.on("reply", (data) => {
      console.log("admin routes => ", data);
    });
  });

  router.post("/add-task", ioMiddleware, taskController.addMainTask);

  router.put("/update-task/:id", ioMiddleware, taskController.updateMainTask);

  router.delete(
    "/delete-task/:id",
    ioMiddleware,
    taskController.deleteMainTask
  );
  router.post("/add-sub-task", ioMiddleware, taskController.addSubTask);
  router.delete(
    "/delete-sub-task/:id/:subTaskId",
    ioMiddleware,
    taskController.deleteSubTask
  );
  router.put(
    "/change-sub-task-status/:id/:subTaskId",
    ioMiddleware,
    taskController.changeSubTaskStatus
  );
  router.put(
    "/change-sub-task-input-data/:id/:subTaskId",
    ioMiddleware,
    taskController.changeSubTaskInputData
  );
  router.get("/get-all-tasks", ioMiddleware, taskController.getAllTasks);
  router.get(
    "/get-all-user-tasks/:id",
    ioMiddleware,
    taskController.getAllUserTasks
  );

  return router;
}

let taskRouterFile = {
  router: router,
  taskRouter: taskRouter,
};
module.exports = taskRouterFile;
