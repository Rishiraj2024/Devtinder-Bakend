  const mongoose=require("mongoose")
  const connectDB=async()=>{
mongoose.connect("mongodb+srv://Rishi_2024:pR8FG7wm4HO6Qm60@cluster0.ebmmkqy.mongodb.net/devTinder")
  }
  module.exports=connectDB
 