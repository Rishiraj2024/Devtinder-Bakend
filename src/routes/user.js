const express = require("express")
const { userAuth } = require("../middlewares/auth")
const connnextionRequestModel = require("../models/connectionRequest")
const User=require("../models/user")
const userRouter = express.Router()
const USER_SAFE_DATA="firstName lastName about photoUrl skills"
// get all pending connection requests for the loggedIn user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user

    const connectioRequest = await connnextionRequestModel.find({
      toUserId: loggedInuser._id,
      status: "interested"
    }).populate("fromUserId",USER_SAFE_DATA)

    res.json({
      message: "Data fetched succesfully",
      data: connectioRequest
    })
  } catch (err) {
    res.status(400).send("Error Message: " + err.message)
  }
})
//it show my connections
userRouter.get("/user/connections",userAuth,async(req,res)=>{
  try{
      const loggedInUser=req.user
      const connectionRequest=await connnextionRequestModel.find({
        $or:[
          {toUserId:loggedInUser._id,status:"accepeted"},
          {fromUserId:loggedInUser._id,status:"accepeted"}
        ]
      }).populate("fromUserId",USER_SAFE_DATA)
      const data=connectionRequest.map((row)=>{
        if(row.fromUserId._id.toString()==loggedInUser._id.toString()){
          return row.toUserId
        }
         return row.fromUserId} )


      res.json({message:"data fetched susseesfully",
        connectionRequest
    })
  }catch (err) {
    res.status(400).send("Error Message: " + err.message)
  }
})
userRouter.get("/userfeed",userAuth,async(req,res)=>{
  try{
 const loggedInUser=req.user
 const connectionRequst=await connnextionRequestModel.find({
  $or:[
    {fromUserId:loggedInUser._id},
    {toUserId:loggedInUser._id}
  ]
 }).select("fromUserId toUserId")
 const hideUserFromfeed=new Set()
 const page=parseInt(req.query.page)||1
 let limit=parseInt(req.query.limit)||10
 limit=limit>50?50:limit
 const skip=(page-1)*limit
 connectionRequst.forEach(req=>{
  hideUserFromfeed.add(req.fromUserId.toString())
  hideUserFromfeed.add(req.toUserId.toString())
 })
 console.log(hideUserFromfeed)
 const users=await User.find({
  $and:[
    //not in array
    //not evry
    {_id:{$nin:Array.from(hideUserFromfeed)}},
    {_id:{$ne:loggedInUser._id}}
  ]
 }).select(USER_SAFE_DATA).skip(skip).limit(limit)
 res.send(users)
  }catch (err) {
    res.status(400).send("Error Message: " + err.message)
  }
})
module.exports = userRouter
