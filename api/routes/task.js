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
  router.get("/get-all-tasks", ioMiddleware, taskController.getAllTasks);

  return router;
}

let taskRouterFile = {
  router: router,
  taskRouter: taskRouter,
};
module.exports = taskRouterFile;
