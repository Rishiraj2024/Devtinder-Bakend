const express=require("express")
const app=express()
const connectDB=require("./config/database")

 const cors=require("cors")
 const cookieParser=require("cookie-parser")
 app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
 }))
 app.use(express.json())
 app.use(cookieParser())

const authRouter= require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
const userRouter=require("./routes/user")
app.get("/", (req, res) => {
  res.send("hi bakend are you");
});
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)
 connectDB().then(()=>{
console.log("ho gya bhai")
  }).catch(err=>{
console.log("sorry bro")
  })
  

app.listen(3000)


 

























//  const express=require("express")
//  const app=express()
//  const {adminAuth,userAuth}=require("./middlewares/auth")
//  //this will amtch all http methos to slicetst
// app.use("/admin",adminAuth   )
// app.use("/user",userAuth)
//  app.get("/user",(req,res,next)=>{
//    //  res.send({firdtname: "rihsi",lastname:"pooja"})
//    next()
//  },(req,res,next)=>{
//     res.send({firdtname: "rihsirajjj",lastname:"pooja"})
//  }
// )
//  app.post("/admin/alldata",(err,req,res,next)=>{
//    throw new Error("abcdef")
//     res.send("tota mai ke")
//  })
//  app.delete("/user/self",(req,res)=>{
//     res.send("you are fucked up")
//  })
//  app.post("/slice",(req,res,next)=>{
  
// next()
//  },(req,res)=>{
//    res.send("hii mammy")
//  })

// //  app.use("/mai",(req,res)=>{
// //     console.log(req.query)
// //     res.send("tora mai ke")
// //  })
//  app.use("/mai/:maiId",(req,res)=>{
//     // console.log(req.query)
//      console.log(req.params)
//     res.send("tora mai ")
//  })
 
//  app.listen(3000)
//  //server
