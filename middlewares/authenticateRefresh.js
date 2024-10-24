require("dotenv").config();
const jwt = require("jsonwebtoken");
const { RefreshTokenModel, UserModel } = require("../models/models")

async function authenticateRefresh(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === 'null') {
        console.log('token null')
        return res.sendStatus(404)
    }

    if (await RefreshTokenModel.findOne({code: token})) {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                await RefreshTokenModel.deleteOne({code: token})
                return res.sendStatus(404)
            }
            const userInst = await UserModel.findOne({
                username: user.username,
            }).populate("role");
            if (!userInst) { 
                await RefreshTokenModel.deleteOne({code: token})
                return res.sendStatus(404)
            }
            if (userInst.role === null) {
                await RefreshTokenModel.deleteOne({code: token})
                return res.sendStatus(401)
            }
            req.user = user
            req.role = userInst.role
            req.token = token
            next();
        });
    } else {
        console.log('token isnot in db')
        return res.sendStatus(404)
    }
}

module.exports = authenticateRefresh