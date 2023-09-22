const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

const port = process.env.PORT || 5000;

const prefix = "/api/v1";
const user = require("./api/user");
const cmuOAuth = require("./api/cmuOAuth");
const cpe = require("./api/cpe");
const course = require("./api/course");
const student = require("./api/student");
const scores = require("./api/scores");

const dbConnect = require("./db/dbConnect");
dbConnect();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(`${prefix}/cmuOAuth`, cmuOAuth);
app.use(`${prefix}/cpe`, cpe);
app.use(`${prefix}/user`, user);
app.use(`${prefix}/course`, course);
app.use(`${prefix}/student`, student);
app.use(`${prefix}/scores`, scores);

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}!`)
);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  app.set("socket", socket);
  console.log(`${socket.id}: a user connected.`);
  socket.on("disconnect", () => {
    console.log(`${socket.id}: a user disconnected.`);
  });
});