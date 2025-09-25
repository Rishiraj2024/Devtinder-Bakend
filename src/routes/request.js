const express = require("express")
const cookieParser = require("cookie-parser")
const { userAuth } = require("../middlewares/auth")
const connnextionRequestModel = require("../models/connectionRequest")
const User = require("../models/user")

const requestRouter = express.Router()

// ✅ Send Connection Request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id
    const toUserId = req.params.toUserId
    const status = req.params.status

    const allowedStatus = ["ignored", "interested"]

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type: " + status,
      })
    }

    const toUser = await User.findById(toUserId)
    if (!toUser) {
      return res.json({
        message: "User is not present",
      })
    }

    // ✅ Check if request already exists
    const existingConnectingRequest = await connnextionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    })

    if (existingConnectingRequest) {
      return res.status(400).send("Connection has already been sent")
    }

    const connnextionRequest = new connnextionRequestModel({
      fromUserId,
      toUserId,
      status,
    })

    const data = await connnextionRequest.save()

    res.json({
      message: req.user.firstName + " is " + status + " in " + toUser.firstName,
      data,
    })
  } catch (err) {
    res.status(400).send("Error message: " + err.message)
  }
})

// ✅ Review Connection Request (accept/reject)
requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user
    const { status, requestId } = req.params
     console.log({status,requestId})
    const allowedStatus = ["accepeted", "rejected"]

    if (!allowedStatus.includes(status)) {
      return res.status(400).send("Invalid status")
    }

    const connectionRequest = await connnextionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested", // ✅ must be string
    })
//  console.log(connectionRequest)
    if (!connectionRequest) {
      return res.status(400).send("Connection request not found")
    }

    connectionRequest.status = status
    const data = await connectionRequest.save()

    res.json({
      message: "Connection request " + status,
      data,
    })
  } catch (err) {
    res.status(400).send("Error: " + err.message)
  }
})

module.exports = requestRouter
