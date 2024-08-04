const express = require("express");
const Auth = require("../schema/auth");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/signup", async (req, res) => {
  const errors = [];
  try {
    const { email, password, username } = req.body;
    const findUser = await Auth.findOne({ email });
    if (findUser) {
      errors.push({ msg: "Email Already Exist, please try another email" });
    }

    if (errors.length > 0) {
      return res.render("signup", { errors, username, email });
    }
    const userAdded = await Auth.create(req.body);
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const errors = [];
  try {
    const findUser = await Auth.findOne({ email });
    if (!findUser) {
      return errors.push({ message: "User not found" });
    }
    if (password !== findUser.password) {
      errors.push({ message: "Password is incorrect" });
    } else {
      req.session.user = findUser;
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error login out" });
    }

    return res.redirect("/");
  });
});
module.exports = router;
