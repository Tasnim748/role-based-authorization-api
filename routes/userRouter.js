require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { UserModel, RoleModel } = require("../models/models");

const authenticateToken = require("../middlewares/authenticateToken");

router.get("/", authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({
        username: req.user.username,
    }).populate("role");
    if (!user) return res.sendStatus(404)
    if (user.role === null) return res.sendStatus(401)

    if (user.role.name !== "Admin") {
        return res.sendStatus(403)
    }
    let users = await UserModel.find().populate("role");
    res.json(users);
});

router.post("/", authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({
        username: req.user.username,
    }).populate("role")
    if (!user) return res.sendStatus(404)
    if (user.role === null) return res.sendStatus(401)

    if (user.role.name !== "Admin") {
        return res.sendStatus(403)
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new UserModel({
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role,
        });
        await user.save();

        let roleDetail = await RoleModel.findById(req.body.role)
        user.role = roleDetail
        return res.status(201).json(user);
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

router.delete("/", authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({
        username: req.user.username,
    }).populate("role")
    if (!user) return res.sendStatus(404)
    if (user.role === null) return res.sendStatus(401)

    if (user.role.name !== "Admin") {
        return res.sendStatus(403)
    }
    let deletedUser = await UserModel.findByIdAndDelete(
        req.query.id,
        {new: true}
    );
    return res.json(deletedUser);
});

router.put("/", authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({
        username: req.user.username,
    }).populate("role")
    if (!user) return res.sendStatus(404)
    if (user.role === null) return res.sendStatus(401)
        
    if (user.role.name !== "Admin") {
        return res.sendStatus(403)
    }

    try {
        if (req.body.password) {
            let hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.body._id, 
            req.body, 
            { new: true }
        )

        let roleDetail = await RoleModel.findById(req.body.role)
        updatedUser.role = roleDetail
        return res.status(201).json(updatedUser);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;
