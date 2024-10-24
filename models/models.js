const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// role model
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  permissions: [
    {
      type: String,
      enum: ["Create", "Read", "Update", "Delete"],
    },
  ],
});
const RoleModel = mongoose.model("Role", roleSchema);



// user model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }
});
userSchema.plugin(uniqueValidator);
const UserModel = mongoose.model("User", userSchema);



// news model
const newsSchema = new mongoose.Schema({
  title: String,
  body: String,
});
const NewsModel = mongoose.model("News", newsSchema);



const refreshTokenSchema = new mongoose.Schema({
  username: String,
  code: String,
});
const RefreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports.UserModel = UserModel;
module.exports.NewsModel = NewsModel;
module.exports.RoleModel = RoleModel;
module.exports.RefreshTokenModel = RefreshTokenModel;
