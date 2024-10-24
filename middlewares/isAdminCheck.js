require("dotenv").config();
const jwt = require('jsonwebtoken')

function isAdminCheck(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    console.log("token", token)
    return res.status(401).send();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send();
    
    req.user = user

    next();
  });
}

module.exports = isAdminCheck
