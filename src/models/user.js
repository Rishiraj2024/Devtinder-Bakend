 const mongoose=require("mongoose")
 const validator=require("validator")
 const bcrypt =require("bcrypt")
 const jwt=require("jsonwebtoken")
 const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
       
        minLength:4,
        maxLength:50
    },lastName:{
        type:String,
        
    },
    emailId:{
        lowercase:true,
        type:String ,
        validate(value){
             if(!validator.isEmail(value)){
                throw new Error("Email ia inapporipiate")
             }
        },

        required:true ,
        unique:true,
        trim:true
    },password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                 throw new Error("password sahi kar sronrg kar chake")
            }
        }
    },
    age:{
        type:Number,
       
        min:18,
        max:50

    },
    gender:{
        type:String,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("gender sahi kar chake")
            }
        }
    },
    photoUrl:{
        type:String,
         validate(value){
            if(!validator.isURL(value)){
                throw new Error("img url sahi kar chake")
            }
        }
    },
    about:{
        type:String,
        default:"Thos is defauly about of udser"
    },
    skills:{
        type:[String]
    }
 },{
    timestamps:true
 })

userSchema.methods.getJWT=async function(){
    const user=this
    const token=jwt.sign({_id:user._id},"DEV@Tinder790")
return token
}
userSchema.methods.validatePassword=async function (passwordInputByUser){
    const user=this
    const passwordHash=user.password
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash)
    return isPasswordValid
}

 const userModel=mongoose.model("user",userSchema)
 module.exports=userModel