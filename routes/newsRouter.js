const express = require("express");
const { NewsModel, UserModel } = require("../models/models");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/", authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({
        username: req.user.username,
    }).populate("role");
    if (!user) return res.sendStatus(404)
    if (user.role === null) return res.sendStatus(401)

    const permissions = user.role.permissions;
    console.log(user.role, permissions);

    if (permissions.includes("Read")) {
        const news = await NewsModel.find();
        return res.json(news);
    }
    return res.sendStatus(403)
});

router.post("/", authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({
        username: req.user.username,
    }).populate("role")
    if (!user) return res.sendStatus(404)
    if (user.role === null) return res.sendStatus(401)

    const permissions = user.role.permissions;
    console.log(user.role, permissions);

    if (permissions.includes("Create")) {
        const newNews = new NewsModel(req.body);
        await newNews.save();
        return res.json(newNews);
    }

    return res.sendStatus(403)
});

router.put("/", authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({
        username: req.user.username,
    }).populate("role")
    if (!user) return res.sendStatus(404)
    if (user.role === null) return res.sendStatus(401)
    const permissions = user.role.permissions;
    console.log(user.role, permissions);

    if (permissions.includes("Update")) {
        const updatedNews = await NewsModel.findByIdAndUpdate(
            req.body._id, 
            req.body, 
            { new: true }
        )
        return res.json(updatedNews);
    }
    return res.sendStatus(403);
});

router.delete("/", authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({
        username: req.user.username,
    }).populate("role")
    if (!user) return res.sendStatus(404)
    if (user.role === null) return res.sendStatus(401)

    const permissions = user.role.permissions;
    console.log(user.role, permissions);

    if (permissions.includes("Delete")) {
        const deletedNews = await NewsModel.findByIdAndDelete(
            req.query.id, 
            {new: true}
        );
        return res.json(deletedNews);
    }
    return res.sendStatus(403);
});

module.exports = router;
