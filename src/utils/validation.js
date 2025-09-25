 const validator=require("validator")
 const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId}=req.body
    const {password}=req.body
    if(!firstName|| !lastName){
        throw new Error(" Name is not valid ")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password is not valid")
    }
 }
 const passwordStrongCheck=(req)=>{
    const {password}=req.body
    if(!validator.isStrongPassword(password)){
        throw new Error("password is not valid")}
 }
 const validateProfileData=(req)=>{
     const allowedEditFields=["firstName","lastName","emailId","photoUrl","age","gender","about","skills"]
   const isEditAllowed= Object.keys(req.body).every((k)=>allowedEditFields.includes(k))
   if(!isEditAllowed){
    throw new Error("upadte cannot be possible")
   }
   return isEditAllowed

 }
 module.exports={validateSignUpData,validateProfileData,passwordStrongCheck};