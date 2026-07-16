const express = require("express")
const requestRouter = express.Router();
const {userAuthentication} = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuthentication, (req, res) => {
  try{
    const user = req.user;
    res.send(user.firstName + " sent the connection request.")
  }
  catch(err){
    res.status(400).send("ERROR:"+ err.message);
  }
})

module.exports = requestRouter;