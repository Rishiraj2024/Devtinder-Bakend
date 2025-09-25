 const mongoose=require("mongoose")
 const connectionRequestScehma=mongoose.Schema({
fromUserId:{
    type:mongoose.Schema.Types.ObjectId,
       ref:"user",
    required:true


},
toUserId:{
type:mongoose.Schema.Types.ObjectId,
ref:"user",
  required:true
},
status:{
   type:String,
     required:true,
   enum:{
    values:["ignored","interested","accepeted","rejected"],
    message:'{value} is incorrect status type'
   }
}

 },{
    timestamps:true
 })
 connectionRequestScehma.index({fromUserId:1,toUserId:1})
 connectionRequestScehma.pre("save", function(next){
  const connectionRequest=this
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection request to yourself")

  }
  next()
 })
 const connnextionRequestModel=new mongoose.model("connectionRequest",connectionRequestScehma)
 module.exports=connnextionRequestModel