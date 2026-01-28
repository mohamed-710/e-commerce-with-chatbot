import mongoose from "mongoose";


const tokenSchema =mongoose.Schema({
    token :{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    isValid:{type:Boolean,default:true},
    agent:{type:String},
    expiredAt:{type:Date},
},
{timestamp:true}

);

const Token=mongoose.model("Token",tokenSchema);

export default Token;
   