const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();
app.use(express.json());
app.post("/signup", async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save();
        res.send("user added successfully.")
    }
    catch(err){
        res.status(400).send("Error saving user:"+ err.message);
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
