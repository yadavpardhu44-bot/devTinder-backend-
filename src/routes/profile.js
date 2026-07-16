const express = require("express");
const profileRouter = express.Router();
const {userAuthentication} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validate")

profileRouter.get("/profile/view", userAuthentication, (req, res) => {
  try{
    user = req.user;
    res.send(user);
  }
  catch(err){
    res.status(400).send("ERROR:"+ err.message);
  }
})

profileRouter.patch("/profile/edit", userAuthentication, async (req, res) => {
  try{
    const loggedInUser = req.user;
    const isValidEditData = validateEditProfileData(req);
    if(!isValidEditData){
      throw new Error("Invalid edit data");
    }
    Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} profile updated successfully.`,
      data: loggedInUser,
    })
  }
    catch(err){
      res.status(400).send("ERROR:"+ err.message);
  }
})

module.exports = profileRouter;