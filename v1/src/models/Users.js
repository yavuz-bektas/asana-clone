var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
  {
    full_name: String,
    password: String,
    email: String,
    profil_image: String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("users", UserSchema);
