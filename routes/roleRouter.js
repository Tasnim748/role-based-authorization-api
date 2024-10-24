const express = require("express");
const { RoleModel, UserModel } = require("../models/models");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");


router.get('/', authenticateToken, async (req, res) => {
    const roles = await RoleModel.find()
    return res.json(roles)
})

router.post('/', authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({username: req.user.username}).populate("role")
    if (!user) return res.sendStatus(404)
    if (user.role === null) return res.status(401).send('This user has not any role')
    if (user.role.name !== "Admin") {
        return res.status(403).send('Not Allowed')
    }

    try {
        const newRole = new RoleModel(req.body)
        await newRole.save()
        return res.status(201).json(newRole)
    } catch(e) {
        return res.status(500).send(e.message)
    }
})


router.put('/', authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({username: req.user.username}).populate("role")
    if (!user) return res.sendStatus(404)
    if (user.role === null) return res.status(401).send('This user has not any role')

    if (user.role.name !== "Admin") {
        return res.status(403).send('Not Allowed')
    }

    try {
        const updatedRole = await RoleModel.findByIdAndUpdate(
            req.body._id, 
            req.body, 
            { new: true }
        )
    
        return res.status(201).json(updatedRole)
    } catch(e) {
        return res.status(500).send(e.message)
    }
})

router.delete("/", authenticateToken, async (req, res) => {
    const user = await UserModel.findOne({username: req.user.username}).populate("role")
    if (!user) return res.sendStatus(404)
    if (user.role === null) return res.status(401).send('This user has not any role')

    if (user.role.name !== "Admin") {
        return res.status(403).send('Not Allowed')
    }

    let deletedRole = await RoleModel.findByIdAndDelete(
        req.query.id,
        {new: true}
    );
    return res.json(deletedRole);
})

module.exports = router