const express = require("express")
const jwt = require("jsonwebtoken")
const authRouter = express.Router()
const User = require("../models/user")
const { validateSignUpData } = require("../utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const { sendWelcomeEmail } = require("../config/mailer"); // adjust path as needed


authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req)
    const { firstName, lastName, emailId, password, photoUrl } = req.body
    const passwordHash = await bcrypt.hash(password, 5)
    const user = new User({
      firstName, lastName, emailId, password: passwordHash, photoUrl
    })

    // console.log(req.body)
    //create a new instance
    // const user=new User({
    //    firstName:'poonam',
    //    lastName:'yadav',
    //    emailId:'rishi@gmail.com',
    //    password:'aksj123'
    // })


    const savedUser = await user.save()
   sendWelcomeEmail(savedUser.firstName, savedUser.emailId);
    const token = await savedUser.getJWT()
    res.cookie("token", token)
    res.json({ message: "user added succesfullt", data: savedUser })
    
  } catch (err) {
    res.status(400).send("error  message " + err.message)
  }
})
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body
    const user = await User.findOne({ emailId: emailId })
    if (!user) {
      throw new Error("invalid credential]")
    }
    const isPasswordVlaid = await user.validatePassword(password)
    if (isPasswordVlaid) {
      const token = await user.getJWT()
      res.cookie("token", token)
      res.send(user)
      //  console.log(user)
    } else {
      throw new Error("user password is wrong")
    }
  } catch (err) {
    res.status(400).send("error  message " + err.message)
  }
})


authRouter.get("/user", async (req, res) => {
  const userEmail = req.body.emailId
  //  console.log(userEmail)



  const user = await User.findOne({ emailId: userEmail })

  if (!user) {
    res.status(484).send("user not found")
  }
  else {
    res.send(user)


  }
  //        try{
  //        const user=await User.findOne({emailId:userEmail})

  //        if(user.length===0){
  //          res.status(484).send("user not found")
  //        }
  //        else{
  // res.send(user)
  //        }

  //        }catch(err){
  //          console.log(err.message+"not worikng")
  //        }
})
authRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (err) {
    console.log(err.message + "not worikng")
  }
})
authRouter.delete("/user", async (req, res) => {
  const userId = req.body.userId
  console.log(userId)
  try {
    const user = await User.findByIdAndDelete({ _id: userId })
    res.send("delete ho gya bhai")
  } catch (err) {
    console.log(err.message + "not worikng")
  }
})
authRouter.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId
  const data = req.body

  try {
    const ALLOWED_UPDATES = ["userId", "photoUrl", "about", "gender", "age", "skills"]
    const isUpdatedAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k))
    if (!isUpdatedAllowed) {
      throw new Error("you are fucked at update new value")
    }
    if (data?.skills.length > 10) {
      throw new Error("skilssa re more thna 10")
    }
    await User.findByIdAndUpdate({ _id: userId }, data, { runValidotrs: true })
    res.send("update ho gya bhai")
  } catch (err) {
    console.log(err.message + "not worikng")
  }
})
authRouter.post("/logout", async (req, res) => {

  res.cookie("token", null, {
    expires: new Date(Date.now())

  })
  res.send("logout sccesfully")
})
module.exports = authRouter