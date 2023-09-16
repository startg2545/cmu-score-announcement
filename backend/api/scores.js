const express = require("express");
const { verifyAndValidateToken } = require("../jwtUtils");
const scoreModel = require("../db/scoreSchema");
const router = express.Router();

//get scores
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token);

    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }

    //get one score for cal stat in student dashboard
    if (req.query.scoreName) {
      const section = await scoreModel.findOne({
        courseNo: req.query.courseNo,
        "sections.section": req.query.section,
      });
      const score = section.sections[0].scores.filter(
        (e) => e.scoreName === req.query.scoreName
      );
      return res.send(score[0]);
    } else {
      //get all score of each instructor/co-instructor
      const course = await scoreModel.find({
        year: req.query.year,
        semester: req.query.semester,
        $or: [
          { "sections.instructor": user.cmuAccount },
          { "sections.coInstructors": user.cmuAccount },
        ],
      });
      const sections = course
        .map((e) => {
          const filteredSections = e.sections.filter(
            (s) =>
              s.instructor === user.cmuAccount ||
              s.coInstructors?.includes(user.cmuAccount)
          );
          if (filteredSections.length > 0) {
            return { ...e._doc, sections: filteredSections };
          }
          return null;
        })
        .filter(Boolean);

      if (sections.length) return res.send({ ok: true, course: sections });
      else
        return res.send({ ok: false, message: "You don't have any course." });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

//delete scores
router.delete("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token);
    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }

    const courseNo = req.query.courseNo;
    const year = req.query.year;
    const semester = req.query.semester;
    const scoreName = req.query.scoreName;
    const type = req.query.type;

    if (type === "delete_one") {
      await scoreModel.findOneAndUpdate(
        {
          courseNo,
          year,
          semester,
          "sections.section": req.query.section,
        },
        {
          $pull: {
            "sections.$.scores": {
              scoreName: scoreName,
            },
          },
        },
        { new: true }
      );
      return res.send({
        ok: true,
        message: `score ${scoreName} delete in section ${req.query.section} deleted.`,
      });
    } else if (type === "delete_all") {
      const test = await scoreModel.findOneAndUpdate(
        {
          courseNo,
          year,
          semester,
          $or: [
            { "sections.instructor": user.cmuAccount },
            { "sections.coInstructors": user.cmuAccount },
          ],
        },
        {
          $pull: {
            "sections.$[ins].scores": { scoreName: scoreName },
            "sections.$[coIns].scores": { scoreName: scoreName },
          },
        },
        {
          new: true,
          arrayFilters: [
            { "ins.instructor": user.cmuAccount },
            { "coIns.coInstructors": user.cmuAccount },
          ],
        }
      );
      return res.send({
        ok: true,
        message: `score ${scoreName} deleted in all section of you.`,
      });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

module.exports = router;
