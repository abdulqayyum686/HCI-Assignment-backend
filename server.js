const http = require("http");
const express = require("express");

// const moment = require("moment");
// require("moment-timezone");
// const originalDate = new Date("2023-07-30T00:00:00.000Z"); // Replace this with your actual date
// const timeZone = "America/Halifax"; // Replace with the desired time zone, e.g., 'America/Halifax'

// // Apply the desired time zone to the date
// const convertedDate = moment("2023-07-30T00:00:00.000Z").tz(timeZone);

// console.log("Original Date:", originalDate.toString());
// console.log("Converted Date:", convertedDate.format());

// const app = express();
require("events").EventEmitter.prototype._maxListeners = 100;
const app = require("./app");
var cors = require("cors");

const userRouterFile = require("./api/routes/users");
const taskRouterFile = require("./api/routes/task");
///cors issuenpm start
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
const server = http.createServer(app);
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//     // origin: 'https://www.helpros.app/api/',
//     // methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     // credentials: true,
//   },
// });

userRouterFile.userRouter();
taskRouterFile.taskRouter();

// io.on("connection", (socket) => {
//   console.log("New client connected");
//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

const port = process.env.port || 6002;
server.listen(port, () => {
  console.log(`Server Started At PORT : ${port} {Ansa Media Project Backend}`);
});

module.exports = server;
