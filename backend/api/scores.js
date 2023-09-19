const express = require("express");
const { verifyAndValidateToken } = require("../jwtUtils");
const scoreModel = require("../db/scoreSchema");
const studentModel = require("../db/studentSchema");
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
        return res.send({ ok: false, message: "No Course" });
    }
  } catch (err) {
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

    const { courseNo, year, semester, scoreName, type } = req.query;

    if (type === "delete_one" || type === "unpublish") {
      const section = req.query.section;
      const sections = await scoreModel.findOne({
        courseNo,
        year,
        semester,
      });
      const results = sections.sections
        .filter((e) => e.section === parseInt(section))[0]
        .scores.filter((e) => e.scoreName === scoreName)[0].results;
      for (let score in results) {
        await studentModel.findOneAndUpdate(
          {
            studentId: results[score].studentId,
            "courseGrades.courseNo": courseNo,
            "courseGrades.year": year,
            "courseGrades.semester": semester,
            "courseGrades.scores.scoreName": scoreName,
          },
          {
            $pull: {
              "courseGrades.$.scores": {
                scoreName: scoreName,
              },
            },
          },
          { new: true }
        );
      }
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
          message: `${scoreName} in section ${section} deleted.`,
        });
      } else if (type === "unpublish") {
        await scoreModel.findOneAndUpdate(
          {
            courseNo,
            year,
            semester,
            "sections.section": section,
            "sections.scores.scoreName": scoreName,
          },
          {
            
            $set: {
              "sections.$[section].scores.$[score].isPublish": false,
            },
          },
          {
            new: true,
            arrayFilters: [
              { "section.section": section },
              { "score.scoreName": scoreName },
            ],
          }
        );
        return res.send({
          ok: true,
          message: `${scoreName} hidden`,
        });
      }
    } else if (type === "delete_all") {
      const course = await scoreModel.findOne({
        courseNo,
        year,
        semester,
      });
      const sections = course.sections
        .filter(
          (e) =>
            e.instructor === user.cmuAccount ||
            e.coInstructors.includes(user.cmuAccount)
        )
        .map((e) => {
          const filteredScore = e.scores.filter(
            (s) => s.scoreName === scoreName
          );
          if (filteredScore.length > 0) {
            return { ...e._doc, scores: filteredScore };
          }
          return null;
        })
        .filter(Boolean);

      for (let section in sections) {
        const results = sections[section].scores[0].results;
        for (let score in results) {
          await studentModel.findOneAndUpdate(
            {
              studentId: results[score].studentId,
              "courseGrades.courseNo": courseNo,
              "courseGrades.year": year,
              "courseGrades.semester": semester,
              "courseGrades.scores.scoreName": scoreName,
            },
            {
              $pull: {
                "courseGrades.$.scores": {
                  scoreName: scoreName,
                },
              },
            },
            { new: true }
          );
        }
      }
      await scoreModel.findOneAndUpdate(
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
        message: `${scoreName} deleted in all sections`,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

module.exports = router;
