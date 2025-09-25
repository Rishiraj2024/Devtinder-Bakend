 const express=require("express")
const profileRouter=express.Router()
  const cookieParser=require("cookie-parser")
const {validateProfileData}=require("../utils/validation")
const {validateSignUpData,passwordStrongCheck}=require("../utils/validation")
  const {userAuth}=require("../middlewares/auth")
const connectDB = require("../config/database")
const bcrypt=require("bcrypt")
 profileRouter.get("/profile/view",userAuth,async(req,res)=>{
   try{
  const user=req.user
  if(!user){
     throw new Error("user not found")
   }
 console.log(user)
   res.send(user)
   }catch(err){
    res.status(400).send("error  message "+err.message)
 }
 })
 profileRouter.post("/profile/edit",userAuth,async(req,res)=>{
    try{
         if(! validateProfileData(req)){
        throw new Error("Inavlid edit request")
       }
       const loggedInUser=req.user
       
       Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))
       loggedInUser.save()
       res.json({message:`${loggedInUser.firstName}   your profilr is updated`,data:loggedInUser})
    
    }catch(err){
    res.status(400).send("error  message: "+err.message)
 }
 })
 profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
   try{
passwordStrongCheck(req)
    const inputPassword=req.body.password
    const inputhash=await bcrypt.hash(inputPassword,5)
    const loggedInuser=req.user
 
// console.log(loggedInuser)
      loggedInuser.password=inputhash
         loggedInuser.save()
         res.send("password updated succefully")
   }catch(err){
    res.status(400).send("error  message: "+err.message)
 }
 })
 module.exports=profileRouter