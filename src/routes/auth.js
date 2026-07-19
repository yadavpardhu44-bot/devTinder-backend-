const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {validateSignUp} = require("../utils/validate");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try{
        // Validation of data
        validateSignUp(req);
        const {firstName, lastName, emailId, password} = req.body;
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        //Creating a new insance
        const user = new User({
          firstName,
          lastName,
          emailId,
          password: passwordHash
        })
        await user.save();
        res.send("user added successfully.");
    }
    catch(err){
        res.status(400).send("Error saving user:"+ err.message);
    }
})

authRouter.post("/login", async (req, res) => {
  try{
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid){
      const token = await user.getJWT();
      res.cookie("token", token, {expires: new Date(Date.now() + 1 * 3600000)});
      res.send(user);
    }
    else{
      throw new Error("Invalid credentials");
    }
  }
  catch(err){
        res.status(400).send("ERROR:"+ err.message);
    }
})

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  })
  res.send("logged out");
})

module.exports = authRouter;