const express = require("express");
const userRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photourl gender age about skills";
const User = require("../models/user");

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
      if (row.toUserId._id.equals(loggedInuser._id)) {
        return row.fromUserId;
      }
      return row.toUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

userRouter.get("/user/feed", userAuthentication, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInuser._id }, { toUserId: loggedInuser._id }],
    }).select("fromUserId toUserId");
    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInuser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

module.exports = userRouter;
