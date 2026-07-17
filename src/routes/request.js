const express = require("express")
const requestRouter = express.Router();
const {userAuthentication} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuthentication, async (req, res) => {
  try{
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["interested", "ignored"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "Invalid status type"});
    }
    const isConnectionRequestExist = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })
    if(isConnectionRequestExist){
      return res.status(400).json({message: "connection request already exists."});
    }
    const toUser = await User.findById(toUserId);
    if(!toUser){
      return res.status(400).json({message: "user not found"});
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })
    const data = await connectionRequest.save();
    res.json({
      message: req.user.firstName + " " +(status === "interested"?"is interested in":"ignored") + " " + toUser.firstName,
      data
    });
  }
  catch(err){
    res.status(400).send("ERROR: "+ err.message);
  }
})

requestRouter.post("/request/review/:status/:requestId", userAuthentication, async (req, res) => {
  try{
    const loggedInuser = req.user;
    const allowedStatus = ["accepted", "rejected"];
    const {status, requestId} = req.params
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "Invalid status type"});
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInuser._id,
      status: "interested",
    })
    if(!connectionRequest){
      return res.status(400).json({message: "connection request not found"});
    }
    connectionRequest.status = status;
    const data =  await connectionRequest.save();
    res.json({
      message: "connection request " + status,
      data,
    })
  }
  catch(err){
    res.status(400).send("ERROR: "+ err.message);
  }
})
module.exports = requestRouter;