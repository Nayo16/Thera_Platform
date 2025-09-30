const mongoose= require('mongoose');
const User = require('./User');

const sessionSchema= new mongoose.Schema({
    clientID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },

    therapistID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    sessionDate:{
        type: Date,
        required: true,
    },

    notes:{
        type: String,
        required: false,
    },

    mode:{
        type: String,
        enum:["chat", "video" , "in-person"],
        required: true,
    },

    status:{
        type: String,
        enum:["scheduled", "completed" , "canceled"],
        default:"scheduled",
        required: true,
    },}
,{timestamps: true});


module.exports= mongoose.model("Session", sessionSchema);
