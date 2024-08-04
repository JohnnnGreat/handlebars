const mongoose = require("mongoose");

const AuthInfo = mongoose.Schema({
  email: String,
  username: String,
  password: String,
});

const Auth = mongoose.model("Auth", AuthInfo);

module.exports = Auth;
