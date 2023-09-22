const express = require("express");
const { verifyAndValidateToken } = require("../jwtUtils");
const adminModel = require("../db/adminSchema");
router = express.Router();

router.post("/delete", async (req, res) => {
    try {

        
        const _id = req.body._id

        const current = await adminModel.findOneAndDelete({ _id: _id });

        return res.send('This is item has been deleted.')

    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .send({ ok: false, message: "Internal Server Error" })
    }
})

router.post("/", async (req, res) => {
    try {
        const token = req.cookies.token;
        const user = await verifyAndValidateToken(token);
        if (!user.cmuAccount) return res.status(403).send({ ok: false, message: "Invalid token" });
        
        const semester = parseInt(req.body.semester)
        const year = parseInt(req.body.year)

        const current = await adminModel.findOne({ semester, year });

        if (current) {
            return res.send("This current already exists, pleaes try again.")
        } else {
            const new_current = await adminModel.create({
                admin: user.cmuAccount,
                semester,
                year
            })
            return res.send('New current has been added.')
        }
    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .send({ ok: false, message: "Internal Server Error" })
    }
})

router.get("/", async (req,res) =>{
    try {
        const token = req.cookies.token;
        const user = await verifyAndValidateToken(token);
        if (!user.cmuAccount) return res.status(403).send({ ok: false, message: "Invalid token" });

        const currents = await adminModel.find({})

        return res.send(currents)
    } catch (err) {
        console.log(err)
        return res
            .status(500)
            .send({ ok: false, message: "Internal Server Error" })
    }
})

module.exports = router;