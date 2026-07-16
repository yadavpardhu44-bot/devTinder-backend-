const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
