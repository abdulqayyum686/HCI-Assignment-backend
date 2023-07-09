const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

function userRouter(io) {
  // function ioMiddleware(req, res, next) {
  //   (req.io = io), next();
  // }
  // io.on("connection", (socket) => {
  //   socket.emit("request", { data: "Socket connected" });
  //   socket.on("reply", (data) => {
  //     console.log("admin routes => ", data);
  //   });
  // });

  router.post("/user-login", userController.userLogin);
  router.post("/user-signup", userController.addUser);
  router.get("/get-all-users", userController.getAllUsers);
  router.get(
    "/get-current-user/:id",

    userController.getCurrentUser
  );

  return router;
}

let userRouterFile = {
  router: router,
  userRouter: userRouter,
};
module.exports = userRouterFile;
