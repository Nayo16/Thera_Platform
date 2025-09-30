const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
 name:{
        type:"String",
        required:true,
    },
 email:{
        type:"String",
        required:true,
        unique:true,
    },   
password:{
    type:"String",
    required:true,
    
}, 
role:{
    type:"String",
    enum:["client","therapist","admin"],
    default:"client",
    required:true,
},
specialization:{
    type:"String",
   required:function(){
    return this.role==="therapist";
   }  
},
},

{ timestamps:true}  

);

module.exports= mongoose.model("User", userSchema);
