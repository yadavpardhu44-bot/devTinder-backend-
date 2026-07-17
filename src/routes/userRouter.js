const express = require("express");
const userRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photourl gender age about skills";

userRouter.get(
  "/user/requests/received",
  userAuthentication,
  async (req, res) => {
    try {
      const loggedInuser = req.user;
      const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInuser._id,
        status: "interested",
      }).populate("fromUserId", USER_SAFE_DATA);
      res.json({
        message: "Data fetched successfully.",
        data: connectionRequests,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err);
    }
  },
);

userRouter.get("/user/connections", userAuthentication, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInuser._id, status: "accepted" },
        { toUserId: loggedInuser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = connectionRequests.map((row) => {
        if(row.toUserId._id.equals(loggedInuser._id)){
            return row.fromUserId;
        }
        return row.toUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

module.exports = userRouter;
