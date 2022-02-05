// const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const User = mongoose.model("userRegisteration", UserSchema);

function AuthController() {
  return {
    home(req, res) {
      res.send("Hello world");
    },
    async register(req, res) {
      const { name, email, password } = req.body;
      console.log(name, email, password);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        if (!name || !email || !password) {
          return res.send("All fields are mandatory");
        }
        const existUser = await User.findOne({ email: email });
        if (!existUser) {
          const salt = await bcrypt.genSalt(10);
          const Hashpassword = await bcrypt.hash(password, salt);
          const user = new User({
            name: name,
            email: email,
            password: Hashpassword,
          });
          const data = await user.save();
          if (data) {
            console.log("Register successfully");
            const userId = {
              user: {
                id: data._id,
              },
            };
            const jwtToken = jwt.sign(userId, process.env.JWT_SECERET);
            res.json({ jwtToken });
          }
        } else {
          console.log("Already registered");
          return res.status(208).json({ err: "This email is already taken" });
        }
      } catch (error) {
        console.log("Something went wrong");
        console.log(error);
        res.status(500).send("something went wrong");
      }
    },
  };
}

module.exports = AuthController;