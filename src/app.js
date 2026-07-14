const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();
const {validateSignUp} = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuthentication} = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.get("/user-id", async (req, res) => {
  const userId = req.body.userId;
  try{
    const user = await User.findById(userId);
    if(!user){
      res.status(404).send("user not found");
    }
    else{
      res.send(user);
    }
  }
  catch(err){
      res.status(400).send("something went wrong");
  }
})

app.get("/user", async (req, res) => {
  
  try{
    const userEmail = req.body.emailId;
    const user = await User.findOne({emailId: userEmail});
    if(!user){
      res.status(404).send("User not found");
    }
    else{
      res.send(user);
    }
  }
  catch(err){
    res.status(400).send("something went wrong:" + err);
  }
})

app.post("/signup", async (req, res) => {
    try{
        // Validation of data
        validateSignUp(req);
        const {firstName, lastName, emailId, password} = req.body;
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
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

app.post("/login", async (req, res) => {
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
      res.send("Logged in successfully.")
    }
    else{
      throw new Error("Invalid credentials");
    }
  }
  catch(err){
        res.status(400).send("ERROR:"+ err.message);
    }
})

app.get("/profile", userAuthentication, async (req, res) => {
  try{
    user = req.user;
    res.send(user);
  }
  catch(err){
    res.status(400).send("ERROR:"+ err.message);
  }
})

app.post("/sendConnectionRequest", userAuthentication, (req, res) => {
  try{
    const user = req.user;
    res.send(user.firstName + " sent the connection request.")
  }
  catch(err){
    res.status(400).send("ERROR:"+ err.message);
  }
})

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try{
    user = await User.findByIdAndDelete(userId);
    if(!user){
      res.status(404).send("user not found");
    }
    else{
      res.send(`Deleted ${user.firstName} suceesfully.`)
    }
  }
  catch(err){
    res.status(400).send("something went wrong");
  }
})

// app.patch("/user", async (req, res) => {
//   try{
//     const user = await User.findByIdAndUpdate(req.body.userId, req.body, {returnDocument: 'after',
//       runValidators: true
//     });
//     if(!user){
//       res.status(400).send("user not found.");
//     }
//     else res.send(`Updated ${user.firstName} suceessully.`);
//   }
//   catch(err){
//     res.status(400).send("sUpdate Failed"+err);
//   }
// })

app.patch("/user/:emailId", async (req, res) => {
  try{
    const ALLOWED_UPDATES = [
      "userId", "photoURL", "about", "gender", "age", "skills"
    ]
    isUpdateAllowed = Object.keys(req.body).every((k) => ALLOWED_UPDATES.includes(k));
    if(!isUpdateAllowed){
      throw new Error("Update not allowed");
    }
    if(req.body?.skills.length > 10){
      throw new Error("Skills cannot be more than 10.");
    }
    const user = await User.findOneAndUpdate({emailId: req.params.emailId}, req.body, {returnDocument: 'before',
      runValidators: true
    });
    console.log(req.body.email);
    if(!user){
      res.status(400).send("user not found.");
    }
    else res.send(`Updated ${user.firstName} suceessully.`);
  }
  catch(err){
    res.status(400).send("Update Failed"+err);
  }
})

connectDB()
  .then(() => {
    console.log("Daabase connection is established.");
    app.listen(7777, () => {
      console.log("server started sucessully at 7777...");
    });
  })
  .catch((err) => {
    console.log("Database can not connect.", err);
  });
