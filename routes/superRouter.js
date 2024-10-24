const express = require("express");
const bcrypt = require('bcrypt')
const router = express.Router();

const { UserModel, RoleModel } = require("../models/models");

router.post('/create-admin', async (req, res) => {
    const roleName = "Admin"
    const permissions = ["Create", "Read", "Update", "Delete"]
    let roleInst

    try {
        roleInst = new RoleModel({
            name: roleName,
            permissions: permissions
        })

        await roleInst.save()
    } catch(e) {
        console.log('Admin role already exists')
        roleInst = await RoleModel.findOne({
            name: 'Admin'
        })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        const userInst = new UserModel({
            username: req.body.username,
            password: hashedPassword,
            role: roleInst._id
        })
        await userInst.save()
        return res.send(userInst)
    } catch(e) {
        res.status(400).send('username already exists')
    }

})

module.exports = router