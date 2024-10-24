require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { UserModel, RefreshTokenModel } = require("../models/models");
const authenticateToken = require('../middlewares/authenticateToken')
const authenticateRefresh = require('../middlewares/authenticateRefresh')



router.get('/validate-refresh', authenticateRefresh, async (req, res) => {
    return res.json({
        username: req.user.username,
        role: req.role
    })
})

router.post("/login", async (req, res) => {
    const user = await UserModel.findOne({
        username: req.body.username,
    }).populate("role");
    if (!user) return res.sendStatus(404)
    if (user.role === null) return res.sendStatus(401)

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateAccess(user);
            const refreshTokenCode = generateRefresh(user);

            const newRefreshTokenInst = new RefreshTokenModel({
                username: user.username,
                code: refreshTokenCode,
            });
            await newRefreshTokenInst.save();

            return res.json({
                accessToken: accessToken,
                refreshToken: refreshTokenCode,
                permissions: user.role.permissions
            });
        } else {
            return res.sendStatus(400);
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }
});

router.get("/token", authenticateRefresh, async (req, res) => {
    const oldRefreshTokenCode = req.token

    try {
        await RefreshTokenModel.deleteOne({ code: oldRefreshTokenCode });
        const accessToken = generateAccess(req.user);
        const newRefreshTokenCode = generateRefresh(req.user);
        const newRefreshTokenInst = new RefreshTokenModel({
            username: req.user.username,
            code: newRefreshTokenCode,
        });
        await newRefreshTokenInst.save();

        return res.json({
            accessToken: accessToken,
            refreshToken: newRefreshTokenCode,
            username: req.user.username,
            role: req.role
        });

    } catch(e) {
        return res.status(500).send(e.message)
    }
});

// log out
router.get("/logout", authenticateRefresh, async (req, res) => {
    try {
        console.log(req.user.username)
        await RefreshTokenModel.deleteMany({username: req.user.username})
        return res.send('logged out from all device')
    } catch(e) {
        return res.status(400).send(e.message)
    }
})


// helper functions
function generateAccess(user) {
    return jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1m" }
    );
}

function generateRefresh(user) {
    return jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "3m" }
    );
}

module.exports = router;
