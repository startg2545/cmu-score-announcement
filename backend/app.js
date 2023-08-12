const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

const dbConnect = require("./db/dbConnect");
dbConnect();

const prefix = "/api/v1";
const user = require("./api/user");
const cmuOAuth = require("./api/cmuOAuth");
const course = require("./api/course");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(`${prefix}/cmuOAuth`, cmuOAuth);
app.use(`${prefix}/user`, user);
app.use(`${prefix}/course`, course);

app.listen(port, () => console.log(`Express app running on port ${port}!`));
