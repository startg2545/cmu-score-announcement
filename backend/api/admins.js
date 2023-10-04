const express = require("express");
const { verifyAndValidateToken } = require("../jwtUtils");
const adminModel = require("../db/adminSchema");
const adminUserModel = require("../db/adminUserSchema");
const router = express.Router();

//add admin user
router.post("/user", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token, res);
    if (!user.cmuAccount)
      return res.status(403).send({ ok: false, message: "Invalid token" });

    const socket = req.app.get("socket");

    const admin = await adminUserModel.findOne({
      admin: req.body.admin,
    });

    if (admin) return res.send("Admin user already exist.");

    await adminUserModel.create({
      admin: req.body.admin,
    });

    socket.emit("adminUpdate", "add admin user");
    return res.send({ ok: true, message: "Add admin user successful." });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

//delete admin user
router.delete("/user", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token, res);
    if (!user.cmuAccount)
      return res.status(403).send({ ok: false, message: "Invalid token" });

    const socket = req.app.get("socket");

    await adminUserModel.findOneAndDelete({
      admin: req.query.admin,
    });

    socket.emit("adminUpdate", "delete admin user");
    return res.send({ ok: true, message: "Admin user has been deleted." });
  } catch (err) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

router.post("/delete", async (req, res) => {
  try {
    const socket = req.app.get("socket");
    const _id = req.body._id;

    const current = await adminModel.findOneAndDelete({ _id: _id });

    socket.emit("currentUpdate", current);
    return res.send("This is item has been deleted.");
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token, res);
    if (!user.cmuAccount)
      return res.status(403).send({ ok: false, message: "Invalid token" });

    const socket = req.app.get("socket");
    const semester = parseInt(req.body.semester);
    const year = parseInt(req.body.year);

    const current = await adminModel.findOne({ semester, year });

    if (current) {
      socket.emit("currentUpdate", current);
      return res.send("This current already exists, pleaes try again.");
    } else {
      const new_current = await adminModel.create({
        admin: user.cmuAccount,
        semester,
        year,
      });
      socket.emit("currentUpdate", new_current);
      return res.send("New current has been added.");
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token, res);
    if (!user.cmuAccount)
      return res.status(403).send({ ok: false, message: "Invalid token" });

    const currents = await adminModel
      .find()
      .sort({ year: "desc", semester: "desc" });

    return res.send(currents);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

module.exports = router;
