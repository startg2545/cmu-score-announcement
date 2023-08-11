const express = require("express");
var cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const db = require("./db/dbConnect");
const prefix = "/api/v1";
const user = require("./api/user");
const cmuOAuth = require("./api/cmuOAuth");
const course = require("./api/course");

db();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

app.use(`${prefix}/cmuOAuth`, cmuOAuth);
app.use(`${prefix}/user`, user);
app.use(`${prefix}/course`, course);

app.get("/", (req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => console.log(`Express app running on port ${port}!`));
